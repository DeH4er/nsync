import { Packet } from '../shared/packet';

import {Action} from './action';
import { Receiver } from './receiver';

export function createDriver({
  action,
  receiver,
}: {
  readonly action: Action;
  readonly receiver: Receiver;
}) {
  return {
    start,
  };

  function start(): void {
    receiver.start();
    receiver.onPacket((packet: Packet) => {
      if (packet.type === 'write-file') {
        action.writeFile(packet.path, packet.content);
      } else if (packet.type === 'remove-file') {
        action.removeFile(packet.path);
      } else if (packet.type === 'add-dir') {
        action.addDir(packet.path);
      } else if (packet.type === 'remove-dir') {
        action.removeDir(packet.path);
      }
    });
  }
}
