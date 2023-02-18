# Search (C2B)
A client can send the search packet to broadcast on port 12345 to get `"Send Game"` from servers back

Always will be
```js
[0x01, 0x14, 0x74, 0x00, 0x01, 0x00]
```

# Send Game (S2B, S2C)
A server can send this packet to broadcast on port 12345 or to other IPs as a response to `"Search"` to let other clients know of a local game. The name can take some HTML markup.

```js
[
    // Header
    0x01, 0x15, 0x74, 0x00, 0x01, 0x00,
    // ?? maybe part of the header
    0x3a,
    // 32 bytes for the match name, if the match name is shorter, padding with 0x0 has to be done. If more than 32 are given (or the message is longer than 39 bytes) then it will be ignored.
    // "Partida de Crieph"
    0x50 0x61 0x72 0x74 0x69 0x64 0x61 0x20 0x64...
    ...0x0 0x0 0x0 0x0...
]
```

# Connect Request (C2S) ?
A connection request to a server on port 12345

```js
[0x3a, 0x16]
```

# Connection Ack (S2C) ?
Sent after `"Connect Request"` from client

An 8 byte packet is followed by a 12 byte packet


1. 
```js
[   
    0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
    0x3a, 0x18
]
```
2. 
```js
[
    0x3a, 0x1e, 0x01, 0x00, 0x00, 0x00,
    0x3a, 0x0a, 0x01, 0x00, 0x00, 0x00
]
```

# Connection Ack/Data Request (C2S) ?
Sent after `"Connection Ack"` from server. Both are variants of `"Match Info Request"`.


1. 
```js
[0x3a, 0x1f, 0x00, 0x00, 0x00, 0x00]
```
2. 
```js
[0x3a, 0x1f, 0x01, 0x00, 0x00, 0x00]
```

# Match Info Request (C2S) ?
Asks the server to send a `"Match Info"` packet to the client

```js
[0x3a, 0x1f, 0x01, 0x00, 0x00, 0x00]
```

# Send Player Info (C2S) ?
Sent after `"Connection Ack"` from server, after `"Add player to the game"` or when the player is updated
```js
[
  // 6 byte message type/header  
  0x3a, 0x1e, 0x00, 0x00, 0x00, 0x00,
  // Data Header ?? 
  0x3a, 0x00, 0xff, 0x00,

  // 16 bytes for player name  
  0x57, 0x6f, 0x72, 0x77, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 

  // Weapon Loadout every 4th byte 
  0x00, 0x00, 0x00, 0x00, 
  0x01, 0x00, 0x00, 0x00,
  0x02, 0x00, 0x00, 0x00,
  0x09, 0x00, 0x00, 0x00,
  0x07, 0x00, 0x00, 0x00,
  0x0f, 0x00, 0x00, 0x00,
  // Color
  0x00, 0x00, 0x00, 
  // ??
  0x00, 0x00, 0x00, 0x01, 0x00
]

```


# Match Info (S2C) ?
426 bytes
```js
[
  // 6 byte message type header
  0x3a, 0x1e, 0x09, 0x00, 0x00, 0x00, 
  // data header?
  0x3a, 0x01,
  
  // 32 bytes for match name
  0x50, 0x61, 0x72, 0x74, 0x69, 0x64, 0x61, 0x20,
  0x64, 0x65, 0x20, 0x57, 0x6f, 0x72, 0x77, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

  // 32 bytes for map file
  0x6d, 0x61, 0x70, 0x73, 0x2f, 0x69, 0x67, 0x6c,
  0x6f, 0x6f, 0x73, 0x2e, 0x6d, 0x61, 0x70, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

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
  // end header (90 bytes)
  
  // start player (56 bytes each)
  // 16 bytes for player name
  0x57, 0x6f, 0x72, 0x77, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  
  // weapon loadout every 4th byte (LE 4byte Int, 6 weapons, 24 bytes)
  0x00, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x00, 0x00, 
  0x02, 0x00, 0x00, 0x00, 
  0x09, 0x00, 0x00, 0x00, 
  0x07, 0x00, 0x00, 0x00, 
  0x0f, 0x00, 0x00, 0x00, 
  
  // -- 16 bytes for player data??
  // Color
  0x00, 0x00, 0x32,
  // ???
  0x00, 
  0x00, 0x00, 0x01, 0x01,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,

  // end player

  // start player
  // 16 bytes for player name
  0x43, 0x72, 0x69, 0x65, 0x70, 0x68, 0x00, 0x00, 
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  
  // weapon loadout every 4th byte (6 weapons, 24 bytes)
  0x0c, 0x00, 0x00, 0x00, 
  0x03, 0x00, 0x00, 0x00,
  0x04, 0x00, 0x00, 0x00,
  0x09, 0x00, 0x00, 0x00,
  0x07, 0x00, 0x00, 0x00,
  0x0f, 0x00, 0x00, 0x00,

  // -- 16 bytes for player data??
  // Color
  0x3c, 0x00, 0xff,
  // ??
  0x00, 
  0x00, 0x00, 0x06, 0x00,
  0x01, 0x00, 0x00, 0x00, 
  0x02, 0x00, 0x00, 0x00,
  
  // end player

  0x45, 0x6d, 0x6c, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x28, 0x00,
  0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0xb4, 0x5f, 0xd2, 0x00, 0x00, 0x00,
  0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x6f, 0x72, 0x6f, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x2f, 0x00, 0x00, 0x00, 0x06, 0x00,
  0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0xa2, 0xd8, 0x00, 0x00, 0x00, 0x00,
  0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x41, 0x67, 0x65, 0x74, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x07, 0x00,
  0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x00, 0xff, 0x50, 0x00, 0x00, 0x00,
  0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x4e, 0x65, 0x61, 0x6b, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x2b, 0x00,
  0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x2f, 0x00,
  0x00, 0x00, 0x00, 0x50, 0xff, 0x00, 0x00, 0x00,
  0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00
]
```

# Add player to the game (C2S) ???
Asks the server to add the player to the game that will be sent through a `"Send Player Info"` packet right after this packet. If it's not added and followed by a `"Match Info"` packet from the server, the client will not connect to the server.
```js
[0x3a, 0x1f, 0x03, 0x00, 0x00, 0x00]
```

# Disconnect (C2S) ?
Closes the connection
```js
[0x3a, 0x17]
```

# Ping (C2S, S2C)
Both parties send once a connection is established

```js
[0x3a, 0x19]
```
