import { Logger } from './loggingTypes';
import * as vscode from 'vscode';

export class VsCodeOutputLogger implements Logger {
  private vscodeOutput: vscode.OutputChannel;

  constructor() {
    this.vscodeOutput = vscode.window.createOutputChannel('TS Prune');
  }

  debug() {
    // no debug in user console
  }

  log(message: string) {
    this.vscodeOutput.appendLine(message);
  }

  error(messageOrError: any) {
    const message =
      typeof messageOrError === 'string'
        ? messageOrError
        : JSON.stringify(messageOrError);
    this.vscodeOutput.appendLine(`[ERROR] ${message}`);
  }
}
