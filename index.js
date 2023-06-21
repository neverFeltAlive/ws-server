const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {origin: '*'}
})

io.on('connection', (socket) => {
    let socketLogin = null;

    socket.on('login', (login) => {
        if (!socketLogin) {
            socketLogin = login;
            socket.emit('login', {success: true, login: socketLogin});
        } else {
            socket.emit('login', {success: false});
        }
    })

    socket.on('message', (message) => {
        if (!socketLogin) return;

        const now = Date.now();
        const broadcastMessage = {
            id: `${socket.id}-${now}`,
            author: socketLogin,
            date: now,
            content: JSON.parse(message).message
        };

        console.log(broadcastMessage);

        io.emit('message', JSON.stringify(broadcastMessage))
    })
})

http.listen(8080)