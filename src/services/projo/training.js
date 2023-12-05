let current_Spell1 = document.getElementById("current_Spell1")
let current_Spell2 = document.getElementById("current_Spell2")
let states = ["circle","vertical","horizontal"]
let indexState = 0
let player1State = false
let player2State = false
let nextSpell = true

function startTraining(){
    // display first spell
    updateTraining(states[indexState])
}
 
function updateTraining(state) {
    switch (state) {
        case "horizontal":
            current_Spell1.src = "/medias/trainingPart/horizontal.gif"
            current_Spell2.src = "/medias/trainingPart/horizontal.gif"
            break;
        case "vertical":
            current_Spell1.src = "/medias/trainingPart/vertical.gif"
            current_Spell2.src = "/medias/trainingPart/vertical.gif"
            break;
        case "circle":
            current_Spell1.src = "/medias/trainingPart/rond.gif"
            current_Spell2.src = "/medias/trainingPart/rond.gif"
            break;
    
        default:
            break;
    }
}

function trainingSpellDetected(spellData, player){
    console.log(spellData)
    console.log(states[indexState])
    if (nextSpell) {
        // in function of player check if the current spell to do is the same detectected
        switch (states[indexState]) {
            case "horizontal":
                if (spellData.name == "lineH_loading") {
                    if (player.name == "player1") {
                        current_Spell1.src = "/medias/trainingPart/validation.gif"
                        player1State = true
                        websocketValidation("player1", "check")
                    } else {
                        current_Spell2.src = "/medias/trainingPart/validation.gif"
                        websocketValidation("player2", "check")
                        player2State = true
                    }
                }
                break
            case "vertical":
                if (spellData.name == "lineV_loading") {
                    if (player.name == "player1") {
                        current_Spell1.src = "/medias/trainingPart/validation.gif"
                        player1State = true
                        websocketValidation("player1", "check")
                    } else {
                        current_Spell2.src = "/medias/trainingPart/validation.gif"
                        player2State = true
                        websocketValidation("player2", "check")
                    }
                }
                break
            case "circle":
                if (spellData.name == "circle_loading") {
                    if (player.name == "player1") {
                        current_Spell1.src = "/medias/trainingPart/validation.gif"
                        player1State = true
                        websocketValidation("player1", "check")
                    } else {
                        current_Spell2.src = "/medias/trainingPart/validation.gif"
                        player2State = true
                        websocketValidation("player2", "check")
                    }
                }
                break;
        
            default:
                break;
        }

        if (player1State == true && player2State == true) {
            indexState += 1
            if (indexState < 3) {
                nextSpell = false
                setTimeout(() => {
                    websocketValidation("player1", "resetOverlay")
                    websocketValidation("player2", "resetOverlay")
                    player1State = false
                    player2State = false
                    updateTraining(states[indexState])
                    nextSpell = true
                }, 2000)
            } else {
                websocketValidation("player1", "resetOverlay")
                websocketValidation("player2", "resetOverlay")
                stateOfGame = "InGame"
                updateStateExperience()
            }
        }
    }
    

    
    // if yes => next spell ( display )
    // else do nothing
}

function websocketValidation(name, state) {
    socket.emit("validation", JSON.stringify( { playerName : name, state: state} ))
}