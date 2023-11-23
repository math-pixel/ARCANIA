let timeClock = 10000 //in ms
let timer
function startGame(){
    stateSpell = "InGame"
    startTimer()

}



function endGame(reason){
    console.warn("End Game")
    stateOfGame = "End"
}

// When a new spell is Fired by websocket
function newSpellFired(spellData, player){

    displaySpell(spellData, player)

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