import winston, { transports } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const LOGTAIL_SOURCE = process.env.LOGTAIL_SOURCE;
if (LOGTAIL_SOURCE) {
  // Create a Logtail client
  const logtail = new Logtail(LOGTAIL_SOURCE);
  logger.add(new LogtailTransport(logtail));
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.File({ filename: 'combined.log' }));
}

export default logger;
