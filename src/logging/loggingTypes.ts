export interface Logger {
  debug(message: string, ...optionalParams: any[]): void;
  log(message: string, ...optionalParams: any[]): void;
  error(messageOrError: any, ...optionalParams: any[]): void;
}
