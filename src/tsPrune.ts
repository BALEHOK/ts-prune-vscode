import { run as runTsPrune } from 'ts-prune/lib/runner';
import { IConfigInterface } from 'ts-prune/lib/configurator';
import logger from './logging/logger';
import path = require('path');

export interface Config extends IConfigInterface {
  rootPath: string;
}

export class TsPrune {
  runSync(config: Config) {
    const tsPruneConfig = {
      project: path.join(config.rootPath, config.project),
    } as IConfigInterface;

    const results: string[] = [];
    runTsPrune(tsPruneConfig, (line) => results.push(line));

    logger.log(`Found ${results.length} unused exprots`);

    return results;
  }

  run(config: Config) {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        resolve(this.runSync(config));
      }, 0);
    });
  }
}
