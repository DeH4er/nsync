import { Reader } from './reader';
import { Sender } from './sender';

export type Remote = {
  readonly writeFile: (path: string) => Promise<void>;
  readonly removeFile: (path: string) => Promise<void>;
  readonly addDir: (path: string) => Promise<void>;
  readonly removeDir: (path: string) => Promise<void>;
  readonly start: () => void;
};

export function createRemote({
  sender,
  reader,
}: {
  readonly sender: Sender;
  readonly reader: Reader;
}): Remote {
  return {
    writeFile,
    removeFile,
    addDir,
    removeDir,
    start,
  };

  function start() {
    return sender.start();
  }

  async function writeFile(path: string): Promise<void> {
    const content = await reader.read(path);

    sender.send({
      type: 'write-file',
      path,
      content,
    });
  }

  function removeFile(path: string) {
    sender.send({
      type: 'remove-file',
      path,
    });
    return Promise.resolve();
  }

  function addDir(path: string) {
    sender.send({
      type: 'add-dir',
      path,
    });
    return Promise.resolve();
  }

  function removeDir(path: string) {
    sender.send({
      type: 'remove-dir',
      path,
    });
    return Promise.resolve();
  }
}
