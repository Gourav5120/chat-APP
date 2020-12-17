//node server socket io
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')
const users = [];

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/../js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

io.on('connection', (socket) => {
  console.log('connection made ')
  socket.on('new-user-joined', (name) => {
    console.log('new user joined', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

    socket.on('send', (message) => {
    console.log(message)
    socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000,()=>console.log('server running on 8000'))
