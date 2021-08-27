export class ConsoleLogger {
  log(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams);
  }

  error(messageOrError: any, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.error(messageOrError, ...optionalParams);
  }
}

export default new ConsoleLogger();
