
const socket = new WebSocket(`ws://${process.env.HOST}:${process.env.PORT}`)

socket.addEventListener('open', event => {
    console.log('Connected to WebSocket server');
});