import { parseArgs } from './lib/args';
import { start as startReceive } from './lib/receive';
import { start as startSend } from './lib/send';

const args = parseArgs();
console.log(args);

function getCurrentDir(): string {
  return '.';
}

function getFilePath(): string {
  if (args._ instanceof Array) {
    return args._[0];
  } else if (args._) {
    return args._;
  } else {
    return getCurrentDir();
  }
}

if (args.server) {
  startSend({
    filepath: getFilePath(),
    host: args.host,
    port: args.port,
  });
} else {
  startReceive({
    filepath: getFilePath(),
    host: args.host,
    port: args.port,
  });
}
