/* -------------------------------------------------------------------------- */
/*                                Init Variable                               */
/* -------------------------------------------------------------------------- */
// get / set information of the advencement of the game 
let stateOfGame = "InGame" //? Init | Rules | TrainingPlayer | InGame | End | dataviz

let playerName1 = "";
let playerName2 = "";

let crowdSoundPlayed = false

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
//* When button start is pressed => ##### play all background loop ####

document.getElementById("introButton").addEventListener("click", () => {
  let introDiv = document.getElementById("intro")
  

  // training video
  let trainingVideo = document.getElementById("training_vid")
  trainingVideo.play()
  trainingVideo.loop = true
  
  // TODO change place
  // Play animation qrCode
  document.getElementById("qrCode1").classList.remove("screenOut")
  document.getElementById("qrCode2").classList.remove("screenOut")
  
  
  // background versus
  let videoVersus = document.getElementById("videoVersus")
  videoVersus.play()
  videoVersus.loop = true

  //* remove waiting click
  introDiv.parentNode.removeChild(introDiv);
  updateStateExperience() //? its Init State
})

let parentVideo = document.getElementById("videoDiv")
let parentAudio = document.getElementById("audioDiv")


/* -------------------------------------------------------------------------- */
/*                                   QR Code                                  */
/* -------------------------------------------------------------------------- */
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
  
  let rulesVideo = document.getElementById("rulesVideo")
  // console.log(rulesVideo)
  rulesVideo.style.display = "block"
  rulesVideo.play()

  rulesVideo.addEventListener("ended", () => {
    console.log("finish vid")
    rulesVideo.pause()
    rulesVideo.style.display = "none" 
    stateOfGame = "TrainingPlayer"
    updateStateExperience()
  })

  // //! for debug comment the line above ( event listener ) and un-comment the line below
  // setTimeout(() => {

  //   rulesVideo.pause()
  //   rulesVideo.style.display = "none"
  //     stateOfGame = "TrainingPlayer"
  //     updateStateExperience()

  // }, 500)

}

//* skip rules video
document.getElementById("skipButton").addEventListener("click", () => {
  rulesVideo.pause()
  rulesVideo.style.display = "none" 
  stateOfGame = "TrainingPlayer"
  updateStateExperience()
})

/* -------------------------------------------------------------------------- */
/*                        Change Visuelle Of Experience                       */
/* -------------------------------------------------------------------------- */

//? Waiting connection
let pagewaitingConnection = document.getElementById("waiting_connection_container")
// let videoIntroThunder = document.getElementById("videoIntro")

//? Rules
let pageRules = document.getElementById("containerRules")

//? training
let pageTraining = document.getElementById("training_container")

//? In game
let gui = document.getElementById("playerInfo")
let videoBackgroundGame = document.getElementById("backgroundBattle")
let fightPositionIndication = document.getElementById("fightPositionIndication")

//? video winner 
let videoWinner = document.getElementById("endGameVideo")

//? dataViz
let datavizPage = document.getElementById("datavizDiv")

function updateStateExperience(){
  console.log(stateOfGame)
  switch(stateOfGame){
    case "Init":
      //? waiting connection of the two remote
      
      // Intro arcania thunder
      let videoIntro = document.getElementById("videoIntro")
      videoIntro.play()

      //* wait 10 sec 
      setTimeout(() => {
        //* play crowd sound
        createAudioElement({audioSrc : "../medias/audio_ambiant/crowd_loop.mp3"}, true, 0.4)
      }, 200)

      // When video thunder is end
      videoIntro.addEventListener("ended", () => {
        
        // remove video intro thunder
        videoIntro.parentNode.removeChild(videoIntro)

      })
    
      break;
    case "Rules":
      //? display rules video
      // document.getElementById("containerRules").display = "block"
      // //* remove div of waiting player
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("videoIntro").pause()


      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "block"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"



      //* play video
      playRulesVideo()
      break;
    case "TrainingPlayer":
      //? training part

      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = "flex" //TODO display block
      // document.getElementById("videoIntro").pause()

      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "block"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"


      startTraining()
      // videoIntro.parentNode.removeChild(videoIntro);
      break;
    case "InGame":
      // document.getElementById("videoIntro").pause()
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'
      
      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "flex"
      videoBackgroundGame.style.display = "block"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"

      // play background video
      document.getElementById("backgroundBattle").play()
      
      // Play video preparation
      fightPositionIndication.style.display = "block"
      fightPositionIndication.play()
      // event when position indication is end
      fightPositionIndication.addEventListener("ended", () => {
        fightPositionIndication.style.display = "none"
        startGame()
      }) 

      break;
    case "End":
      //? end game

      // document.getElementById("videoIntro").pause()

      // document.getElementById("timerContainer").style.display = "none"
      // document.getElementById("videoDiv").style.display = "none"
      // document.getElementById("audioDiv").style.display = "none"
      // document.getElementById("playerInfo").style.display = "none"

      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'


      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "block"
      datavizPage.style.display = "none"

      break;
    case "dataviz":
      //? end screen

      // reset phone overlay
      websocketValidation("player1", "resetOverlay")
      websocketValidation("player2", "resetOverlay")

      // document.getElementById("videoIntro").pause()
      
      // document.getElementById("timerContainer").style.display = "none"
      // document.getElementById("videoDiv").style.display = "none"
      // document.getElementById("audioDiv").style.display = "none"
      // document.getElementById("playerInfo").style.display = "none"
      // document.getElementById("backgroundBattle").style.display = "none"
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'

      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "block"

      updateData(winner)
      break;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Websocket                                 */
/* -------------------------------------------------------------------------- */
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