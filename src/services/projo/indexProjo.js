/* -------------------------------------------------------------------------- */
/*                                Init Variable                               */
/* -------------------------------------------------------------------------- */
// get / set information of the advencement of the game 
let stateOfGame = "Init" //? Init | Rules | TrainingPlayer | InGame | End

let playerName1 = "";
let playerName2 = "";

//* ##### Spells #####
let spells ;
//? Load Json spell information at start
preloadSpells()

async function preloadSpells(){
  const data = await fetch('/json/spells.json')
  .then((response) => response.json())
  .then((json) => {
      spellJson = json["spells"]
      return spellJson
  })
  .catch((error) => {
      console.error('Error preloading spells:', error);
  });

  spells = data;
  console.log('Variable globale définie :', spells);
}


// ##### Init websocket #####
const socket = io();

// ##### Init Player #####
let player1 = {
  name: "player1",
  life: 100, 
  mana: 0,
  loading: null,
  hit: null
}

let player2 = {
  name: "player2",
  life: 100,
  mana: 0,
  loading: null,
  hit: null
}

/* -------------------------------------------------------------------------- */
/*                          Init interaction with DOM                         */
/* -------------------------------------------------------------------------- */

// when button start is pressed
document.getElementById("introButton").addEventListener("click", () => {
  let introDiv = document.getElementById("intro")
  let trainingVideo = document.getElementById("training_vid")
  let videoVersus = document.getElementById("videoVersus")
  videoVersus.play()
  videoVersus.loop = true
  trainingVideo.play()
  trainingVideo.loop = true
  introDiv.parentNode.removeChild(introDiv);
  updateStateExperience() //? its Init State
})

let parentVideo = document.getElementById("videoDiv")
let parentAudio = document.getElementById("audioDiv")

function generateQRCode(place, url) {
  new QRCode(place, {
    text: url,
    width: 288,
    height: 288,
    colorDark: "white",
    colorLight: "black",
    correctLevel: QRCode.CorrectLevel.H
  });
}




/* -------------------------------------------------------------------------- */
/*                                 Rules Video                                */
/* -------------------------------------------------------------------------- */
function playRulesVideo() {
  
  let videoIntro = document.getElementById("vidIntro")
  // console.log(videoIntro)
  videoIntro.style.display = "block"
  videoIntro.play()

  videoIntro.addEventListener("ended", () => {
    console.log("finish vid")
    stateOfGame = "TrainingPlayer"
    updateStateExperience()
  })

  //! for debug comment the line above ( event listener ) and un-comment the line below
  // setTimeout(() => {
  //     stateOfGame = "TrainingPlayer"
  //     updateStateExperience()

  // }, 500)

}
  

// function fakeWireframeTraining(){
//   console.log("yey")

//   setTimeout(() => {
//     document.getElementById("l1").style.display = "none"
//     document.getElementById("r1").style.display = "none"

//     setTimeout(() => {
//       document.getElementById("l2").style.display = "none"
//       document.getElementById("r2").style.display = "none"
  
    
//       setTimeout(() => {
//         document.getElementById("l3").style.display = "none"
//         document.getElementById("r3").style.display = "none"
    
    
//         setTimeout(() => {
//           document.getElementById("trainingContainer").style.display = "none"
//           stateOfGame = "InGame"
//           updateStateExperience()

    
//         }, 10000)
//       }, 10000)
//     }, 10000)
//   }, 10000)
// }
/* -------------------------------------------------------------------------- */
/*                        Change Visuelle Of Experience                       */
/* -------------------------------------------------------------------------- */
function updateStateExperience(){
  console.log(stateOfGame)
  switch(stateOfGame){
    case "Init":
      //? waiting connection of the two remote
      //do nothing because its already init on dom
      break;
    case "Rules":
      //? display rules video

      //* remove div of waiting player
      document.getElementById("waiting_connection_container").style.display = "none";

      //* play video
      playRulesVideo()
      break;
    case "TrainingPlayer":

      document.getElementById("waiting_connection_container").style.display = "none";
      document.getElementById("vidIntro").style.display = "none"
      document.getElementById("training_container").style.display = "flex" //TODO display block

      //TODO call the trust fonction
      startTraining()
      // videoIntro.parentNode.removeChild(videoIntro);
      break;
    case "InGame":
      document.getElementById("backgroundBattle").play()
      document.getElementById("waiting_connection_container").style.display = "none";
      document.getElementById("vidIntro").style.display = "none"
      document.getElementById("training_container").style.display = 'none'

      startGame()
      break;
    case "End":
      document.getElementById("timer").style.display = "none"
      document.getElementById("videoDiv").style.display = "none"
      document.getElementById("audioDiv").style.display = "none"
      document.getElementById("playerInfo").style.display = "none"

      document.getElementById("waiting_connection_container").style.display = "none";
      document.getElementById("vidIntro").style.display = "none"
      document.getElementById("training_container").style.display = 'none'
      break;
    case "dataviz":

      // reset phone overlay
      websocketValidation("player1", "resetOverlay")
      websocketValidation("player2", "resetOverlay")

      
      document.getElementById("timer").style.display = "none"
      document.getElementById("videoDiv").style.display = "none"
      document.getElementById("audioDiv").style.display = "none"
      document.getElementById("playerInfo").style.display = "none"
      document.getElementById("backgroundBattle").style.display = "none"
      document.getElementById("waiting_connection_container").style.display = "none";
      document.getElementById("vidIntro").style.display = "none"
      document.getElementById("training_container").style.display = 'none'
      break;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Websocket                                 */
/* -------------------------------------------------------------------------- */

socket.on("allplayerConnected", (player) => {

  setTimeout(() => {
    // console.log("toto")
    stateOfGame = "dataviz"
    updateStateExperience()
  }, 5000)


})

// * receive the name of player
socket.on("playerName1", (name) => {
  //TODO play wizard Animation ( call function )
  playerName1 = name
  if (name !== "") {
    document.getElementById("wizardDiv1").style.display = 'flex'
    document.getElementById("User1").innerHTML = name
  } else {
    document.getElementById("wizardDiv1").style.display = 'none'
  }
})
socket.on("playerName2", (name) => {
  //TODO play wizard Animation ( call function )
  playerName2 = name
  if (name !== "") {
    document.getElementById("wizardDiv2").style.display = 'flex'
    document.getElementById("User2").innerHTML = name
  } else {
    document.getElementById("wizardDiv2").style.display = 'none'
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

    case "InGame":
      spellData = getSpellInformation(spell)
      newSpellFired(spellData, player)
      break;
      
  }

}