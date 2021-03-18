import { calculateObjectSize, deserialize, serializeWithBufferAndIndex } from 'bson';

export type Packet =
  | {
      readonly type: 'write-file';
      readonly path: string;
      readonly content: Buffer;
    }
  | {
      readonly type: 'remove-file';
      readonly path: string;
    }
  | {
      readonly type: 'add-dir';
      readonly path: string;
    }
  | {
      readonly type: 'remove-dir';
      readonly path: string;
    };

export const PACKET_SIZE_LENGTH = 32; // 2 ** 32 -> 4GB

export function serializePacket(packet: Packet): Uint8Array {
  const packetSize = calculateObjectSize(packet);
  const buf = Buffer.alloc(PACKET_SIZE_LENGTH + packetSize);
  buf.writeInt32BE(PACKET_SIZE_LENGTH + packetSize);
  serializeWithBufferAndIndex(packet, buf, { index: PACKET_SIZE_LENGTH});
  return buf;
}

export function deserializePacket(packet: Uint8Array): Packet {
  return deserialize(packet, {
    promoteBuffers: true,
  }) as Packet;
}
