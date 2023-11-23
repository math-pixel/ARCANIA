let timeClock = 100000000000 //in ms
let timer
function startGame(){
    stateOfGame = "InGame"
    startTimer()
    console.warn(stateOfGame)
}

startGame()

function endGame(reason){
    console.warn("End Game")
    stateOfGame = "End"
}

let spellsInFired = []

// When a new spell is Fired by websocket
function newSpellFired(spellData, player){
    
    addSpellInGameLogic(spellData, player)



}

//? add spell in array spellsInFired
function addSpellInGameLogic(spellData, player){
    
    let currentFiredSpell = displaySpell(spellData, player)
    let spellFiredInformation = {
        playerObject : player,
        spellVideoElement : currentFiredSpell
    }
    spellsInFired.push(spellFiredInformation)

    console.log("new spell added" ,currentFiredSpell,spellsInFired)
}

//? remove spell from logic and DOM element
function removeSpellFired(videoElement){

    //* remove video from gamemanager with id
    spellsInFired = spellsInFired.filter(currentSpellFired => currentSpellFired.spellVideoElement.id == videoElement.id)

    //* remove video from DOM
    // console.log(`"${videoElement.id}"`)
    let tempVid = document.getElementById(videoElement.id)
    tempVid.parentNode.removeChild(videoElement)
    // console.log("new array",spellsInFired)
}
  


function displaySpell(spellData, player) {

    createAudioElement(spellData)

    //* Set up video add-on information
    // check if its a loading video
    if (spellData.name.includes("loading")) {
        if (player.loading == null) {
            console.log(player.loading)
            return createVideoElement(player, spellData, loop = true, isLoadingSpell = true)
            
        }
    }else if(!spellData.name.includes("loading")){
        //? normal spell
        return createVideoElement(player, spellData, loop = false, isLoadingSpell = false)
    }
    
}


function startTimer(){
    timer = setTimeout(() => {
        endGame("Timout")
    }, timeClock)
}