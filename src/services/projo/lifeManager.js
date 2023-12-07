let tresholdLifeBar = 15 //? for adjust UI and life logic 

// manage life
function lifeManager(player, spellData) {

    //TODO verify if heal and dammage work togheter

    //* Set Damage
    if (spellData.damage != 0) {
        //* Update data damage player
        registerDataPlayer({}, player, spellData.damage)

        //* Add dommage to player
        if (player.life - spellData.damage > tresholdLifeBar) {
            player.life -= spellData.damage

            //* send phone feed back
            socket.emit("takeDamage", JSON.stringify( { playerName : player.name, spellName : spellData.name} ))

        } else {

          //? DEATH 
            console.log(player + ": dead !!!")
            player.life = 0


            //* send phone feed back
            socket.emit("takeDamage", JSON.stringify( { playerName : player.name, spellName : "dead"} ))
            
            // *End Game
            if (player.name == "player1") {
              endGame("winnerP1")

              //* set up phone overlay
              websocketValidation("player1", "win")
              websocketValidation("player2", "loose")
              
            }else{
              endGame("winnerP2")
              
              //* set up phone overlay
              websocketValidation("player2", "win")
              websocketValidation("player1", "loose")
            }
        }
  
      updateLife(player, "shot")
  
    } 
    
    //* Set Heal
    if (spellData.heal != 0){
      if (player.life + spellData.heal > 100) {
        player.life = 100
        console.log(player.life)
      } else {
        player.life += spellData.heal
        console.log(player.life)
      }
  
      updateLife(player, "heal")
    }

    // Display dammage
    let spellDamageData = getSpellInformation("damaged", player) 
    spellDamageData.audioSrc = randomHurtSound()
    displaySpell(spellDamageData, player)
  }
  
//* ##### Update Visual Life Bar #####
function updateLife(player, state) {

    //*Get life bar div in function of state
    let lifeDiv;
    if (player.name == "player1" && state == "shot") {
        lifeDiv = document.getElementById("infoLife2")
    } else if (player.name == "player1" && state == "heal") {
        lifeDiv = document.getElementById("infoLife1")
    } else if (player.name == "player2" && state == "shot") {
        lifeDiv = document.getElementById("infoLife1")
    } else if (player.name == "player2" && state == "heal"){
        lifeDiv = document.getElementById("infoLife2")
    }
    // console.log(lifeDiv)
    lifeDiv.style.clipPath  = `polygon(0px 0px, ${player.life}% 0%, ${player.life - 4}% 100%, 0% 100%)`

    // clip-path: polygon(0px 0px, {100.43}% 0%, {96.92}% 100%, 0% 100%);
}

function randomHurtSound() {
  min = Math.ceil(1);
  max = Math.floor(8);
  return "/medias/audio_hurt/hurt_" + (Math.floor(Math.random() * (max - min + 1)) + min) + ".mp3";
}