import { Socket } from 'net';

import { deserializePacket, Packet } from '../shared/packet';

export type Receiver = {
  readonly start: () => void;
  readonly onPacket: (handler: (packet: Packet) => void) => void;
};

export function createReceiver({
  host,
  port,
}: {
  readonly host: string;
  readonly port: number;
}) {
  const socket = new Socket();

  return {
    start,
    onPacket,
  };

  function start() {
    socket.connect(port, host, () => {
      console.log(`Connected to ${host}:${port}`);
    });

    socket.on('close', () => {
      console.log(`Socket disconnected`);
    });
  }

  function onPacket(handler: (packet: Packet) => void) {
    socket.on('data', (data: Uint8Array) => {
      const packet = deserializePacket(data)
      console.log(packet);
      handler(packet);
    });
  }
}
