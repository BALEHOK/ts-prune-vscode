import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
  workspace,
  Range,
} from 'vscode';
import logger from './logging/logger';
import { Config, TsPrune } from './tsPrune';
import { performance } from 'perf_hooks';

// eslint-disable-next-line prettier/prettier
export class UnusedExportsTreeProvider implements TreeDataProvider<ExportInfo> {
  private _onDidChangeTreeData = new EventEmitter<ExportInfo>();

  readonly onDidChangeTreeData: Event<ExportInfo> =
    this._onDidChangeTreeData.event;

  private items: ExportInfo[] = [];

  constructor(private readonly tsPrune: TsPrune) {}

  getTreeItem(element: ExportInfo): TreeItem {
    const treeItem = new TreeItem(
      element.relativePath,
      TreeItemCollapsibleState.None
    );
    treeItem.description = element.exportName;
    treeItem.command = {
      command: 'vscode.open',
      title: 'Open',
      arguments: [
        Uri.file(element.path),
        {
          selection: new Range(
            element.lineNumber - 1,
            0,
            element.lineNumber - 1,
            6
          ),
        },
      ],
    };
    return treeItem;
  }

  getChildren(element?: ExportInfo): ExportInfo[] {
    return !element ? this.items : [];
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

    this.items = this.tsPrune.results.map((r) => new ExportInfo(r));

    logger.log(`Refreshed in ${t1 - t0} milliseconds.`);

    this._onDidChangeTreeData.fire();
  }
}

class ExportInfo {
  path: string;
  relativePath: string;
  exportName: string;
  lineNumber: number;

  constructor(tsPruneOutput: string) {
    const parts1 = tsPruneOutput.split(':');
    this.path = parts1[0];

    const rootPath = workspace.workspaceFolders[0].uri.fsPath;
    this.relativePath = this.path.substr(rootPath.length);

    const parts2 = parts1[1].split(' - ');
    this.lineNumber = +parts2[0];
    this.exportName = parts2[1];
  }
}
