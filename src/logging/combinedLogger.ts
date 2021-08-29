import { Logger } from './loggingTypes';

export class CombinedLogger implements Logger {
  constructor(private readonly loggers: Logger[]) {}

  debug(message: string, ...optionalParams: any[]) {
    this.loggers.forEach((logger) => logger.debug(message, ...optionalParams));
  }

  log(message: string, ...optionalParams: any[]) {
    this.loggers.forEach((logger) => logger.log(message, ...optionalParams));
  }

  error(messageOrError: any, ...optionalParams: any[]) {
    this.loggers.forEach((logger) =>
      logger.error(messageOrError, ...optionalParams)
    );
  }
}
