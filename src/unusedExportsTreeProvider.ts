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

interface ExportInfo {
  lineNumber: number;
  exportName: string;
}
interface FileInfo {
  path: string;
  relativePath: string;
  exports: ExportInfo[];
}

// eslint-disable-next-line prettier/prettier
export class UnusedExportsTreeProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new EventEmitter<void>();
  readonly onDidChangeTreeData: Event<void> = this._onDidChangeTreeData.event;

  private isPrune = true;
  private isRefreshing = false;
  private items: Record<string, FileInfo> = {};

  constructor(private readonly tsPrune: TsPrune) {}

  getTreeItem(element: ExportTreeItem): ExportTreeItem {
    return element;
  }

  getRootItems(): ExportTreeItem[] {
    return Object.values(this.items).map((fileInfo) => {
      const treeItem = new ExportTreeItem(fileInfo.relativePath, fileInfo);
      treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
      return treeItem;
    });
  }

  getLeafItems(fileInfo: FileInfo): ExportTreeItem[] {
    return fileInfo.exports.map((exportInfo) => {
      const treeItem = new ExportTreeItem(exportInfo.exportName);
      treeItem.collapsibleState = TreeItemCollapsibleState.None;
      treeItem.description = `:${exportInfo.lineNumber}`;
      treeItem.command = {
        command: 'vscode.open',
        title: 'Open',
        arguments: [
          Uri.file(fileInfo.path),
          {
            selection: new Range(
              exportInfo.lineNumber - 1,
              0,
              exportInfo.lineNumber - 1,
              6
            ),
          },
        ],
      };

      return treeItem;
    });
  }

  getChildren(element?: ExportTreeItem): ExportTreeItem[] {
    if (this.isPrune) {
      const treeItem = new ExportTreeItem('Hit Refresh to run the check');
      treeItem.collapsibleState = TreeItemCollapsibleState.None;
      return [treeItem];
    }

    if (this.isRefreshing) {
      const treeItem = new ExportTreeItem('Looking for unused exports...');
      treeItem.collapsibleState = TreeItemCollapsibleState.None;
      return [treeItem];
    }

    if (Object.keys(this.items).length === 0) {
      const treeItem = new ExportTreeItem('No unused exports found');
      treeItem.collapsibleState = TreeItemCollapsibleState.None;
      return [treeItem];
    }

    return !element
      ? this.getRootItems()
      : element.fileInfo
      ? this.getLeafItems(element.fileInfo)
      : [];
  }

  parseTsPruneOutput(tsPruneOutput: string) {
    const parts1 = tsPruneOutput.split(':');
    const path = parts1[0];

    const rootPath = workspace.workspaceFolders[0].uri.fsPath;
    const relativePath = path.substr(rootPath.length);

    const parts2 = parts1[1].split(' - ');
    const lineNumber = +parts2[0];
    const exportName = parts2[1];

    return [path, relativePath, lineNumber, exportName];
  }

  async refresh(): Promise<void> {
    logger.log('Refreshig...');
    this.isPrune = false;
    this.isRefreshing = true;
    this._onDidChangeTreeData.fire();

    const config = {
      rootPath: workspace.workspaceFolders[0].uri.fsPath,
      project: 'tsconfig.json',
    } as Config;

    const t0 = performance.now();
    const unusedExports = await this.tsPrune.run(config);
    const t1 = performance.now();

    const items = {};
    unusedExports.forEach((exportString) => {
      const [path, relativePath, lineNumber, exportName] =
        this.parseTsPruneOutput(exportString);
      if (!items[relativePath]) {
        items[relativePath] = {
          path,
          relativePath,
          exports: [],
        } as FileInfo;
      }

      items[relativePath].exports.push({
        lineNumber,
        exportName,
      } as ExportInfo);
    });

    this.items = items;
    this.isRefreshing = false;
    logger.log(`Refreshed in ${t1 - t0} milliseconds.`);

    this._onDidChangeTreeData.fire();
  }
}

class ExportTreeItem extends TreeItem {
  constructor(label: string, readonly fileInfo?: FileInfo) {
    super(label);
  }
}
