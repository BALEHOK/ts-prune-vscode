import { run as runTsPrune } from 'ts-prune/lib/runner';
import { IConfigInterface } from 'ts-prune/lib/configurator';
import logger from './logging/logger';
import path = require('path');

export interface Config extends IConfigInterface {
  rootPath: string;
}

export class TsPrune {
  results = [];
  run(config: Config) {
    this.results = [];

    const tsPruneConfig = {
      project: path.join(config.rootPath, config.project),
    } as IConfigInterface;

    const output = (line) => this.results.push(line);
    runTsPrune(tsPruneConfig, output);

    logger.log('results ' + this.results.length);
  }
}
