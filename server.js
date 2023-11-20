const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require('path')

/* -------------------------------------------------------------------------- */
/*                         Config/Init Express server                         */
/* -------------------------------------------------------------------------- */
const app = express();
app.use('/medias', express.static(join(__dirname, 'src/medias')))
app.use('/services', express.static(path.join(__dirname, 'src/services')))
app.use('/phone', express.static(path.join(__dirname, 'src/services/phone')))
app.use('/projo', express.static(path.join(__dirname, 'src/services/projo')))
app.use('/json', express.static(path.join(__dirname, 'src/json')))
app.use('/model', express.static(path.join(__dirname, 'src/services/models')))

/* -------------------------------------------------------------------------- */
/*                        Config/Init Websocket server                        */
/* -------------------------------------------------------------------------- */
const server = createServer(app);
const io = new Server(server);

/* -------------------------------------------------------------------------- */
/*                               Routage Express                              */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src/services/phone/index.html'));
});

app.get('/projo', (req, res) => {
  res.sendFile(join(__dirname, 'src/services/projo/projo.html'));
});


/* -------------------------------------------------------------------------- */
/*                              Websocket Server                              */
/* -------------------------------------------------------------------------- */
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('circle', (value, callback) => {
    io.emit("circle", "player1")
    console.log("circle")
  });

  socket.on('line', (value, callback) => {
    io.emit("line", "player2")
    console.log("line")
  });

});

// Listen HTTP server
server.listen(3000, () => {
  console.log('server HTML running on port 3000');
});