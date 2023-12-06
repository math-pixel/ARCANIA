/* -------------------------------------------------------------------------- */
/*                               Init variables                               */
/* -------------------------------------------------------------------------- */

let winnerPlayer1 = document.getElementById("winnerPlayer1");
let namePlayer1 = document.getElementById("namePlayer1");
let manaCounter1 = document.getElementById("manaCounter1");
let damageCounter1 = document.getElementById("damageCounter1");
let fireCounter1 = document.getElementById("fireCounter1");
let waterCounter1 = document.getElementById("waterCounter1");
let natureCounter1 = document.getElementById("natureCounter1");
let ultimeCounter1 = document.getElementById("ultimeCounter1");

let winnerPlayer2 = document.getElementById("winnerPlayer2");
let namePlayer2 = document.getElementById("namePlayer2");
let manaCounter2 = document.getElementById("manaCounter2");
let damageCounter2 = document.getElementById("damageCounter2");
let fireCounter2 = document.getElementById("fireCounter2");
let waterCounter2 = document.getElementById("waterCounter2");
let natureCounter2 = document.getElementById("natureCounter2");
let ultimeCounter2 = document.getElementById("ultimeCounter2");

let fireDiv1 = document.getElementById("fire1")
let fireDiv2 = document.getElementById("fire2")
let waterDiv1 = document.getElementById("water1")
let waterDiv2 = document.getElementById("water2")
let natureDiv1 = document.getElementById("nature1")
let natureDiv2 = document.getElementById("nature2")

function updateData(winner) {
  if (winner == "player1") {
    winnerPlayer1.innerText = "WINNER"
    winnerPlayer2.innerText = "LOOSER"
  } else {
    winnerPlayer2.innerText = "WINNER"
    winnerPlayer1.innerText = "LOOSER"
  }
  namePlayer1.innerText = playerName1
  namePlayer2.innerText = playerName2
  manaCounter1.innerText = playersStat["player1"].manaTotal
  manaCounter2.innerText = playersStat["player2"].manaTotal
  damageCounter1.innerText = playersStat["player1"].degatTotal
  damageCounter2.innerText = playersStat["player2"].degatTotal
  fireCounter1.innerText = playersStat["player1"].fireSpell
  fireCounter2.innerText = playersStat["player2"].fireSpell
  waterCounter1.innerText = playersStat["player1"].waterSpell
  waterCounter2.innerText = playersStat["player2"].waterSpell
  natureCounter1.innerText = playersStat["player1"].natureSpell
  natureCounter2.innerText = playersStat["player2"].natureSpell
  ultimeCounter1.innerText = playersStat["player1"].ultimeSpell
  ultimeCounter2.innerText = playersStat["player2"].ultimeSpell


  
  let percentages = {};

  // Liste des types de sorts
  const spellTypes = ['fireSpell', 'waterSpell', 'natureSpell'];

  // Calcul du pourcentage pour chaque type de sort
  spellTypes.forEach(spell => {
    let percentage = (playersStat.player1[spell] / playersStat.player1.sortTotal) * 100;
    percentages[spell] = percentage.toFixed(2); // Arrondir à 2 décimales
  });

  console.log(percentages)

  fireDiv1.style.clipPath = "polygon("+ (90- percentages["fireSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["fireSpell"]) +"% 100%)"
  waterDiv1.style.clipPath = "polygon("+ (90- percentages["waterSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["waterSpell"]) +"% 100%)"
  natureDiv1.style.clipPath = "polygon("+ (90- percentages["natureSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["natureSpell"]) +"% 100%)"

  spellTypes.forEach(spell => {
    let percentage = (playersStat.player2[spell] / playersStat.player2.sortTotal) * 100;
    percentages[spell] = percentage.toFixed(2); // Arrondir à 2 décimales
  });

  console.log(percentages)

  fireDiv2.style.clipPath = "polygon("+ (90- percentages["fireSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["fireSpell"]) +"% 100%)"
  waterDiv2.style.clipPath = "polygon("+ (90- percentages["waterSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["waterSpell"]) +"% 100%)"
  natureDiv2.style.clipPath = "polygon("+ (90- percentages["natureSpell"]) +"% 0px, 100% 0%, 100% 100%, "+ (100- percentages["natureSpell"]) +"% 100%)"
}