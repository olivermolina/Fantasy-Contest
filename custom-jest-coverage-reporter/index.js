'use strict';

var fs = require('fs');
var _inplace = require('json-in-place');
var path = require('path');
var _parser = require('yargs-parser');

const NAME = 'jest-ratchet';
const getLastError = (config) => {
  const { collectCoverage, coverageReporters } = config;
  if (!collectCoverage) {
    throw new CollectCoverageError();
  }
  if ((coverageReporters || []).indexOf('json-summary') === -1) {
    throw new JsonSummaryError();
  }
};
const tryOrReject = (reject, cb) => {
  try {
    cb();
  } catch (e) {
    reject(e);
  }
};
class JsonSummaryError extends Error {
  constructor() {
    super(
      `'json-summary' needs to be listed as a coverageReporter in order for ${NAME} to work appropriately.`,
    );
  }
}
class CollectCoverageError extends Error {
  constructor() {
    super(
      `'collectCoverage' option needs to be enabled in order for ${NAME} to work appropriately.`,
    );
  }
}
class TimeoutError extends Error {
  constructor(coverageDirectory, timeout) {
    super('Jest-Ratchet timed-out waiting for the Coverage Summary');
    this.coverageDirectory = coverageDirectory;
    this.timeout = timeout;
  }
}

const FIELDS = ['branches', 'functions', 'lines', 'statements'];
const inplace = _inplace;
const updateFile = (fileName, result) => {
  const jestConfigRaw = fs.readFileSync(fileName, 'utf-8');
  const jestConfig = JSON.parse(jestConfigRaw);
  const prefix = jestConfig.jest ? 'jest.' : '';
  const newFile = setCoverage(jestConfigRaw, result, prefix);
  fs.writeFileSync(fileName, newFile, 'utf-8');
};
const setCoverage = (source, result, prefix) => {
  prefix += 'coverageThreshold.';
  const newSource = inplace(source);
  for (const key of Object.keys(result)) {
    for (const field of FIELDS) {
      const value = result[key][field];
      if (value) {
        newSource.set(prefix + key + '.' + field, value);
      }
    }
  }
  return newSource.toString();
};

const findCoveragePath = (config) => {
  if (config.coverageDirectory) {
    return config.coverageDirectory;
  }
  if (config.rootDir) {
    return path.resolve(config.rootDir, 'coverage');
  }
  return path.resolve(process.cwd(), 'coverage');
};
const findCoverageSummaryPath = (coverageDirectory) => {
  return path.resolve(coverageDirectory, 'coverage-summary.json');
};

function noop() {}

const ratchetCoverage = (threshold, summary, options) => {
  const result = {};
  if (threshold) {
    for (const key of Object.keys(threshold)) {
      const summaryKey = key === 'global' ? 'total' : key;
      result[key] = ratchetSingleCoverage(
        threshold[key],
        summary[summaryKey],
        options,
      );
    }
  }
  return result;
};
const ratchetSingleCoverage = (threshold, summary, options) => {
  const { branches, functions, lines, statements } = threshold;
  return {
    branches: ratchetSingleNumberCoverage(branches, summary.branches, options),
    functions: ratchetSingleNumberCoverage(
      functions,
      summary.functions,
      options,
    ),
    lines: ratchetSingleNumberCoverage(lines, summary.lines, options),
    statements: ratchetSingleNumberCoverage(
      statements,
      summary.statements,
      options,
    ),
  };
};
const ratchetSingleNumberCoverage = (num, category, options) => {
  if (category && typeof num === 'number') {
    const tolerance = options.tolerance
      ? Math.round(category.pct) - options.tolerance
      : category.pct;
    if (num >= 0 && num <= tolerance) {
      return options.roundDown ? Math.floor(tolerance) : tolerance;
    } else if (num < 0 && num >= -category.covered) {
      return -category.covered;
    }
  }
};

class JestRatchet {
  constructor(globalConfig, options = {}) {
    this.getLastError = noop;
    this.onRunComplete = noop;
    this.runResult = Promise.resolve();
    if (!process.env.DISABLE_JEST_RATCHET) {
      this.getLastError = getLastError.bind(this, globalConfig);
      this.runResult = onRunComplete(globalConfig, options);
      this.runResult.catch((e) => {
        this.getLastError = () => {
          throw e;
        };
      });
    }
  }
}
const onSummaryReportComplete =
  (
    reject,
    resolve,
    watcher,
    timeoutTimer,
    coverageSummaryPath,
    jestConfigPath,
    globalConfig,
    options,
  ) =>
  () =>
    tryOrReject(reject, () => {
      watcher.close();
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
      const coverageRaw = fs.readFileSync(coverageSummaryPath, 'utf-8');
      const summary = JSON.parse(coverageRaw);
      const threshold = globalConfig.coverageThreshold;
      const ratchetResult = ratchetCoverage(threshold, summary, options);
      updateFile(jestConfigPath, ratchetResult);
      resolve();
    });
const onRunComplete = (globalConfig, options) =>
  new Promise((resolve, reject) =>
    tryOrReject(reject, () => {
      const coverageDirectory = findCoveragePath(globalConfig);
      const coverageSummaryPath = findCoverageSummaryPath(coverageDirectory);
      const jestConfigPath = './jest.coverage.json';
      if (!fs.existsSync(coverageDirectory)) {
        fs.mkdirSync(coverageDirectory);
      }
      if (!fs.existsSync(coverageSummaryPath)) {
        fs.closeSync(fs.openSync(coverageSummaryPath, 'w'));
      }
      const watcher = fs.watch(coverageDirectory);
      const timeout = options.timeout;
      const timeoutTimer = timeout
        ? setTimeout(() => {
            watcher.close();
            reject(new TimeoutError(coverageDirectory, timeout));
          }, timeout)
        : undefined;
      watcher.once(
        'change',
        onSummaryReportComplete(
          reject,
          resolve,
          watcher,
          timeoutTimer,
          coverageSummaryPath,
          jestConfigPath,
          globalConfig,
          options,
        ),
      );
    }),
  );

module.exports = JestRatchet;
