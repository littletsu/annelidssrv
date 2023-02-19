let pkt = [
    0x3a, 0x1e, 0x04, 0x00, 0x00, 0x00, 0x3a, 0x01,
    0x50, 0x61, 0x72, 0x74, 0x69, 0x64, 0x61, 0x20,
    0x64, 0x65, 0x20, 0x61, 0x77, 0x61, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x72, 0x61, 0x6e, 0x64, 0x6f, 0x6d, 0x5f, 0x6a,
    0x75, 0x6e, 0x67, 0x6c, 0x65, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x61, 0x77, 0x61, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x09, 0x00,
    0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x0f, 0x00,
    0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x0b, 0x00,
    0x00, 0x00, 0x00, 0xe1, 0x82, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x41, 0x69, 0x6e, 0x61, 0x79, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x03, 0x00,
    0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x09, 0x00,
    0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x0f, 0x00,
    0x00, 0x00, 0xe0, 0x00, 0xe0, 0x00, 0x00, 0x00,
    0x06, 0x01, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00
  ];
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
    part("color", 3, p)
    part("unknown", 13, p)
    return p;
}

part("header", 8)
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