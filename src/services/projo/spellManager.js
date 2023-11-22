async function preloadSpells(){
    const data = await fetch('/json/spells.json')
    .then((response) => response.json())
    .then((json) => {
        spellJson = json["spells"]
        return spellJson
    })
    .catch((error) => {
        console.error('Error preloading spells:', error);
    });

    spells = data;
    console.log('Variable globale définie :', spells);
}

//* ##### Find information of spell in JSON #####
function getSpellInformation(name) {
    // console.log(spells)
    for (const spell of spells) {
        if (spell.name == name) {
            return spell
        }
    }
    console.log("error while get spell information of : ", name)
    return null
}

  
  function displaySpell(spellData, player) {

    createAudioElement(spellData)

    /* -------------------------------------------------------------------------- */
    /*                                Game Manager                                */
    /* -------------------------------------------------------------------------- */
    //TODO set it on another file ' gameManager.js '

    //* Set up video add-on information
    // check if its a loading video
    if (spellData.name.includes("loading")) {
        if (player.loading == null) {
            console.log(player.loading)
            createVideoElement(player, spellData, loop = true, isLoadingSpell = true)
            
        }
    }else if(!spellData.name.includes("loading")){
        //? normal spell
        createVideoElement(player, spellData, loop = false, isLoadingSpell = false)



    }
    
}


/* -------------------------------------------------------------------------- */
/*                            Create Video ELEMENT                            */
/* -------------------------------------------------------------------------- */
/**
 * 
 * @param {Object} player 
 * @param {String} spellData 
 * @param {Bool} loop loop video
 * @param {Bool} isLoadingSpell is loading spell of a player
 */
function createVideoElement(player, spellData, loop = false, isLoadingSpell = false){
    //* ##### Create Video ELEMENT #####
    let video = document.createElement('video')
    video.src = spellData.videoSrc
    video.autoplay = true
    video.type = "video/webp"
    video.preload = "auto"
    video.loop = loop


    //* if is a loadind spell
    if (isLoadingSpell == true) {
        player.loading = video
    }else{
        //* remove element loading video
        if (player.loading != null) {
            removeLoadingElement(player)
        }

        //* event end => remove spell video
        video.addEventListener("ended", () => {
            video.parentNode.removeChild(video);

            if (spellData.name != "damaged") {
                //* update life
                lifeManager(player, spellData)
                //* ##### Update mana bar #####
                manaManager(player, "gain")
            }

        })
    }


    //* ##### Detect witch player catch the spell #####
    if (player.name == "player2") {
        // reverse video
        video.style.transform = "rotate(180deg)"
    }


    parentVideo.appendChild(video)
}

function removeLoadingElement(player) {
    player.loading.parentNode.removeChild(player.loading);
    player.loading = null
}


/* -------------------------------------------------------------------------- */
/*                            Create Audio ELement                            */
/* -------------------------------------------------------------------------- */

function createAudioElement(spellData){
    //* ##### Create Audio ELEMENT #####
    let audio = document.createElement('audio')
    audio.src = spellData.audioSrc
    audio.preload = "auto"
    audio.autoplay = true

    //* ##### Catch Spell Video / Audio #####
    audio.addEventListener("ended", () => {
        audio.parentNode.removeChild(audio);
    })


    parentAudio.appendChild(audio)
}