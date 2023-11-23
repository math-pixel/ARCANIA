/* -------------------------------------------------------------------------- */
/*                                Init Variable                               */
/* -------------------------------------------------------------------------- */
// get / set information of the advencement of the game 
let stateOfGame = "Init" //? Init | Training | InGame | End


//* ##### Spells #####
let spells ;
//? Load Json spell information at start
preloadSpells()


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


document.getElementById("introButton").addEventListener("click", () => {
  playRulesVideo()
})

let parentVideo = document.getElementById("videoDiv")
let parentAudio = document.getElementById("audioDiv")


function playRulesVideo() {
  let introDiv = document.getElementById("intro")
  introDiv.parentNode.removeChild(introDiv);
  let videoIntro = document.getElementById("vidIntro")
  console.log(videoIntro)
  videoIntro.play()
  setTimeout(() => {
    videoIntro.parentNode.removeChild(videoIntro);
  }, 2000)
}
  
  


/* -------------------------------------------------------------------------- */
/*                                  Websocket                                 */
/* -------------------------------------------------------------------------- */
socket.on("player1", (spell) => {      
  actionWebsocket(spell, player1)
})
socket.on("player2", (spell) => {
  actionWebsocket(spell, player2)
})


function actionWebsocket(spell, player){
  let spellData;
  
  switch(stateOfGame){

    case "Init":
      break;

    case "TrainingPlayer":

      break; 

    case "InGame":

      switch (spell) {
        case "circle_loading":
          spellData = getSpellInformation("circle_loading")
          newSpellFired(spellData, player)
          break;
    
        case "lineH_loading":
          spellData = getSpellInformation("lineH_loading")
          newSpellFired(spellData, player)
          break;
        
        case "lineV_loading":
          spellData = getSpellInformation("lineV_loading")
          newSpellFired(spellData, player)
          break;
    
        case "circle":
          spellData = getSpellInformation("circle")
          newSpellFired(spellData, player)
          break;
    
        case "lineH":
          spellData = getSpellInformation("lineH")
          newSpellFired(spellData, player)
          break;
    
        case "lineV":
          spellData = getSpellInformation("lineV")
          newSpellFired(spellData, player)
          break;
    
        default:
          break;
        }
      break
  }

}