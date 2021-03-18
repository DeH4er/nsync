import { createServer, Socket } from 'net';

import { Packet, PACKET_SIZE_LENGTH, serializePacket } from '../shared/packet';
import { chunked } from '../shared/utils';
export type Sender = {
  readonly start: () => void;
  readonly send: (packet: Packet) => void;
};

/**
 * Creates a `Sender` which abstracts TCP server socket
 */
export function createSender({
  host,
  port,
}: {
  readonly host: string;
  readonly port: number;
}): Sender {
  let clients: readonly Socket[] = [];
  const MAX_PACKET_SIZE = 2 ** 15;

  return {
    start,
    send,
  };

  function start(): void {
    createServer((sock: Socket) => {
      console.log(`Client connected ${sock.remoteAddress}:${sock.remotePort}`);

      sock.on('close', () => {
        console.log(
          `Client disconnected ${sock.remoteAddress}:${sock.remotePort}`
        );
        clients = clients.filter((c) => c !== sock);
      });

      clients = [...clients, sock];
    }).listen(port, host);
    console.log(`Sender started at ${host}:${port}`);
  }

  function send(packet: Packet): void {
    const serialized = serializePacket(packet);
    console.log(`Sending packet: ${serialized.length - PACKET_SIZE_LENGTH}B`);
    const chunks = chunked(serialized, MAX_PACKET_SIZE);

    clients.forEach((client: Socket) => {
      chunks.forEach((chunk) => {
        client.write(chunk);
      });
    });
  }
}
