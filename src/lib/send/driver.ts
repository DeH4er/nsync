import { Remote } from './remote';
import { Watcher } from './watcher';

export type Driver = {
  readonly start: () => Promise<void>;
  readonly stop: () => Promise<void>;
};

export function createDriver({
  watcher,
  remote,
}: {
  readonly watcher: Watcher;
  readonly remote: Remote;
}): Driver {
  return {
    start,
    stop,
  };

  async function start(): Promise<void> {
    remote.start();
    await watcher.start();

    watcher.on('add', onFileAdd);
    watcher.on('change', onFileChange);
    watcher.on('unlink', onFileRemove);
    watcher.on('addDir', onDirAdd);
    watcher.on('unlinkDir', onDirRemove);
    watcher.on('error', onError);
  }

  function onFileAdd(path: string): void {
    console.log(`[watcher] file add: ${path}`);
    remote.writeFile(path);
  }

  function onFileChange(path: string): void {
    console.log(`[watcher] file change: ${path}`);
    remote.writeFile(path);
  }

  function onFileRemove(path: string): void {
    console.log(`[watcher] file remove: ${path}`);
    remote.removeFile(path);
  }

  function onDirAdd(path: string): void {
    console.log(`[watcher] dir add: ${path}`);
    remote.addDir(path);
  }

  function onDirRemove(path: string): void {
    console.log(`[watcher] dir remove: ${path}`);
    remote.removeDir(path);
  }

  function onError(error: string): void {
    console.log(`[watcher] error: ${error}`);
  }

  function stop(): Promise<void> {
    return watcher.stop();
  }
}
