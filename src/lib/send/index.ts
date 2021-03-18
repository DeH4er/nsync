import { createDriver } from './driver';
import { createReader } from './reader';
import { createRemote } from './remote';
import { createSender } from './sender';
import { createWatcher } from './watcher';

export function start({
  filepath,
  ignored,
  host,
  port,
}: {
  readonly filepath: string;
  readonly ignored?: unknown;
  readonly host: string;
  readonly port: number;
}): void {
  console.log(`Starting server at ${filepath} ${host}:${port}`)
  const sender = createSender({ host, port });
  const reader = createReader();
  const remote = createRemote({ sender, reader });
  const watcher = createWatcher({ filepath, ignored });
  const driver = createDriver({ watcher, remote });
  driver.start();
}
