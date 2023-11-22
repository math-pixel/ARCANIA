// manage life
function lifeManager(player, spellData) {

    //* Set Damage
    if (spellData.damage != 0) {
      
        // Add dommage to player
        if (player.life - spellData.damage > 0) {
            player.life -= spellData.damage
            // console.log(player.life)
        } else {
            console.log(player + ": dead !!!")
            player.life = 0
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
    if (player == player1 && state == "shot") {
        lifeDiv = document.getElementById("infoLife2")
    } else if (player == player1 && state == "heal") {
        lifeDiv = document.getElementById("infoLife1")
    } else if (player == player2 && state == "shot") {
        lifeDiv = document.getElementById("infoLife1")
    } else {
        lifeDiv = document.getElementById("infoLife2")
    }

    lifeDiv.style.width = player.life + "%"
}