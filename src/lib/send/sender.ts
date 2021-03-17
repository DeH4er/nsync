import { createServer, Socket } from 'net';

import { Packet, serializePacket } from '../shared/packet';

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

  return {
    start,
    send,
  };

  function start(): void {
    createServer((sock: Socket) => {
      console.log(`Client connected ${sock.remoteAddress}:${sock.remotePort}`);

      sock.on('close', () => {
        console.log(`Client disconnected ${sock.remoteAddress}:${sock.remotePort}`);
        clients = clients.filter(c => c !== sock);
      })

      clients = [...clients, sock];
    }).listen(port, host);
    console.log(`Sender started at ${host}:${port}`);
  }

  function send(packet: Packet): void {
    const serialized = serializePacket(packet);

    clients.forEach((client: Socket) => {
      client.write(serialized);
    });
  }
}
