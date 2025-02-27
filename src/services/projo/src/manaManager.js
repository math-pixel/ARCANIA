let manaWins = 20

//* ##### Manamanager #####
function manaManager(player, state) {
    if (state == "gain") {
        if (player.mana + manaWins < 100) {
            player.mana += manaWins
        } else {
            player.mana = 100
        }
    } else if(state == "reset") {
        player.mana = 0
    }

    updateManaVisual(player)
}

function updateManaVisual(player) {
    // console.log(player)
    let manaDiv;
    if (player.name == "player1") {
        manaDiv = document.getElementById("infoMana1")
    } else {
        manaDiv = document.getElementById("infoMana2")
    }

    //? 15 and 10 is the minimum percent of visual tricks  
    manaDiv.style.clipPath  = `polygon(0px 0px, ${player.mana + 15}% 0%, ${player.mana + 10}% 100%, 0% 100%)`
}