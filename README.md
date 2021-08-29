# Unused exports in TypsScript

Finds unused exports in your Typescript project.

This extension wraps and provides VSCode GUI for the [ts-prune](https://github.com/nadeesha/ts-prune) tool.

Current implementation is simple and naive. It expects to find a `tsconfig.json` in the first workspace root folder. To get the list of unused exports hit the Refresh button. The extension does not track file changes, nor it updates the results list automatically.

Install from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=balehok.ts-prune-vscode)


## Attribution

Icons made by [Freepik](https://www.freepik.com) from [Flaticon](https://www.flaticon.com/)


## License
[MIT License. Copyright (c) 2021 Aleksandr Shukletsov](./LICENSE)
