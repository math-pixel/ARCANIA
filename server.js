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
app.use('/', express.static(path.join(__dirname, 'src/services/projo')))
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
app.get('/phone', (req, res) => {
  res.sendFile(join(__dirname, 'src/services/phone/index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src/services/projo/projo.html'));
});

app.get('/panelAdmin', (req, res) => {
  res.sendFile(join(__dirname, 'src/services/panelAdmin/index.html'));
});

/* -------------------------------------------------------------------------- */
/*                              Rooms Information                             */
/* -------------------------------------------------------------------------- */
// rooms 0 is the template of rooms
roomsDatabase = {
  "0" : {
    "idMasterOfRoom": 0,
    "idPlayer_1" : 0,
    "idPlayer_2" : 0,
    "namePlayer_1" : "name remote 1",
    "namePlayer_2" : "name remote 2"
  }
  
}
// console.log(roomsDatabase["0"].idPlayer_1)

/* -------------------------------------------------------------------------- */
/*                              Socket IO Server                              */
/* -------------------------------------------------------------------------- */

// Gestionnaire de connexion Socket.IO
io.on('connection', (socket) => {

  let roomOfCurrentSocket = ""

  console.log('New connection');

  // Événement émis par le client (maître ou esclave)
  // template : data = { "role" : "slave", "idRoom" : 1984632 }
  socket.on('identification', (role) => {
      console.log('##### Test Client role Identification. Role :', role, "#####");
      if (role === 'Master') {
          console.log('Client identified as Master');

          // Créer une nouvelle salle de discussion pour le maître
          const room = socket.id.slice(0,6);
          // console.log(room)
          socket.join(room);
          roomOfCurrentSocket = room
          initNewRoomInDatabase(room)

          //set up the master of the room
          roomsDatabase[room].idMasterOfRoom = socket.id

          // Émettre l'URL du serveur de socket et l'ID de la salle de discussion au client maître
          socket.emit('qrCode_Setting', { roomId: room });

      } else if (role === 'Slave') {
          console.log('Client identified as Slave');

          // Répondre au client esclave
          socket.emit('slave_connected', { message: 'Connection established as Slave' });
      } else {
          socket.emit('response', { message: `Invalid client role`, role });
          console.error('Invalid client role:', role);
      }
  });

  socket.on('getRoom', () => {
      socket.emit('getRoom', roomOfCurrentSocket)
  })

  socket.on('joinRoom', (idRoom) => {
      // Joindre la salle de discussion correspondant à l'ID reçu du QR code
      socket.join(idRoom);
      roomOfCurrentSocket = idRoom

      socket.emit("roomJoined", idRoom)
  })

  // Événement de vérification de la connexion du client maître
  socket.on('checkConnection', () => {
      // Envoyer une confirmation de connexion au client maître
      io.to(roomOfCurrentSocket).emit('connectionStatus', { message: 'Connection OK' });
  });


  /* -------------------------------------------------------------------------- */
  /*                              Your Event Socket                             */
  /* -------------------------------------------------------------------------- */

  socket.on("console" ,(value) => {
    // console.log(value)
  })

  /* ------------------------------- INIT PHASE ------------------------------- */

  //* set up ID of remote
  socket.on("setupRemoteID", (value) => {
    setIDRemoteInRoom(roomOfCurrentSocket, value, socket)
  });

  //* remote send the username of the player
  socket.on('username', (value) => {
    setUserNameInRoom(roomOfCurrentSocket, value, socket)
  })

  /* ------------------------------- GAME PHASE ------------------------------- */
  
  // * remote send a spell
  socket.on('player1', (value, callback) => {
    if (roomsDatabase[roomOfCurrentSocket].idPlayer_1 == socket.id) {
      broadcastSpeelWebsocket(roomOfCurrentSocket, value, "player1")
    }
  });
  socket.on('player2', (value, callback) => {
    if (roomsDatabase[roomOfCurrentSocket].idPlayer_2 == socket.id) {
      broadcastSpeelWebsocket(roomOfCurrentSocket, value, "player2")
    }
  });


  socket.on('takeDamage', (information) => {
    let dataSocket = JSON.parse(information)
    let socketIdOfPlayerHurted = "";

    // set the id player who take dommage
    // if player1 send spell => player 2 take dommage
    if (dataSocket.playerName == 'player1') {
      socketIdOfPlayerHurted = roomsDatabase[roomOfCurrentSocket].idPlayer_2
    } else {
      socketIdOfPlayerHurted = roomsDatabase[roomOfCurrentSocket].idPlayer_1
    }
    socket.to(socketIdOfPlayerHurted).emit('damaged', dataSocket.spellName)
  })


  /* ---------------------------- In training phase --------------------------- */
  // send validation to main screen
  socket.on('validation', (information) => {
    let dataSocket = JSON.parse(information)
    let socketPlayerValidateSpell = "";
    if (dataSocket.playerName == 'player1') {
      socketPlayerValidateSpell = roomsDatabase[roomOfCurrentSocket].idPlayer_1
    } else {
      socketPlayerValidateSpell = roomsDatabase[roomOfCurrentSocket].idPlayer_2
    }

    socket.to(socketPlayerValidateSpell).emit('validation', dataSocket.state) 
  })
  
  /* -------------- when save's remote is disconnected remove id -------------- */
  socket.on("disconnect", (message) => {
    // RESET remote on disconnect
    // determinate witch remote is disconnected
    if (roomsDatabase[roomOfCurrentSocket]) {
      
      /* --------------------------- Player 1 Disconnect -------------------------- */
      if(roomsDatabase[roomOfCurrentSocket].idPlayer_1 == socket.id ){
        roomsDatabase[roomOfCurrentSocket].idPlayer_1 = 0
        roomsDatabase[roomOfCurrentSocket].namePlayer_1 = ""
        broadcastMessageToRoom(roomOfCurrentSocket, "playerName1", "nothing")
      }

      /* --------------------------- Player 2 Disconnect -------------------------- */
      if(roomsDatabase[roomOfCurrentSocket].idPlayer_2 == socket.id){
        roomsDatabase[roomOfCurrentSocket].idPlayer_2 = 0
        roomsDatabase[roomOfCurrentSocket].namePlayer_2 = ""
        broadcastMessageToRoom(roomOfCurrentSocket, "playerName2", "nothing")
      }

      /* ------------------------ Master of Room Disconnect ----------------------- */
      if (roomsDatabase[roomOfCurrentSocket].idMasterOfRoom == socket.id) {
        console.log("rooms number : ", roomOfCurrentSocket, " as been deleted")
        delete roomsDatabase[roomOfCurrentSocket]
        broadcastMessageToRoom(roomOfCurrentSocket, "ROOM_CLOSED", roomOfCurrentSocket)
      }

      console.warn("Client Deconnected : ", socket.id, " On Room : ", roomOfCurrentSocket, " message : ", message)
    }else{
      console.warn("Client Deconnection out of room", socket.id, " message : ", message)
    }


  });

  socket.on('<your-event>', (data) => {
      // Envoyer une confirmation de connexion au client maître
      broadcastMessageToRoom(roomOfCurrentSocket, data)
  });

});

/* -------------------------------------------------------------------------- */
/*                               Tools function                               */
/* -------------------------------------------------------------------------- */
// * add id if idRemote is equal to 0
function setIDRemoteInRoom(roomID, playerNumber, socket){

  let roomInformation = roomsDatabase[roomID]
  // console.log("room info",roomID, roomInformation)

  // console.log(roomInformation["idPlayer_1"])
  switch (playerNumber){ // playerNumber => player1 || player2
    case "player1":
      if (roomInformation.idPlayer_1 == 0) {
        roomInformation.idPlayer_1 = socket.id
        console.log("new phone connection player 1", socket.id)
      }else{
        // console.log("new phone player 1 try connection but place already taken", socket.id)
      }

      break;
    case "player2":
      if (roomInformation.idPlayer_2 == 0) {
        roomInformation.idPlayer_2 = socket.id
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

function setUserNameInRoom(roomID, value, socket){
  // console.log(socket.id + " username : " + value)

  let roomInformation = roomsDatabase[roomID] 
  if (roomInformation.idPlayer_1 == socket.id) {
    roomInformation.namePlayer_1 = value 
    broadcastMessageToRoom(roomID, "playerName1", value)
  } 
  if (roomInformation.idPlayer_2 == socket.id) {
    roomInformation.namePlayer_2 = value
    broadcastMessageToRoom(roomID, "playerName2", value)
  }

  // When 2 remote are connected
  if (roomInformation.namePlayer_1 != 0 && roomInformation.namePlayer_2 != 0) {
    broadcastMessageToRoom(roomID, "allplayerConnected", "no Information")
  }
}

function broadcastSpeelWebsocket(roomID, value, player){

  // console.log(value, player)
  switch (value){
    case 'circle_loading':
      broadcastMessageToRoom(roomID, player, "circle_loading")
      break;
    case 'circle':
      broadcastMessageToRoom(roomID, player, "circle")
      break;
    case 'lineH_loading':
      broadcastMessageToRoom(roomID, player, "lineH_loading")
      break;
    case 'lineH':
      broadcastMessageToRoom(roomID, player, "lineH")
      break;
    case 'lineV_loading':
      broadcastMessageToRoom(roomID, player, "lineV_loading")
      break;
    case 'lineV':
      broadcastMessageToRoom(roomID, player, "lineV")
      break;
    case 'cast_spell':
      break;
  }

}

function broadcastMessageToRoom(room, message, value){
  io.to(room).emit(message, value)
}

function initNewRoomInDatabase(roomID){
  roomsDatabase[roomID] = {
    "idMasterOfRoom": 0,
    "idPlayer_1" : 0,
    "idPlayer_2" : 0,
    "namePlayer_1" : "",
    "namePlayer_2" : ""
  }
  // console.log(roomsDatabase)
}

// Listen HTTP server
server.listen(3000, () => {
  console.log('server HTML running on port 3000');
});