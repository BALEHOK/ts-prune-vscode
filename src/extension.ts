// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import logger from './logging/logger';
import { TsPrune } from './tsPrune';
import { UnusedExportsTreeProvider } from './unusedExportsTreeProvider';

// ts-prune-ignore-next
export function activate(context: vscode.ExtensionContext) {
  const unusedExportsTreeProvider = new UnusedExportsTreeProvider(
    new TsPrune()
  );

  const unusedExportsDisposable = vscode.window.registerTreeDataProvider(
    'unusedExports',
    unusedExportsTreeProvider
  );
  context.subscriptions.push(unusedExportsDisposable);

  const refreshCommandDisposable = vscode.commands.registerCommand(
    'tsPruneVscode.refresh',
    () => unusedExportsTreeProvider.refresh()
  );
  context.subscriptions.push(refreshCommandDisposable);

  logger.log('Extension "ts-prune-vscode" is now active!');
}

// ts-prune-ignore-next
export function deactivate() {
  // empty by intention
}
