import { mkdir, writeFile as write } from 'fs/promises';
import { join } from 'path';

import rimraf from 'rimraf';

export type Action = {
  readonly writeFile: (path: string, content: Buffer) => Promise<void>;
  readonly removeFile: (path: string) => Promise<void>;
  readonly addDir: (path: string) => Promise<void>;
  readonly removeDir: (path: string) => Promise<void>;
};

export function createAction({ filepath }: { readonly filepath: string }) {
  return {
    writeFile,
    removeFile,
    addDir,
    removeDir,
  };

  function writeFile(path: string, content: Buffer): Promise<void> {
    return write(join(filepath, path), content);
  }

  function removeFile(path: string): Promise<void> {
    return _rm(join(filepath, path));
  }

  function addDir(path: string): Promise<void> {
    return mkdir(join(filepath, path));
  }

  function removeDir(path: string): Promise<void> {
    return _rm(join(filepath, path));
  }

  function _rm(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      rimraf(path, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
