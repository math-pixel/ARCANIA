/* -------------------------------------------------------------------------- */
/*                               init websocket                               */
/* -------------------------------------------------------------------------- */
const socket = io();

socket.on("connect", () => {

});

/* -------------------------------------------------------------------------- */
/*                               Websocet phone                               */
/* -------------------------------------------------------------------------- */

// Function to handle the connection status
socket.on('connectionStatus', (data) => {
    console.log('Connection status:', data.message);
});

// Function to handle the response from the server
socket.on('slave_connected', (data) => {

});

// when connected to the room
socket.on("roomJoined", (roomID) => {

})

// Get current room id : socket.emit("getRoom") 
socket.on("getRoom", (roomID) => {
    console.log(roomID)
})


/* -------------------------------------------------------------------------- */
/*                               Websocket panel                              */
/* -------------------------------------------------------------------------- */



// Emit 'identification' event when the socket connection is established
socket.on('connect', () => {

  });
  
  // Event handler for 'qrCode_Setting' event
  socket.on('qrCode_Setting', (data) => {

    // generateQRCode("qrCode1", window.location.hostname, window.location.port, "phone", parameters = `roomId=${data.roomId}&playerNumber=1`);
    // generateQRCode("qrCode2", window.location.hostname, window.location.port, "phone", parameters = `roomId=${data.roomId}&playerNumber=2`);
  })
  
  // Event handler for 'response' event
  socket.on('response', (data) => {
    console.log('Response from server:', data.message);
  });
  
  
  let rulesAlreadyPassed = false
  socket.on("allplayerConnected", (player) => {
  
    if (rulesAlreadyPassed == false) {
      setTimeout(() => {
        // console.log("toto")
        stateOfGame = "Rules"
        updateStateExperience()
        rulesAlreadyPassed = true
      }, 5000)
    }
  
  
  })
  
  // * receive the name of player
  socket.on("playerName1", (name) => {
    //TODO play wizard Animation ( call function )
    playerName1 = name
    if (name !== "") {
      document.getElementById("wizardDiv1").style.display = 'flex'
      document.getElementById("User1").innerHTML = name
      document.getElementById("qrCode1").classList.add("screenOut")
    } else {
      document.getElementById("wizardDiv1").style.display = 'none'
      document.getElementById("qrCode1").classList.remove("screenOut")
    }
  })
  socket.on("playerName2", (name) => {
    //TODO play wizard Animation ( call function )
    playerName2 = name
    if (name !== "") {
      document.getElementById("wizardDiv2").style.display = 'flex'
      document.getElementById("User2").innerHTML = name
      document.getElementById("qrCode2").classList.add("screenOut")
    } else {
      document.getElementById("wizardDiv2").style.display = 'none'
      document.getElementById("qrCode2").classList.remove("screenOut")
    }
  })
  
  
  socket.on("player1", (spell) => {      
    actionWebsocket(spell, player1)
  })
  socket.on("player2", (spell) => {
    actionWebsocket(spell, player2)
  })