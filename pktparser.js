let pktfile = require('fs').readFileSync('./pkt', 'utf-8')
let pkt = Buffer.from(pktfile.split('\n').filter(l => l.length >= 2 && l[0] != "#").slice(-1)[0], "hex")
require('fs').writeFileSync('./pkt.bin', pkt)
const hex = (name, str) => console.log(`${name} (${str.length} bytes): ${str.toString("hex").match(/.{1,2}/g).join(' ')}`)
const partstr = (name, part) => console.log(`${name} (${part.s.length} bytes as str): ${part.s.toString().replace(/\0/g, ".")}`)
let pos = 0;
const slice = (len, subpart) => { 
    let spos = subpart?.pos ?? pos
    let spkt = subpart?.s || pkt
    let buf = Buffer.from(spkt.slice(spos,spos+len)) 
    if(typeof subpart?.pos == "undefined") pos+=len;
    return buf;
}
class pktslice {
    constructor(name, s) {
        this.name = name
        this.s = s
        this.pos = 0
    }
    add(l) {
        this.pos = this.pos + l;
    }
}
const part = (name, len, subpart, str) => {
    let s = slice(len, subpart);
    if(typeof subpart?.pos !== "undefined") subpart.add(len);
    let sname = subpart?.name ? `${subpart.name}.${name}` : name
    let outname = "--".repeat(sname.split('.').length - 1) + sname;
    hex(outname, s);
    let ps = new pktslice(sname, s);
    if(str) partstr(outname, ps);
    return ps;
}
const readPlayer = (i) => {
    let p = part("player" + i, 56)
    part("name", 16, p, true)
    part("weaponLoadout", 24, p)
    part("color", 4, p)
    part("unknown", 13, p)
    return p;
}

part("headerPacketType", 2)
part("headerPacketSeq", 4)
part("headerUnknown", 2)
part("matchName", 32, null, true)
part("mapFile", 32, null, true)
part("unknown", 1)
part("gamemode", 1)
part("unknown", 8)
part("winConditionKills", 2)
part("winConditionFlagEgg", 2)
part("winConditionTime", 4)
readPlayer(1);
readPlayer(2);
readPlayer(3);
