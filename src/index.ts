import { resolve } from 'path';

import { parseArgs } from './args';
import { start as startReceive } from './lib/receive';
import { start as startSend } from './lib/send';

const args = parseArgs();

function getCurrentDir(): string {
  return '.';
}

function getFilePath(): string {
  if (args._.length > 0) {
    return resolve(args._[0]);
  } else {
    return resolve(getCurrentDir());
  }
}

function startServer(): void {
  startSend({
    filepath: getFilePath(),
    host: args.host,
    port: args.port,
  });
}

function startClient(): void {
  startReceive({
    filepath: getFilePath(),
    host: args.host,
    port: args.port,
  });
}

if (args.server) {
  startServer();
} else {
  startClient();
}
