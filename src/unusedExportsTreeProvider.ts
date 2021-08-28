import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  workspace,
} from 'vscode';
import logger from './logging/logger';
import { Config, TsPrune } from './tsPrune';
import { performance } from 'perf_hooks';
import { IConfigInterface } from 'ts-prune';
import path = require('path');

// eslint-disable-next-line prettier/prettier
export class UnusedExportsTreeProvider implements TreeDataProvider<string> {
  private _onDidChangeTreeData = new EventEmitter<string | void>();

  readonly onDidChangeTreeData: Event<string | void> =
    this._onDidChangeTreeData.event;

  constructor(private readonly tsPrune: TsPrune) {}

  getTreeItem(element: string): TreeItem {
    const treeItem = new TreeItem(element);
    treeItem.collapsibleState = TreeItemCollapsibleState.None;
    return treeItem;
  }

  getChildren(element?: string): string[] {
    return !element ? this.tsPrune.results : [];
  }

  refresh(): void {
    logger.log('refreshig...');
    const config = {
      rootPath: workspace.workspaceFolders[0].uri.fsPath,
      project: 'tsconfig.json',
    } as Config;

    const t0 = performance.now();
    this.tsPrune.run(config);
    const t1 = performance.now();

    logger.log(`Refreshed in ${t1 - t0} milliseconds.`);

    this._onDidChangeTreeData.fire();
  }
}
