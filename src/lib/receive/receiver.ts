import { Socket } from 'net';

import {
  deserializePacket,
  Packet,
  PACKET_SIZE_LENGTH,
} from '../shared/packet';

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
}): Receiver {
  const socket = new Socket();
  let isFirstPacket = true;
  let bytesLeft = 0;
  let buffer: Buffer;

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
      if (isFirstPacket) {
        bytesLeft = Buffer.from(data.slice(0, PACKET_SIZE_LENGTH)).readInt32BE(
          0
        );
        buffer = Buffer.from(data.slice(PACKET_SIZE_LENGTH));
        isFirstPacket = false;
      } else {
        buffer = Buffer.concat([buffer, data]);
      }

      bytesLeft -= data.length;
      if (bytesLeft <= 0) {
        isFirstPacket = true;
        const packet = deserializePacket(buffer);
        console.log(`Packet received: ${buffer.length}B`);
        console.log(packet);
        handler(packet);
      }
    });
  }
}
