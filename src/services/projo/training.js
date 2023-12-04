let current_Spell1 = document.getElementById("current_Spell1")
let current_Spell2 = document.getElementById("current_Spell2")
let states = ["circle","vertical","horizontal"]
let indexState = 0
let player1State = false
let player2State = false

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
    console.log("yey")
    console.log(spellData)
    console.log(states[indexState])
    // in function of player check if the current spell to do is the same detectected
    switch (states[indexState]) {
        case "horizontal":
            if (spellData.name == "lineH") {
                if (player.name == "player1") {
                    current_Spell1.src = "/medias/trainingPart/validation.gif"
                    player1State = true
                    websocketValidation("player1", "validate")
                } else {
                    current_Spell2.src = "/medias/trainingPart/validation.gif"
                    websocketValidation("player2", "validate")
                    player2State = true
                }
            }
            break
        case "vertical":
            if (spellData.name == "lineV") {
                if (player.name == "player1") {
                    current_Spell1.src = "/medias/trainingPart/validation.gif"
                    player1State = true
                    websocketValidation("player1", "validate")
                } else {
                    current_Spell2.src = "/medias/trainingPart/validation.gif"
                    player2State = true
                    websocketValidation("player2", "validate")
                }
            }
            break
        case "circle":
            if (spellData.name == "circle") {
                if (player.name == "player1") {
                    console.log("yey1")
                    current_Spell1.src = "/medias/trainingPart/validation.gif"
                    player1State = true
                    websocketValidation("player1", "validate")
                } else {
                    console.log("yey2")
                    current_Spell2.src = "/medias/trainingPart/validation.gif"
                    player2State = true
                    websocketValidation("player2", "validate")
                }
            }
            break;
    
        default:
            break;
    }

    if (player1State == true && player2State == true) {
        console.log("yes")
        indexState += 1
        if (indexState < 3) {
            setTimeout(() => {
                websocketValidation("player1", "nothing")
                websocketValidation("player2", "nothing")
                player1State = false
                player2State = false
                updateTraining(states[indexState])
            }, 2000)
        } else {
            stateOfGame = "InGame"
        }
    } else {
        console.log("no")
    }
    // if yes => next spell ( display )
    // else do nothing
}

function websocketValidation(name, state) {
    socket.emit("validation", JSON.stringify( { playerName : name, state: state} ))
}