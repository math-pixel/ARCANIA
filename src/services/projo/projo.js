
/* -------------------------------------------------------------------------- */
/*                                Init Variable                               */
/* -------------------------------------------------------------------------- */



//* ##### Spells #####
//? Load Json spell information when your application loads
window.onload = preloadSpells;
let spells = []; // Declare the variable to hold the preloaded data

// ##### Init websocket #####
const socket = io();

// ##### Init Player #####
let player1 = {
  name: "player1",
  life: 100,
  mana: 0,
  loading: false
}

let player2 = {
  name: "player2",
  life: 100,
  mana: 0,
  loading: false
}

let player1Loading;
let player2Loading;

/* -------------------------------------------------------------------------- */
/*                          Init interaction with DOM                         */
/* -------------------------------------------------------------------------- */
document.getElementById("introButton").addEventListener("click", () => {
  playRulesVideo()
})

let parentVideo = document.getElementById("videoDiv")
let parentAudio = document.getElementById("audioDiv")


function playRulesVideo() {
  let introDiv = document.getElementById("intro")
  introDiv.parentNode.removeChild(introDiv);
  let videoIntro = document.getElementById("vidIntro")
  console.log(videoIntro)
  videoIntro.play()
  setTimeout(() => {
    videoIntro.parentNode.removeChild(videoIntro);
  }, 2000)
}


/* -------------------------------------------------------------------------- */
/*                                 Spell Part                                 */
/* -------------------------------------------------------------------------- */
function preloadSpells() {
  fetch('/json/spells.json')
    .then((response) => response.json())
    .then((json) => {
      spells = json["spells"]; // Assign the JSON data to the spells variable
      // You can perform additional actions here if needed
    })
    .catch((error) => {
      console.error('Error preloading spells:', error);
    });
}

//* Catch Spell
function displaySpell(source, player) {

  //* ##### Audio PART #####
  let audio = document.createElement('audio')
  audio.src = source.audioSrc
  audio.preload = "auto"
  audio.autoplay = true


  //* ##### Video PART #####
  let video = document.createElement('video')
  video.src = source.videoSrc
  video.autoplay = true
  video.type = "video/webp"
  video.preload = "auto"

  //* ##### Detect witch player catch the spell #####
  if (player.name == "player2") {
      video.style.transform = "rotate(180deg)"
  }

  // Detect Loading Spell
  if (!source.name.includes("loading")) {
    
      //* ##### Check spell loading #####
      if (player1Loading || player2Loading) {
        loadingCheck(player)
      }

      //* ##### Update mana bar #####
      manaManager(player, "gain")
      player["loading"] = false
      video.addEventListener("ended", function() {
          video.parentNode.removeChild(video);
          lifeManager(player, source)
      })
  } else {
      video.loop = true
      player["loading"] = true
      if (player.name == "player1") {
        player1Loading = video
      } else {
        player2Loading = video
      }
  }

  //* ##### Catch Spell Video / Audio #####
  audio.addEventListener("ended", function() {
      audio.parentNode.removeChild(audio);
  })
  parentAudio.appendChild(audio)
  parentVideo.appendChild(video)
}

//* ##### Find information of spell in JSON #####
function getSpellInformation(name, player) {
  for (const spell of spells) {
    if (spell.name == name) {
      displaySpell(spell, player)
    }
  }
  return null
}

function loadingCheck(player) {
  if (player.loading == true) {
    if (player.name == "player1") {
      player1Loading.parentNode.removeChild(player1Loading);
      player1Loading = ""
    } else {
      player2Loading.parentNode.removeChild(player2Loading);
      player2Loading = ""
    }
    player.loading = false
  }
}


/* -------------------------------------------------------------------------- */
/*                                  GUI Part                                  */
/* -------------------------------------------------------------------------- */

// manage life
function lifeManager(player, lifeValue) {
  if (lifeValue["damage"] != 0) {
    if (player["life"] - lifeValue["damage"] > 0) {
      player["life"] -= lifeValue["damage"]
      console.log(player["life"])
    } else {
      console.log(player + ": dead !!!")
      player["life"] = 0
      console.log(player["life"])
    }

    updateLife(player, "shot")

  } else {
    if (player["life"] + lifeValue["heal"] > 100) {
      player["life"] = 100
      console.log(player["life"])
    } else {
      player["life"] += lifeValue["heal"]
      console.log(player["life"])
    }

    updateLife(player, "heal")
  }
}

//* ##### Update Visual Life Bar #####
function updateLife(player, state) {
  console.log(player)
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
  lifeDiv.style.width = player["life"] + "%"
}


//* ##### Manamanager #####
function manaManager(player, state) {
  if (state == "gain") {
    if (player["mana"] + 10 < 100) {
      player["mana"] += 10
    } else {
      player["mana"] = 100
      // Launch event for ulti
    }
  } else {
    // Here when ulti is launch
    player["mana"] = 0
  }

  updateMana(player)
}

function updateMana(player) {
  console.log(player)
  let manaDiv;
  if (player.name == "player1") {
      manaDiv = document.getElementById("infoMana1")
  } else {
      manaDiv = document.getElementById("infoMana2")
  }
  manaDiv.style.width = player["mana"] + "%"
}
  

/* -------------------------------------------------------------------------- */
/*                                  Websocket                                 */
/* -------------------------------------------------------------------------- */
socket.on("player1", (spell) => {      
  actionWebsocket(spell, player1)
})
socket.on("player2", (spell) => {
  actionWebsocket(spell, player2)
})

function actionWebsocket(spell, player){
  switch (spell) {
    case "circle_loading":
      getSpellInformation("circle_loading", player)
      break;

    case "lineH_loading":
      getSpellInformation("lineH_loading", player)
      break;
    
    case "lineV_loading":
      getSpellInformation("lineV_loading", player)
      break;

    case "circle":
      getSpellInformation("circle", player)
      break;

    case "lineH":
      getSpellInformation("lineH", player)
      break;

    case "lineV":
      getSpellInformation("lineV", player)
      break;

    default:
      break;
  }
}