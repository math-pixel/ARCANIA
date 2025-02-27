
/* -------------------------------------------------------------------------- */
/*                                 Rules Video                                */
/* -------------------------------------------------------------------------- */
function playRulesVideo() {
  
    /* ------------------------------- Play Video ------------------------------- */
    let rulesVideo = document.getElementById("rulesVideo")
    // console.log(rulesVideo)
    rulesVideo.style.display = "block"
    rulesVideo.play()
  
    /* ----------------------------- Event End video ---------------------------- */
    rulesVideo.addEventListener("ended", () => {
      console.log("finish vid")
      rulesVideo.pause()
      rulesVideo.style.display = "none" 
      stateOfGame = "TrainingPlayer"
      updateStateExperience()
    })
  
    // //! for debug comment the line above ( event listener ) and un-comment the line below
    // setTimeout(() => {
  
    //   rulesVideo.pause()
    //   rulesVideo.style.display = "none"
    //     stateOfGame = "TrainingPlayer"
    //     updateStateExperience()
  
    // }, 500)
  
  }
  
  /* ---------------------------- skip rules video ---------------------------- */
  document.getElementById("skipButton").addEventListener("click", () => {
    rulesVideo.pause()
    rulesVideo.style.display = "none" 
    stateOfGame = "TrainingPlayer"
    updateStateExperience()
  })