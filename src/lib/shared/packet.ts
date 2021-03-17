import { deserialize, serialize } from 'bson';

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

export function serializePacket(packet: Packet): Uint8Array {
  return serialize(packet);
}

export function deserializePacket(packet: Uint8Array): Packet {
  return deserialize(packet, {
    promoteBuffers: true,
  }) as Packet;
}
