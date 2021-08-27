import { CombinedLogger } from './combinedLogger';
import { ConsoleLogger } from './consoleLogger';
import { VsCodeOutputLogger } from './vscodeOutputLogger';

const vscodeOutputLogger = new VsCodeOutputLogger();
const consoleLogger = new ConsoleLogger();

export default new CombinedLogger([vscodeOutputLogger, consoleLogger]);
