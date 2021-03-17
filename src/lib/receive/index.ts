import { createAction } from './action';
import { createDriver } from './driver';
import { createReceiver } from './receiver';

export function start({
  host,
  port,
  filepath,
}: {
  readonly host: string;
  readonly port: number;
  readonly filepath: string;
}): void {
  const receiver = createReceiver({ host, port });
  const action = createAction({ filepath });
  const driver = createDriver({ action, receiver });

  driver.start();
}
