const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const PORT = 12345

socket.on('message', (msg, remote) => {
    console.log(msg)
})

socket.bind(PORT);