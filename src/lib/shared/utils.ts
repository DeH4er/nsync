export function chunked<
  T extends {
    readonly slice: (start: number, end: number) => T;
    readonly length: number;
  }
>(arr: T, size: number): readonly T[] {
  const result = [];

  // eslint-disable-next-line functional/no-loop-statement
  for (let i = 0; i < arr.length; i += size) {
    // eslint-disable-next-line functional/immutable-data
    result.push(arr.slice(i, i + size));
  }

  return result;
}
