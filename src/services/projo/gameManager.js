let currentTimer = 5000 // in sec
let timerSec
/* -------------------------------------------------------------------------- */
/*                                 Start Game                                 */
/* -------------------------------------------------------------------------- */
function startGame(){
    stateOfGame = "InGame"
    startTimer()
    console.warn(stateOfGame)
}

function startTimer(){

    timerSec = setInterval(() => {
        document.getElementById("timer").innerHTML = currentTimer
        currentTimer -= 1

        if (currentTimer == 0) {
            endGame("timeout")
        }
    }, 1000)

}



/* -------------------------------------------------------------------------- */
/*                                  End Game                                  */
/* -------------------------------------------------------------------------- */
function endGame(reason){
    console.warn("End Game")

    // clear timer
    clearInterval(timerSec)
    stateOfGame = "End"

    let a = document.getElementById("endVideoWin")
    a.play()
    a.addEventListener("ended", () => {
        a.style.display = "none"
        document.getElementById("stat").style.display = "block"
    })

}

/* -------------------------------------------------------------------------- */
/*                             Spell Logic Manager                            */
/* -------------------------------------------------------------------------- */
let spellsInFired = []

//* ###### When a new spell is Fired by websocket #####
function newSpellFired(spellData, player){
    
    //* adding spell in game and display it
    addSpellInGameLogic(spellData, player)

    //* check if collision
    collisionManager()

}

//* ##### add spell in array spellsInFired #####
function addSpellInGameLogic(spellData, player){

    let currentFiredSpell = displaySpell(spellData, player)

    //* If its a attack spell
    if (!spellData.name.includes("loading") && !spellData.name.includes("damaged")) {
        let spellFiredInformation = {
            playerObject : player,
            spellVideoElement : currentFiredSpell,
            dataSpell : spellData
        }
        spellsInFired.push(spellFiredInformation)
    }

}

/* -------------------------------------------------------------------------- */
/*                            Display spell in DOM                            */
/* -------------------------------------------------------------------------- */
function displaySpell(spellData, player) {

    createAudioElement(spellData)

    //* Set up video add-on information
    // check if its a loading video
    //* create video element
    if (spellData.name.includes("loading")) {
        if (player.loading == null) {
            return createVideoElement(player, spellData, loop = true, isLoadingSpell = true)
            
        }
    }else if(!spellData.name.includes("loading")){
        //? normal spell
        return createVideoElement(player, spellData, loop = false, isLoadingSpell = false)
    }
    
}

/* -------------------------------------------------------------------------- */
/*                   remove spell from logic and DOM element                  */
/* -------------------------------------------------------------------------- */
function removeSpellFired(videoElement){

    //* remove video from gamemanager with id
    spellsInFired = spellsInFired.filter(currentSpellFired => currentSpellFired.spellVideoElement.id == videoElement.id)

    //* remove video from DOM in fade out and cut it after 1 sec
    let tempVid = document.getElementById(videoElement.id)
    tempVid.classList.add("fadeOut")
    setTimeout(() => { tempVid.parentNode.removeChild(videoElement) },1000)
}
  

/* -------------------------------------------------------------------------- */
/*                              Collision Manager                             */
/* -------------------------------------------------------------------------- */
let indexSpellPlayer1Collision = 0
let indexSpellPlayer2Collision = 0
let allSpellFiredInformation_P1
let allSpellFiredInformation_P2

let spellWickness = {
    circle : "lineH",
    lineH : "lineV",
    lineV : "circle"
}

let toto = document.getElementById("toto")
function collisionManager(){
    
    if(isSpellFiredFromTwoPlayer()){

        // * for all spell fired check his weakness
        for (let spellPlayer1 of allSpellFiredInformation_P1) {
            for (let spellPlayer2 of allSpellFiredInformation_P2) {
                
                //* get the spell weakness player 1 and compare it to current spell name player 2
                if (spellWickness[spellPlayer1.dataSpell.name] == spellPlayer2.dataSpell.name ) {
                    //? spell p1 < p2
                    //? timeout for wait the loading meta data
                    setTimeout(() => {
                        let w = getCollisionCenterPoint(spellPlayer1.spellVideoElement, spellPlayer2.spellVideoElement)
                        console.log(w)
                        toto.style.left = w + "vw"
                    }, 100)
                    removeSpellFired(spellPlayer1.spellVideoElement)
                }

                //* get the spell weakness player 2 and compare it to current spell name player 1
                if (spellWickness[spellPlayer2.dataSpell.name] == spellPlayer1.dataSpell.name ) {
                    //? spell p1 > p2
                    //? timeout for wait the loading meta data
                    setTimeout(() => {
                        let w = getCollisionCenterPoint(spellPlayer1.spellVideoElement, spellPlayer2.spellVideoElement)
                        console.log(w)
                        toto.style.left = w + "vw"
                    }, 100)
                    removeSpellFired(spellPlayer2.spellVideoElement)
                }
            }      
        }
    }
}


/* -------------------------------------------------------------------------- */
/*                               Tools Function                               */
/* -------------------------------------------------------------------------- */

function getCollisionCenterPoint(videoElement1, videoElement2){
    //* get current % advencement each video
    let percentAdvencementVideo1 = getAdvencementPercentageOfVideo(videoElement1)
    let percentAdvencementVideo2 = getAdvencementPercentageOfVideo(videoElement2)

    //* totalPercent = add 2 %
    let totalPercent = percentAdvencementVideo1 + percentAdvencementVideo2
    //* middle = cross product of percentage
    let middle = ( 100 - totalPercent ) / 2
    //* currentPercent = advencement percentage vid1 + gap / 2
     currentPercent = percentAdvencementVideo1 + middle

     return currentPercent
}

function getAdvencementPercentageOfVideo(video){
    let timeVideo = video.currentTime
    let maxTimeVideo = video.duration

    let percent = ( 100 * timeVideo ) / maxTimeVideo
    console.log(video, timeVideo, maxTimeVideo, percent)

    return parseInt(percent)
}

function isSpellFiredFromTwoPlayer(){

    allSpellFiredInformation_P1 = spellsInFired.filter(Element => Element.playerObject.name == "player1")
    allSpellFiredInformation_P2 = spellsInFired.filter(Element => Element.playerObject.name == "player2")
    
    if (allSpellFiredInformation_P1.length > 0 && allSpellFiredInformation_P2.length > 0) {
        return true
    }else{
        return false
    }
}