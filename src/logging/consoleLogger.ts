import { Logger } from './loggingTypes';

export class ConsoleLogger implements Logger {
  debug(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.debug(message, ...optionalParams);
  }

  log(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams);
  }

  error(messageOrError: any, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.error(messageOrError, ...optionalParams);
  }
}
