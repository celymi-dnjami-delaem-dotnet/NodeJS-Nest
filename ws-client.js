const io = require('socket.io-client');

const socket = io('http://localhost:3006', { secure: false, reconnection: true, rejectUnauthorized: false });

socket.on('connect', () => {
    console.log('Socket connected to server!');

    socket.emit('last-ratings');
});

socket.io.on('error', (error) => {
    console.error(`Cannot connect to server, error: ${error}`);
});

socket.on('last-ratings', (message) => {
    console.log(message);
});
