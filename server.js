const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
app.use('/medias', express.static(join(__dirname, 'medias')))
app.use('/sources', express.static(join(__dirname, 'sources')))
app.use('/phone', express.static(path.join(__dirname, 'phone')))
app.use('/model', express.static(path.join(__dirname, 'model')))
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'phone/index.html'));
});

app.get('/projo', (req, res) => {
  res.sendFile(join(__dirname, 'sources/projo/projo.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('circle', (value, callback) => {
    io.emit("circle", "player1")
  });

  socket.on('line', (value, callback) => {
    io.emit("line", "player2")
  });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});