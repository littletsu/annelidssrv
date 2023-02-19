const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const PORT = 12345

socket.on('listening', function () {
	console.log(`Listening on ${PORT}`)
});
// (search) 0000  01 14 74 00 01 00                                  ··t···
const C2B_SEARCH_GAME = Buffer.from([0x01, 0x14, 0x74, 0x00, 0x01, 0x00]);
const SEND_GAME_HEADER = Buffer.from([ // (send)
    0x01, 0x15, 0x74, 0x00, 0x01, 0x00, // msg header
    0x3a // ??
    // 32 bytes for match name
    // 39 total len
]);

const C2S_CONNECTION_REQUEST = Buffer.from([0x3a, 0x16]);
const S2C_CONNECTION_ACK_A = Buffer.from([   
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
    0x3a, 0x18
]);
const S2C_CONNECTION_ACK_B = Buffer.from([
    0x3a, 0x1e, 0x01, 0x00, 0x00, 0x00,
    0x3a, 0x0a, 0x01, 0x00, 0x00, 0x00
]);

const strWithPadding = (str, pad=32) => Buffer.from(str.toString().padEnd(pad, '\0'))
const makeSEND_GAME = (matchName) => Buffer.concat([SEND_GAME_HEADER, strWithPadding(matchName)])
const isMsg = (a, b) => Buffer.compare(a, b) === 0
const hasHeader = (msg, header) => isMsg(msg.subarray(0, header.length), header)
let matchSeq = 2;
const MATCH_INFO_HEADER = () => {
    let h = Buffer.from([
    // 6 byte message type/header  
    0x3a, 0x1e, 
    matchSeq, 0x00, 0x00, 0x00, 
    
    // Data Header ??
    0x3a, 0x01,
    // 32 bytes for match name
    // 32 bytes (?) for map file
    // Match data ??
    // Player list ??
    ])
    matchSeq++;
    return h;
}
const MATCH_INFO_MATCH_DATA = Buffer.from([
    // 18 bytes for match data??
    0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00,

    0x00, 0x00, 
])
const makeMATCH_INFO = (matchName, mapFile, playerList) =>
    Buffer.concat([
        MATCH_INFO_HEADER(), 
        strWithPadding(matchName), 
        strWithPadding(mapFile), 
        MATCH_INFO_MATCH_DATA, 
        ...playerList])

const MATCH_INFO_PLAYER_DEFAULT_WEAPON_LOADOUT = [
    0x00, 0x00, 0x00, 0x00, 
    0x01, 0x00, 0x00, 0x00,
    0x02, 0x00, 0x00, 0x00, 
    0x09, 0x00, 0x00, 0x00,
    0x07, 0x00, 0x00, 0x00,
    0x0f, 0x00, 0x00, 0x00
]
const PLAYER_DEFAULT_WEAPON_LOADOUT = [0x00, 0x01, 0x02, 0x09, 0x07, 0x0f]
const makeMATCH_INFO_PLAYER_WEAPON_LOADOUT = (weaponLoadoutArr) => {
    let a = MATCH_INFO_PLAYER_DEFAULT_WEAPON_LOADOUT.slice(0);
    for(let i = 0; i < weaponLoadoutArr.length; i++) a[i * 4] = weaponLoadoutArr[i]
    return Buffer.from(a);
}
const MATCH_INFO_PLAYER_END_DATA  = Buffer.from([
    // ???
    /*for host: 0x00, 
    0x00, 0x00, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,*/
    // for normal player on ready state:
    0x00, 
    0x00, 0x00, 0x06, 0x00,
    0x01, 0x00, 0x00, 0x00, 
    0x02, 0x00, 0x00, 0x00,
])

const MATCH_INFO_EMPTY_PLAYER = Buffer.alloc(56);
// 56 bytes
const makeMATCH_INFO_PLAYER = (playerName, weaponLoadout, color) => 
        Buffer.concat([
            // 16 bytes for player name
            strWithPadding(playerName, 16), 
            // 24 bytes for weapon loadout
            makeMATCH_INFO_PLAYER_WEAPON_LOADOUT(weaponLoadout),
            // 16 bytes for extra player data
            Buffer.from(color), 
MATCH_INFO_PLAYER_END_DATA]);

const C2S_MATCH_INFO_REQUEST = Buffer.from([0x3a, 0x1f, 0x01, 0x00, 0x00, 0x00]);
const C2S_SEND_PLAYER_INFO_HEADER = Buffer.from([
    // 6 byte message type/header  
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
    // Data Header ?? 
    0x3a, 0x00, 0xff, 0x00
])
const C2S_S2C_PING = Buffer.from([0x3a, 0x19]);
const name = `<button>muahaha</button>`
const map = `maps/igloos.map`
let players = [
    // makeMATCH_INFO_PLAYER("Amadeus", PLAYER_DEFAULT_WEAPON_LOADOUT, [0xff, 0x00, 0x00]),
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
]
const matchInfo = () => makeMATCH_INFO(name, map, players)
const sendGame = makeSEND_GAME(name)
const reply = (remote, msg, cb) => socket.send(msg, remote.port, remote.address, cb)
const chainReply = (remote, msgs) => {
    reply(remote, msgs[0], (err) => {
        if(err) console.log(`Error sending to ${remote.address}:${remote.port}`, msgs[0], msgs);
        if(msgs.length !== 1) chainReply(remote, msgs.slice(1));
    })
}
const hex = (str) => str.toString("hex").match(/.{1,2}/g).join(' ')
socket.on('message', function (message, remote) {
	console.log(`(size ${remote.size}) ${hex(message)} from ${remote.address}:${remote.port} (${(new Date()).toLocaleTimeString()})`)
    
    if(isMsg(message, C2B_SEARCH_GAME)) {
        console.log(`-- C2B_SEARCH_GAME, sending ${sendGame.length} bytes back`)
        return reply(remote, sendGame);
    }
    if(isMsg(message, C2S_CONNECTION_REQUEST)) {
        console.log(`-- C2S_CONNECTION_REQUEST, sending S2C_CONNECTION_ACK_A and S2C_CONNECTION_ACK_B`)
        return chainReply(remote, [S2C_CONNECTION_ACK_A, S2C_CONNECTION_ACK_B])
    }
    if(isMsg(message, C2S_MATCH_INFO_REQUEST)) {
        console.log(`-- C2S_MATCH_INFO_REQUEST, sending ${matchInfo.length} bytes back`)
        return reply(remote, matchInfo());
    }


    if(isMsg(message, C2S_S2C_PING)) {
        console.log(`-- C2S_S2C_PING, sending C2S_S2C_PING back`)
        return reply(remote, C2S_S2C_PING);
    }

    if(hasHeader(message, C2S_SEND_PLAYER_INFO_HEADER)) {
        
        let playerInfo = message.subarray(C2S_SEND_PLAYER_INFO_HEADER.length);
        let playerName = playerInfo.subarray(0, 16);
        let playerLoadout = Array.from(playerInfo.subarray(16, 16 + 6 * 4).filter((_, i) => (i % 4) === 0));
        let playerColor = playerInfo.subarray(16 + 6 * 4, 16 + 6 * 4 + 3);
        console.log(`-- C2S_SEND_PLAYER_INFO_HEADER, name: ${playerName}, loadout: ${playerLoadout}, color: ${hex(playerColor)}`)
        // players[5] = makeMATCH_INFO_PLAYER(playerName, playerLoadout, playerColor);
        return reply(remote, matchInfo());
    }
});

socket.bind(PORT);