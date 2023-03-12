const dgram = require('dgram');
const e = require('express');
const socket = dgram.createSocket('udp4');
const app = require('express')();
app.set('view engine', 'ejs')
const PORT = 12345
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

const MATCH_INFO_HEADER = (seq) => {
    let h = Buffer.from([
    // 6 byte message type/header  
    0x3a, 0x1e, 
    seq, 0x00, 0x00, 0x00, 
    
    // Data Header ??
    0x3a, 0x01,
    // 32 bytes for match name
    // 32 bytes (?) for map file
    // Match data ??
    // Player list ??
    ])
    return h;
}
const MATCH_INFO_MATCH_DATA = Buffer.from([
    // 18 bytes for match data??
    0x00, 
    // Gamemode (in order displayed in gamemode change screen)
    0x01,
    // ?? 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    // Win condition for Kill modes (Kills) (LE 2byte Int)
    0x0a, 0x00, 
    // Win condition for Flag and Egg (how many eggs max) modes (LE 2byte Int)
    0x00, 0x00, 
    // Win condition for Time modes (Hours in seconds but game takes it as minutes?) (LE 4byte Int?)
    0x00, 0x00, 0x00, 0x00, 
])
const makeMATCH_INFO = (matchName, mapFile, playerList, seq) =>
    Buffer.concat([
        MATCH_INFO_HEADER(seq), 
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
const PLAYER_DEFAULT_WEAPON_LOADOUT = [16, 16, 16, 16, 16, 16]
const makeMATCH_INFO_PLAYER_WEAPON_LOADOUT = (weaponLoadoutArr) => {
    let a = MATCH_INFO_PLAYER_DEFAULT_WEAPON_LOADOUT.slice(0);
    for(let i = 0; i < weaponLoadoutArr.length; i++) a[i * 4] = weaponLoadoutArr[i]
    return Buffer.from(a);
}
const MATCH_INFO_PLAYER_END_DATA  = Buffer.from([
    // ???
    /*for host:
    00 00 00 01
    00 00 00 00 
    00 00 00 00 00,*/
    // ??? if all 0x00 player is not in the game?
    0x00, 0x00, 0x06, 
    // Player ready??
    0x01, 0x01, 
    // ??
    0x00, 0x00, 0x00,
    // Can edit character? 
    0x01, 
    // Player type?
    // 0x00 - You??
    // 0x01 - not you?/host?/normal player?
    // 0x02 - easy bot??
    // 0x03 - medium bot??
    // 0x04 - hard bot??
    // 0x05 - harder bot??
    // 0x06 - ready?
    // 0x07 - ??? not ready?
    0x00, 
    // ??
    0x00, 0x00
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

const C2S_PLAYER_INFO_HEADER = Buffer.from([
    // 6 byte message type/header  
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
    // Data Header ?? 
    0x3a, 0x00, 0xff, 0x00
])
const makePLAYER_INFO = (playerName, playerLoadout, playerColor) => Buffer.concat([
    C2S_PLAYER_INFO_HEADER,
  
    // 16 bytes for player name  
    strWithPadding(playerName, 16),
  
    // Weapon Loadout every 4th byte 
    makeMATCH_INFO_PLAYER_WEAPON_LOADOUT(playerLoadout),
    // Color
    Buffer.from(playerColor),
    // ??
    Buffer.from([0x00, 0x00, 0x00, 0x01, 0x00])
])

const C2S_MATCH_INFO_REQUEST = Buffer.from([0x3a, 0x1f, 0x00, 0x00, 0x00, 0x00]);
const C2S_SEND_PLAYER_INFO_HEADER = Buffer.from([
    // 6 byte message type/header  
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
    // Data Header ?? 
    0x3a, 0x00, 0xff, 0x00
])

const S2C_PLAYER_READY_ACK = Buffer.from([0x3a, 0x1f, 0x01, 0x00, 0x00, 0x00]);
const C2S_PLAYER_READY = Buffer.from([
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00, 0x3a, 0x03
])
const C2S_S2C_PING = Buffer.from([0x3a, 0x19]);
const S2C_PLAYER_INFO_REQUEST_HEADER = Buffer.from([0x3a, 0x1e, 0x01, 0x00, 0x00, 0x00, 0x3a, 0x0a])
const name = `<a style="color:red;">:3</a>`
const map = `maps/igloos.map`
let players = [
    makeMATCH_INFO_PLAYER("Amadeus", PLAYER_DEFAULT_WEAPON_LOADOUT, [0x00, 0x00, 0xff, 0x00]),
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
    MATCH_INFO_EMPTY_PLAYER,
]
const matchInfo = (seq) => makeMATCH_INFO(name, map, players, seq)
const sendGame = makeSEND_GAME(name)
let games = {};
let connection = null;
const isRemote = (a, b) => a?.address === b?.address
const remoteIp = (remote) => {
    let remoteA = `${remote.address}:${remote.port}`;
    if(isRemote(remote, games[connection])) remoteA = `SERVER (${remoteA})`
    return remoteA
}
const reply = (remote, message, elog=true, cb) => {
    if(elog) log(`send ${hex(message)} to ${remoteIp(remote)} (${(new Date()).toLocaleTimeString()}) (size ${message.length})`)

    socket.send(message, remote.port, remote.address, cb);
}
const chainReply = (remote, msgs, elog) => {
    reply(remote, msgs[0], elog, (err) => {
        if(err) console.log(`Error sending to ${remote.address}:${remote.port}`, msgs[0], msgs);
        if(msgs.length !== 1) chainReply(remote, msgs.slice(1), elog);
    })
}
const hex = (str) => str.toString("hex").match(/.{1,2}/g).join(' ')

const logsWs = require('express-ws')(app);
let logs = []
const log = (msg) => {
    logs.push(msg)
    logsWs.getWss().clients.forEach(client => client.send(msg));
    console.log(msg);
}
const connect = () => {
    log("Sending Connect Request");
    reply(games[connection], C2S_CONNECTION_REQUEST);
}
const playerInfo = makePLAYER_INFO("Amadeus", PLAYER_DEFAULT_WEAPON_LOADOUT, [0x00, 0x00, 0xff, 0x00])
socket.on('message', (message, remote) => {

    if(hasHeader(message, SEND_GAME_HEADER)) {
        const gameName = message.subarray(SEND_GAME_HEADER.length).filter(b => b !== 0);

        if(!games[gameName]) {
            log(`"${gameName}" at ${remoteIp(remote)}`)
            games[gameName] = remote;
        }
        return;
    }
    if(isMsg(message, C2S_S2C_PING)) {
        return reply(games[connection], C2S_S2C_PING, false);
    }
    log(`recv ${hex(message)} from ${remoteIp(remote)} (${(new Date()).toLocaleTimeString()}) (size ${remote.size})`)
    if(isMsg(message, S2C_CONNECTION_ACK_A)) {
        chainReply(games[connection], [C2S_MATCH_INFO_REQUEST])
        log(`-- S2C_CONNECTION_ACK_A`)
    }

    if(hasHeader(message, S2C_PLAYER_INFO_REQUEST_HEADER)) {
        reply(games[connection], playerInfo)
        log(`-- S2C_PLAYER_INFO_REQUEST`)
    }
    

})
app.get('/', (req, res) => {
    if(!connection) return res.render('games', { games });
    res.render('connected', { connection });
})

app.get('/connect', (req, res) => {
    if(connection) return res.send("Already connected");
    connection = req.query.key;
    connect();
    res.send("awa");
})

app.ws('/logs', (ws) => {
    ws.send(logs.join('\n'))
})

socket.bind(PORT);
app.listen(4321);