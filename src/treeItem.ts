import * as vscode from 'vscode';

export class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly level: number
  ) {
    super(label, collapsibleState);
    this.description = 'my awesome tree item';
    this.tooltip = `${this.label}-${this.description}`;
  }
}
