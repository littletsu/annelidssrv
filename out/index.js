"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = __importDefault(require("./protocol/Packet"));
console.log(Packet_1.default.from(Buffer.from([0x3a, 0x1f, 0x02, 0x00, 0x00, 0x00])));
