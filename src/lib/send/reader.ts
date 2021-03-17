import { readFile } from 'fs/promises';

export type Reader = {
  readonly read: (path: string) => Promise<Buffer>;
};

export function createReader() {
  return {
    read,
  };

  function read(path: string): Promise<Buffer> {
    return readFile(path);
  }
}
