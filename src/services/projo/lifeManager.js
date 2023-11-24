// manage life
function lifeManager(player, spellData) {

    //TODO verify if heal and dammage work togheter

    //* Set Damage
    if (spellData.damage != 0) {
      
        // Add dommage to player
        if (player.life - spellData.damage > 0) {
            player.life -= spellData.damage
            socket.emit("takeDamage", JSON.stringify( { playerName : player.name, spellName : spellData.name} ))
            // console.log(player.life)
        } else {
            console.log(player + ": dead !!!")
            player.life = 0
            socket.emit("takeDamage", JSON.stringify( { playerName : player.name, spellName : "dead"} ))
            // console.log(player.life)
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

    let spellDamageData = getSpellInformation("damaged", player) 
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

    lifeDiv.style.width = player.life + "%"
}