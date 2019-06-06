const express = require('express');
const app = express();

server = app.listen(3001, function(){
    console.log('server is running on port 3001')
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(socket.id)
    
    socket.on('ENVIAR_RESERVA', function(data) {
        io.emit('MENSAJE_RESERVA', data)
    });

    socket.on('LIBERAR_RESERVA', function(data) {
        io.emit('MENSAJE_LIBERAR', data)
    });
});