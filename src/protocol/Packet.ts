import { Buffer } from 'node:buffer';

export default class Packet {
    private readonly header: Uint8Array = new Uint8Array([0x00, 0x00]);
    private seq: Uint8Array = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    private size: number = this.header.length + this.seq.length;

    public static from(message: Buffer) {
        const packet = new this()
        new DataView(packet.seq.buffer).setUint32(0, message.readUint32LE(2), true)
        return packet;
    }

    public toTypedArray() {
        const header = new Uint8Array(this.size);
        header.set(this.header);
        header.set(this.seq, this.header.length);
        return header;
    }
}