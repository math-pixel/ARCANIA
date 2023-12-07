let currentTimer = 120 // in sec
let timerSec
let ambianceSound
/* -------------------------------------------------------------------------- */
/*                                 Start Game                                 */
/* -------------------------------------------------------------------------- */
function startGame(){
    stateOfGame = "InGame"
    startTimer()
    startAmbianceAudio()
    console.warn(stateOfGame)
}

function startAmbianceAudio() {
    ambianceSound = document.createElement('audio')
    ambianceSound.src = "/medias/ambiance_sound.mp3"
    ambianceSound.preload = "auto"
    ambianceSound.autoplay = true
    ambianceSound.volume = 0.2

    parentAudio.appendChild(ambianceSound)
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

    ambianceSound.parentNode.removeChild(ambianceSound)

    // * set state "end" for there is not enought spell 
    stateOfGame = "End"
    updateStateExperience()
    // let a = document.getElementById("endVideoWin")
    // a.play()
    // a.addEventListener("ended", () => {
    //     a.style.display = "none"
    //     document.getElementById("stat").style.display = "block"
    // })

    // * do action in function of win
    switch(reason){
        case "timeout":

            if (player1.life > player2.life) {
                startEndVideo("/medias/end/winner_red.webm")
            }else{
                startEndVideo("/medias/end/winner_blue.webm")
            }

            break;
        case "winnerP1":
            startEndVideo("/medias/end/winner_red.webm")
            winner = 'player1'
            break;
        case "winnerP2":
            startEndVideo("/medias/end/winner_blue.webm")
            winner = 'player2'
            break;
    }

}

function startEndVideo(src){
    let video = document.getElementById("endGameVideo")
  
    video.src = src
    video.style.display = "block"
  
    video.play()
  
    video.addEventListener("ended", () => {
        video.parentNode.removeChild(video)
        ambianceSound.parentNode.removeChild(ambianceSound)
        stateOfGame = "dataviz"
        updateStateExperience()
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

    registerDataPlayer(spellData, player)

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
function removeSpellFired(videoElement, fadeOutSpell = false){

    //* remove video from gamemanager with id
    spellsInFired = spellsInFired.filter(currentSpellFired => currentSpellFired.spellVideoElement.id == videoElement.id)

    if (fadeOutSpell) {
        //* remove video from DOM in fade out and cut it after 1 sec
        let tempVid = document.getElementById(videoElement.id)
        tempVid.classList.add("fadeOut")
        setTimeout(() => { tempVid.parentNode.removeChild(videoElement) }, 500)
    }else{
        //* remove video from DOM
        let tempVid = document.getElementById(videoElement.id)
        tempVid.parentNode.removeChild(videoElement)
    }
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
                        let percentAdvencement = getCollisionCenterPoint(spellPlayer1.spellVideoElement, spellPlayer2.spellVideoElement)
                        drawExplosion(percentAdvencement)
                    }, 100)
                    removeSpellFired(spellPlayer1.spellVideoElement, true)
                }

                //* get the spell weakness player 2 and compare it to current spell name player 1
                if (spellWickness[spellPlayer2.dataSpell.name] == spellPlayer1.dataSpell.name ) {
                    //? spell p1 > p2
                    //? timeout for wait the loading meta data
                    setTimeout(() => {
                        let percentAdvencement = getCollisionCenterPoint(spellPlayer1.spellVideoElement, spellPlayer2.spellVideoElement)
                        drawExplosion(percentAdvencement)
                    }, 100)
                    removeSpellFired(spellPlayer2.spellVideoElement, true)
                }

                if (spellPlayer1.dataSpell.name == spellPlayer2.dataSpell.name) {
                    //? spell p1 == p2 => same spell
                    //? timeout for wait the loading meta data
                    setTimeout(() => {
                        let percentAdvencement = getCollisionCenterPoint(spellPlayer1.spellVideoElement, spellPlayer2.spellVideoElement)
                        drawExplosion(percentAdvencement)
                    }, 100)
                    removeSpellFired(spellPlayer1.spellVideoElement, true)
                    removeSpellFired(spellPlayer2.spellVideoElement, true)
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

function drawExplosion(x, y = 0){
    let video = document.createElement('video')
    video.src = "/medias/spell_effect/explosion.webm"
    video.autoplay = true
    video.type = "video/webp"
    video.preload = "auto"
    video.style.position = "absolute"
    video.style.top = y.toString() + "vh"
    video.style.left = (x - 33).toString() + "vw"
    
    displayFlash()
    video.addEventListener("ended", () => {

        video.parentNode.removeChild(video)

    })
    
    parentVideo.appendChild(video)

}

function displayFlash(){

    let flash = document.getElementById("flash")

    flash.style.display = "block"
    setTimeout(() => {
        flash.style.display = "none"
    }, 200) 

}

/* -------------------------------------------------------------------------- */
/*                                 Data player                                */
/* -------------------------------------------------------------------------- */
let playersStat = {
   "player1": {
        fireSpell: 0,
        waterSpell: 0,
        natureSpell: 0,
        ultimeSpell: 0,
        sortTotal: 0,
        manaTotal: 0,
        degatTotal: 0,
    },
    "player2": {
        fireSpell: 0,
        waterSpell: 0,
        natureSpell: 0,
        ultimeSpell: 0,
        sortTotal: 0,
        manaTotal: 0,
        degatTotal: 0,
    }
}


function registerDataPlayer(spellData, player, damage = 0) {
    if (Object.keys(spellData).length !== 0) {
        switch (spellData.name) {
            case "circle":
                playersStat[player.name]["fireSpell"] += 1
                playersStat[player.name]["sortTotal"] += 1
                playersStat[player.name]["manaTotal"] += 10
                break;
        
            case "lineH":
                playersStat[player.name]["waterSpell"] += 1
                playersStat[player.name]["sortTotal"] += 1
                playersStat[player.name]["manaTotal"] += 10
                break;
        
            case "lineV":
                playersStat[player.name]["natureSpell"] += 1
                playersStat[player.name]["sortTotal"] += 1
                playersStat[player.name]["manaTotal"] += 10
                break;
        
            case "ultime":
                playersStat[player.name]["ultimeSpell"] += 1
                playersStat[player.name]["sortTotal"] += 1
                playersStat[player.name]["manaTotal"] += 10
                break;
        }
    }

    playersStat[player.name]["degatTotal"] += damage

    console.log(playersStat)
}