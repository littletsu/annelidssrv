"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Packet {
    constructor() {
        this.header = new Uint8Array([0x00, 0x00]);
        this.seq = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
        this.size = this.header.length + this.seq.length;
    }
    static from(message) {
        const packet = new this();
        new DataView(packet.seq.buffer).setUint32(0, message.readUint32LE(2), true);
        return packet;
    }
    toTypedArray() {
        const header = new Uint8Array(this.size);
        header.set(this.header);
        header.set(this.seq, this.header.length);
        return header;
    }
}
exports.default = Packet;
