import { createAction } from './action';
import { createDriver } from './driver';
import { createReceiver } from './receiver';

export function start({
  filepath,
  host,
  port,
}: {
  readonly filepath: string;
  readonly host: string;
  readonly port: number;
}): void {
  console.log(`Starting client at ${filepath} ${host}:${port}`);
  const receiver = createReceiver({ host, port });
  const action = createAction({ filepath });
  const driver = createDriver({ action, receiver });

  driver.start();
}
