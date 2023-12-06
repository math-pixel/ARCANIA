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


function updateData(winner) {
  winnerPlayer1.innerText = winner[0]
  winnerPlayer2.innerText = winner[1]
  namePlayer1.innerText = player1.name
  namePlayer2.innerText = player2.name
  
}

// "player1": {
//   fireSpell: 0,
//   waterSpell: 0,
//   natureSpell: 0,
//   ultimeSpell: 0,
//   sortTotal: 0,
//   manaTotal: 0,
//   degatTotal: 0,
// }