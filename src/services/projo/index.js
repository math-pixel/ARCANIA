/* -------------------------------------------------------------------------- */
/*                                Init Variable                               */
/* -------------------------------------------------------------------------- */
// get / set information of the advencement of the game 
let stateOfGame = "Init" //? Init | Rules | TrainingPlayer | BeforeGame |  InGame | End | dataviz

let playerName1 = "";
let playerName2 = "";

let crowdSoundPlayed = false

let parentVideo = document.getElementById("videoDiv")
let parentAudio = document.getElementById("audioDiv")

let PRODUCTION_MODE = "Development" //? Production | Development

let roomID = null

/* ----------------------------- Load Spell Data ---------------------------- */
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


/* -------------------------------------------------------------------------- */
/*                                 Init Player                                */
/* -------------------------------------------------------------------------- */
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


function removeSplashScreen(){
  /* -------------------------- remove waiting click -------------------------- */
  let introDiv = document.getElementById("intro")
  introDiv.parentNode.removeChild(introDiv);
}

function playLoopVideo(){

  /* ----------------------------- training video ----------------------------- */
  let trainingVideo = document.getElementById("training_vid")
  trainingVideo.loop = true
  trainingVideo.play()
  
  /* ------------------------ Background versus qrCode ------------------------ */
  let videoVersus = document.getElementById("videoVersus")
  videoVersus.loop = true
  videoVersus.play()
}


/* -------------------------------------------------------------------------- */
/*                                 Start Game                                 */
/* -------------------------------------------------------------------------- */
//* When button start is pressed => ##### play all background loop ####

document.getElementById("introButton").addEventListener("click", () => {
  playLoopVideo()

  displayQrCode()

  removeSplashScreen()

  updateStateExperience("Init") //? Start with Init State
})

/* -------------------------------------------------------------------------- */
/*                           Shortcut for skip state                          */
/* -------------------------------------------------------------------------- */

window.addEventListener("keydown", (event) => {
  
  /* -------------------------- Remove thunder video -------------------------- */
  if (event.key == "1") {
    let videoIntro = document.getElementById("videoIntro")
    videoIntro.pause()
    videoIntro.parentNode.removeChild(videoIntro)
  }

})