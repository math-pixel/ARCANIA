
/* -------------------------------------------------------------------------- */
/*                        Change Visuelle Of Experience                       */
/* -------------------------------------------------------------------------- */

//? Waiting connection
let pagewaitingConnection = document.getElementById("waiting_connection_container")
// let videoIntroThunder = document.getElementById("videoIntro")

//? Rules
let pageRules = document.getElementById("containerRules")

//? training
let pageTraining = document.getElementById("training_container")

//? In game
let gui = document.getElementById("playerInfo")
let videoBackgroundGame = document.getElementById("backgroundBattle")
let fightPositionIndication = document.getElementById("fightPositionIndication")

//? video winner 
let videoWinner = document.getElementById("endGameVideo")

//? dataViz
let datavizPage = document.getElementById("datavizDiv")

/* -------------------------------------------------------------------------- */
/*                         Update State of Experience                         */
/* -------------------------------------------------------------------------- */

function updateStateExperience(state){
  // console.log(stateOfGame)
  switch(stateOfGame){
    case "Init":
      //? waiting connection of the two remote

      /* ------------------------ Background versus qrCode ------------------------ */
      let videoVersus = document.getElementById("videoVersus")
      videoVersus.loop = true
      videoVersus.play()
      
      /* -------------------- Play video Intro arcania thunder -------------------- */
      let videoIntro = document.getElementById("videoIntro")
      videoIntro.play()

      /* --------------------- wait 10 sec and add crowd sound -------------------- */
      setTimeout(() => {
        createAudioElement({audioSrc : "../medias/audio_ambiant/crowd_loop.mp3"}, true, 0.4)
      }, 200)

      /* ------------------------ When video thunder is end ----------------------- */
      videoIntro.addEventListener("ended", () => {
        // remove video intro thunder
        videoIntro.parentNode.removeChild(videoIntro)

      })
    
      break;
    case "Rules":
      //? display rules video
      // document.getElementById("containerRules").display = "block"
      // //* remove div of waiting player
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("videoIntro").pause()


      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "block"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"



      /* ---------------------------- play rules video ---------------------------- */
      playRulesVideo()
      break;
    case "TrainingPlayer":
      //? training part

      /* ----------------------------- training video ----------------------------- */
      let trainingVideo = document.getElementById("training_vid")
      trainingVideo.loop = true
      trainingVideo.play()

      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = "flex" //TODO display block
      // document.getElementById("videoIntro").pause()

      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "block"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"


      startTraining()
      // videoIntro.parentNode.removeChild(videoIntro);
      break;
    case "BeforeGame":

      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"
      fightPositionIndication.style.display = "block"
      

      /* ------------------------- Play video preparation ------------------------- */
      fightPositionIndication.play()
      /* ------------------ event when position indication is end ----------------- */
      fightPositionIndication.addEventListener("ended", () => {
        fightPositionIndication.style.display = "none"
        startGame()
      }) 

      break
    case "InGame":
      // document.getElementById("videoIntro").pause()
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'
      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "flex"
      videoBackgroundGame.style.display = "block"
      videoWinner.style.display = "none"
      datavizPage.style.display = "none"

      /* -------------------------- play background video ------------------------- */
      document.getElementById("backgroundBattle").play()
      

      break;
    case "End":
      //? end game

      // document.getElementById("videoIntro").pause()

      // document.getElementById("timerContainer").style.display = "none"
      // document.getElementById("videoDiv").style.display = "none"
      // document.getElementById("audioDiv").style.display = "none"
      // document.getElementById("playerInfo").style.display = "none"

      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'


      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "block"
      datavizPage.style.display = "none"
      // parentVideo.style.display = "none"


      break;
    case "dataviz":
      //? end screen

      // reset phone overlay
      websocketValidation("player1", "resetOverlay")
      websocketValidation("player2", "resetOverlay")

      // document.getElementById("videoIntro").pause()
      
      // document.getElementById("timerContainer").style.display = "none"
      // document.getElementById("videoDiv").style.display = "none"
      // document.getElementById("audioDiv").style.display = "none"
      // document.getElementById("playerInfo").style.display = "none"
      // document.getElementById("backgroundBattle").style.display = "none"
      // document.getElementById("waiting_connection_container").style.display = "none";
      // document.getElementById("rulesVideo").style.display = "none"
      // document.getElementById("training_container").style.display = 'none'

      pagewaitingConnection.style.display = "none"
      pageRules.style.display = "none"
      pageTraining.style.display = "none"
      gui.style.display = "none"
      videoBackgroundGame.style.display = "none"
      videoWinner.style.display = "none"
      datavizPage.style.display = "block"

      updateData(winner)
      break;
  }
}