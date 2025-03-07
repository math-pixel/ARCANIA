/* -------------------------------------------------------------------------- */
/*                                  Websocket                                 */
/* -------------------------------------------------------------------------- */

const socket = io();

// Emit 'identification' event when the socket connection is established
socket.on('connect', () => {
  console.log('Connected to server');

  // Emit 'identification' event with role 'Master'
  socket.emit('identification', 'Master');
});

socket.on("disconnect", (e) =>{
  alert("Oups :/ Une erreur c'est produise ! La page vas ce recharger. \n Info dev : connection websocket au server c'est perdu : ", e)
  location.reload()
})

// Event handler for 'qrCode_Setting' event
socket.on('qrCode_Setting', (data) => {
  console.log('Received QR code setting:', data);
  // Generate QR code with the received room ID
  // alert("new qrCode : ", data)
  console.log("new qrcode : ", data)
  roomID = data.roomId
  // let qrcode1 = document.getElementById("qrCode1")
  // let qrcode2 = document.getElementById("qrCode2")
  generateQRCode("qrCode1", window.location.hostname, window.location.port, "phone", parameters = `roomId=${data.roomId}&playerNumber=1`);
  generateQRCode("qrCode2", window.location.hostname, window.location.port, "phone", parameters = `roomId=${data.roomId}&playerNumber=2`);
})

// Event handler for 'response' event
socket.on('response', (data) => {
  console.log('Response from server:', data.message);
});

// Event handler for 'connectionStatus' event
socket.on('connectionStatus', (data) => {
  console.log('Connection status:', data.message);
});


// Get current room id : socket.emit("getRoom") 
socket.on("getRoom", (roomID) => {
  console.log(roomID)
})

let rulesAlreadyPassed = false // when remote deconnect and reconnect => does not display rules video 2 times
/* ---------- When all player is connected => change state of game ---------- */
socket.on("allplayerConnected", (player) => {
  
  if (rulesAlreadyPassed == false) {
    setTimeout(() => {
      // console.log("toto")
      updateStateExperience("Rules")
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
    document.getElementById("qrCodeFloatingContainer").style.display = "none"
  } else {
    alert("Player 1 is disconnected")

    generateQRCode("qrCodeFloating", window.location.hostname, window.location.port, "phone", parameters = `roomId=${roomID}&playerNumber=1`);
    document.getElementById("qrCodeFloatingContainer").style.display = "block"
    
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
    document.getElementById("qrCodeFloatingContainer").style.display = "none"
  } else {
    alert("Player 2 is disconnected")

    generateQRCode("qrCodeFloating", window.location.hostname, window.location.port, "phone", parameters = `roomId=${roomID}&playerNumber=2`);
    document.getElementById("qrCodeFloatingContainer").style.display = "block"
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


function actionWebsocket(spell, player){
  let spellData;
  console.log("state of the game : ", stateOfGame)
  
  switch(stateOfGame){

    case "Init":  
      break;

    case "TrainingPlayer":
        spellData = getSpellInformation(spell)
        trainingSpellDetected(spellData, player)
      break; 

    case "BeforeGame":
      // no action when player is placed
      break;
    case "InGame":

    // Catch special spell in function of mana
      if(player.mana != 100){
        console.log("normal")
        spellData = getSpellInformation(spell)
        newSpellFired(spellData, player)
      }else{
        console.log("ulti")

        spellData = getSpellInformation("ultime")
        newSpellFired(spellData, player)
      }
      break;
      
  }

}
