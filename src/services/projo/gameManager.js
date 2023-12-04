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

    // console.log("new spell added" ,currentFiredSpell,spellsInFired)
}

//* #####Display spell in DOM #####
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

//* ##### remove spell from logic and DOM element #####
function removeSpellFired(videoElement){

    //* remove video from gamemanager with id
    spellsInFired = spellsInFired.filter(currentSpellFired => currentSpellFired.spellVideoElement.id == videoElement.id)

    //* remove video from DOM
    // console.log(`"${videoElement.id}"`)
    let tempVid = document.getElementById(videoElement.id)
    tempVid.parentNode.removeChild(videoElement)
    // console.log("new array",spellsInFired)
}
  

/* -------------------------------------------------------------------------- */
/*                              Collision Manager                             */
/* -------------------------------------------------------------------------- */
let indexSpellPlayer1Collision = 0
let indexSpellPlayer2Collision = 0
let allSpellFiredInformation_P1
let allSpellFiredInformation_P2

let spellWickness = {
    circle : "hline",
    hline : "vline",
    vline : "circle"
}

function collisionManager(){
    if(isSpellFiredFromTwoPlayer()){
        // set all %
        // setAllPercentageOfSpellsVideo()

        // if (areCloseValues(allSpellFiredInformation_P1,allSpellFiredInformation_P2, 10)) {

        //     document.getElementById(spellsInFired[indexSpellPlayer1Collision].spellVideoElement.id).classList.add("fadeOut");
        //     document.getElementById(spellsInFired[indexSpellPlayer2Collision].spellVideoElement.id).classList.add("fadeOut");

        //     console.log("spell touch", indexSpellPlayer2Collision)
        // }else{
        //     console.log("spell not touch")
        //     setTimeout(() => {
                
        //         collisionManager()
        //     },200)
        // }
        // same range ? => boucvle
            // do action dissipation

        //TODO compare it and remove 

        for (let spellPlayer1 = 0; spellPlayer1 < allSpellFiredInformation_P1.length; spellPlayer1++) {
            for (let spellPlayer2 = 0; spellPlayer2 < allSpellFiredInformation_P2.length; spellPlayer2++) {
                
                // get the spell name in weakness and compare it to current spell player 2
                if (spellWickness[spellPlayer1.dataSpell.name] == spellPlayer2.dataSpell.name ) {
                    //? spell p1 < p2
                    //TODO remove p1 spell
                    removeSpellFired(spellPlayer1.spellVideoElement)
                }

                if (spellWickness[spellPlayer2.dataSpell.name] == spellPlayer1.dataSpell.name ) {
                    //? spell p1 > p2
                    //TODO remove p2 spell
                    removeSpellFired(spellPlayer2.spellVideoElement)

                }
            }      
        }
    }
}

function isSpellFiredFromTwoPlayer(){

    const allSpellFiredInformation_P1 = spellsInFired.filter(Element => Element.playerObject.name == "player1")
    const allSpellFiredInformation_P2 = spellsInFired.filter(Element => Element.playerObject.name == "player2")
    
    if (arrayPlayer1.length > 0 && arrayPlayer2.length > 0) {
        return true
    }else{
        return false
    }
}

function setAllPercentageOfSpellsVideo(){

    allSpellFiredInformation_P1.forEach((element, index) => {

        const vidElement = element.spellVideoElement
        const currentTime = vidElement.currentTime
        const maxTime = vidElement.duration
        allSpellFiredInformation_P1[index] = (100 * currentTime) / maxTime
    });
    
    allSpellFiredInformation_P2.forEach((element, index) => {
        const vidElement = element.spellVideoElement
        const currentTime = vidElement.currentTime
        const maxTime = vidElement.duration
        // (maxTime - currentTime) invert for get the collision 
        allSpellFiredInformation_P2[index] = (100 * (maxTime - currentTime)) / maxTime
    });

    console.log(allSpellFiredInformation_P1, "%")
}

function areCloseValues(array1, array2, deviationValue) {
    let indexValue1 = 0
    let indexValue2 = 0
    for (let value1 of array1) {
        for (let value2 of array2) {
            if (Math.abs(value1 - value2) <= deviationValue) {
                console.log(`The values ${value1} and ${value2} are close.`);
                indexSpellPlayer1Collision = indexValue1
                indexSpellPlayer2Collision = indexValue2
                return true
            }
            indexValue2 += 1
        }
        indexValue1 += 1
    }
    return false
}