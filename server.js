const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require('path');
const { Socket } = require('node:dgram');

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
app.use('/fonts', express.static(path.join(__dirname, 'src/fonts')))

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
let usernameRemote = ["", ""]
let idRemotes = [0, 0]
io.on('connection', (socket) => {
  console.log('a user connected in websocket');

  socket.on("console" ,(value) => {
    console.log(value)
  })

  //* set up name of remote
  socket.on("phone_name", (value) => {
    managerIDWebsocket(value, socket)
  });


  // * remote send a spell
  socket.on('player1', (value, callback) => {
    if (idRemotes[0] == socket.id) {
      actionWebsocket(value, "player1")
    }
  });
  socket.on('player2', (value, callback) => {
    if (idRemotes[1] == socket.id) {
      actionWebsocket(value, "player2")
    }
  });


  //* remote send the username of the player
  socket.on('username', (value) => {
    // console.log(socket.id + " username : " + value)
    if (idRemotes[0] == socket.id) {
      usernameRemote[0] = value 
      io.emit("playerName1", value)
    } else {
      usernameRemote[1] = value
      io.emit("playerName2", value)
    }
    // console.log(usernameRemote)

    // When 2 remote are connected
    if (usernameRemote[0] != 0 && usernameRemote[1] != 0) {
      io.emit("allplayerConnected", "toto")
    }
  })

  socket.on('takeDamage', (information) => {
    let dataSocket = JSON.parse(information)
    let socketId = "";
    if (dataSocket.playerName == 'player1') {
      socketId = idRemotes[1]
    } else {
      socketId = idRemotes[0]
    }
    socket.to(socketId).emit('damaged', dataSocket.spellName)
  })

  socket.on('validation', (information) => {
    let dataSocket = JSON.parse(information)
    let socketId = "";
    if (dataSocket.playerName == 'player1') {
      socketId = idRemotes[0]
    } else {
      socketId = idRemotes[1]
    }

    socket.to(socketId).emit('validation', dataSocket.state)
  })
  
  //* ##### when save's remote is disconnected remove id #####
  socket.on("disconnect", () => {
 
    for (indexRemote in idRemotes) {
      if (idRemotes[indexRemote] == socket.id) {
        idRemotes[indexRemote] = 0
        usernameRemote[indexRemote] = ""
        if (indexRemote == 0) {
          io.emit("playerName1", "")
        } else {
          io.emit("playerName2", "")
        }
      }
    }
    console.log(usernameRemote)

    // console.log(idRemotes)
  });

});

// * add id if idRemote is equal to 0
function managerIDWebsocket(phone_name, socket){
  switch (phone_name){
    case "player1":
      if (idRemotes[0] == 0) {
        idRemotes[0] = socket.id
        console.log("new phone connection player 1", socket.id)
      }else{
        // console.log("new phone player 1 try connection but place already taken", socket.id)
      }

      break;
    case "player2":
      if (idRemotes[1] == 0) {
        idRemotes[1] = socket.id
        console.log("new phone connection player 2", socket.id)
      }else{
        // console.log("new phone player 2 try connection but place already taken", socket.id)
      }

      break;
    default:
      console.error("Error while new phone device is connected : missing 'player[number]")
      break;
  }
}

function actionWebsocket(value, player){

  console.log(value, player)
  switch (value){
    case 'Connection':
      //TODO do action when player is connected
      break;
    case 'circle_loading':
      io.emit(player, "circle_loading")
      break;
    case 'circle':
      io.emit(player, "circle")
      break;
    case 'lineH_loading':
      io.emit(player, "lineH_loading")
      break;
    case 'lineH':
      io.emit(player, "lineH")
      break;
    case 'lineV_loading':
      io.emit(player, "lineV_loading")
      break;
    case 'lineV':
      io.emit(player, "lineV")
      break;
    case 'cast_spell':
      break;
  }

}

// Listen HTTP server
server.listen(3000, () => {
  console.log('server HTML running on port 3000');
});