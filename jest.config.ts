import { compilerOptions } from './tsconfig.json';
import type { Config } from '@jest/types';
import jestCoverage from './jest.coverage.json';

/**
 * Make `tsconfig.json`'s `paths` work in Jest
 * @link https://stackoverflow.com/a/56792936
 */
function makeModuleNameMapperFromTsConfig(srcPath: string) {
  // Get paths from tsconfig
  const { paths }: { paths: Record<string, string[]> } = compilerOptions;

  const aliases: { [key: string]: string } = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '/(.*)');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const path = paths[item]![0]!.replace('/*', '/$1');
    aliases[key] = srcPath + '/' + path;
  });
  return aliases;
}

const config: Config.InitialOptions = {
  silent: true,
  verbose: true,
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: [
    '**/tests/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next',
    '<rootDir>/playwright/',
    '.*e2e.*',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.svg$': 'jest-transformer-svg',
  },
  transformIgnorePatterns: [
    '//node_modules',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testEnvironment: 'jsdom',
  moduleNameMapper: makeModuleNameMapperFromTsConfig('<rootDir>'),
  globalSetup: './jest-setup.js',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'json-summary'],
  reporters: ['default', '<rootDir>/custom-jest-coverage-reporter'],
  collectCoverageFrom: ['<rootDir>/src/**'],
  ...jestCoverage,
};

export default config;
