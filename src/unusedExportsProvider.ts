import * as vscode from 'vscode';
import { TreeItem } from './treeItem';

export class UnusedExportsProvider
  implements vscode.TreeDataProvider<TreeItem> {
  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): TreeItem[] {
    if (element) {
      if (element.level > 1) {
        return [];
      }

      return [...new Array(3)]
        .map((_, i) => `Item ${i}`)
        .map(
          (name) => new TreeItem(name, vscode.TreeItemCollapsibleState.None, 1)
        );
    } else {
      return [...new Array(5)]
        .map((_, i) => `File ${i}`)
        .map(
          (name) =>
            new TreeItem(name, vscode.TreeItemCollapsibleState.Collapsed, 0)
        );
    }
  }
}
