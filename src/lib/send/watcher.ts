import { relative } from 'path';

import { FSWatcher, watch } from 'chokidar';

export type Watcher = {
  readonly start: () => Promise<void>;
  readonly stop: () => Promise<void>;
  readonly on: (
    event: string,
    handler: (...args: readonly string[]) => void
  ) => void;
};

export function createWatcher({
  filepath,
  ignored,
}: {
  readonly filepath: string;
  readonly ignored?: unknown;
}): Watcher {
  let watcher: FSWatcher;

  return {
    start,
    stop,
    on,
  };

  function start(): Promise<void> {
    return new Promise((resolve) => {
      watcher = watch(filepath, { ignored });
      watcher.on('ready', () => {
        console.log(`Watcher started`);
        resolve();
      });
    });
  }

  function on(event: string, handler: (path: string) => void): void {
    watcher.on(event, (path: string) => handler(relative(filepath, path)));
  }

  async function stop(): Promise<void> {
    await watcher.close();
  }
}
