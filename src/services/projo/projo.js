document.getElementById("introButton").addEventListener("click", () => {
    startVideo()
  })
  
  function startVideo() {
    let introDiv = document.getElementById("intro")
    introDiv.parentNode.removeChild(introDiv);
    let videoIntro = document.getElementById("vidIntro")
    console.log(videoIntro)
    videoIntro.play()
    setTimeout(() => {
      videoIntro.parentNode.removeChild(videoIntro);
    }, 30000)
  }
  
  let spells = []; // Declare the variable to hold the preloaded data
  
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
  
  // Call the preloadSpells function when your application loads
  window.onload = preloadSpells;
  const socket = io();
  
  
  let player1 = {
    "name": "player1",
    "life": 100,
    "mana": 0
  }
  
  let player2 = {
    "name": "player2",
    "life": 100,
    "mana": 0
  }
  
  let parentVideo = document.getElementById("videoDiv")
  let parentAudio = document.getElementById("audioDiv")
  
  function displaySpell(source, player) {
    let audio = document.createElement('audio')
    audio.src = source.audioSrc
    audio.preload = "auto"
    audio.autoplay = true


    let video = document.createElement('video')
    video.src = source.videoSrc
    video.muted = true
    // video.width = 1980; // in px
    // video.height = 1080; // in px
    video.autoplay = true
    video.type = "video/webp"
    video.preload = "auto"
    video.style.position = "absolute"
    if (player == player2) {
      video.style.scale = "-1"
    }
    video.addEventListener("ended", function() {
      video.parentNode.removeChild(video);
      life(player, source)
    })
    audio.addEventListener("ended", function() {
        audio.parentNode.removeChild(audio);
    })
    parentAudio.appendChild(audio)
    parentVideo.appendChild(video)
  }
  
  function detectSpell(name, player) {
    for (const spell of spells) {
      if (spell.name == name) {
        displaySpell(spell, player)
      }
    }
    return null
  }
  
  function life(player, lifeValue) {
    if (lifeValue["damage"] != 0) {
      if (player["life"] - lifeValue["damage"] > 0) {
        player["life"] -= lifeValue["damage"]
        console.log(player["life"])
        updateLife(player, "shot")
      } else {
        console.log(player + ": dead !!!")
        player["life"] = 0
        console.log(player["life"])
        updateLife(player, "shot")
      }
    } else {
      if (player["life"] + lifeValue["heal"] > 100) {
        player["life"] = 100
        console.log(player["life"])
        updateLife(player, "heal")
      } else {
        player["life"] += lifeValue["heal"]
        console.log(player["life"])
        updateLife(player, "heal")
      }
    }
  }
  
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
  
  function mana(player, state) {
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
  }
  
    socket.on("circle", (player) => {
      if (player == "player1") {
        detectSpell("circle", player1)
      } else {
        detectSpell("circle", player2)
      }
      
    })
    
    socket.on("line", (player) => {
      if (player == "player1") {
        detectSpell("line", player1)
      } else {
        detectSpell("line", player2)
      }
    })