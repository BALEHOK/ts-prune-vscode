// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import logger from './logging/logger';
import { UnusedExportsProvider } from './unusedExportsProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  logger.log('Extension "ts-prune-vscode" is now active!');

  const treeDataDisposable = vscode.window.registerTreeDataProvider(
    'unused-exports',
    new UnusedExportsProvider()
  );

  context.subscriptions.push(treeDataDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  // empty by intention
}
