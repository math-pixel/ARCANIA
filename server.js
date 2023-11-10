const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
app.use('/medias', express.static(join(__dirname, 'medias')))
app.use('/sources', express.static(join(__dirname, 'sources')))
const server = createServer(app);
const io = new Server(server);

app.get('/projo', (req, res) => {
  res.sendFile(join(__dirname, 'sources/projo/projo.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});