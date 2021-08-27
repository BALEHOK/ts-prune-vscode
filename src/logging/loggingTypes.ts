export interface Logger {
  log(message: string, ...optionalParams: any[]): void;
  error(messageOrError: any, ...optionalParams: any[]): void;
}
