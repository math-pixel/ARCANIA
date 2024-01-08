let videoDiv = document.getElementById("game")


displayPage("name")

async function startGame() {
    let playerName = document.getElementById("name").value;

    if (is_iOS()) {
        try {
            const orientationGranted = await request(DeviceOrientationEvent);
            if (!orientationGranted) return;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    lockOrientation()

    sendName(playerName);

    prepareToCollect()

    displayPage("game")

    displayBaguette()
}

function sendName(playerName) {
    socket.emit(`username`, playerName);
}

function displayPage(page) {
    let namePage = document.getElementById("pageChooseName")
    let gamePage = document.getElementById("game")

    switch (page) {
        case "name":
            namePage.style.display = "flex"
            gamePage.style.display = "none"
            break;
        case "game":
            namePage.style.display = "none"
            gamePage.style.display = "flex"
            break;
    
        default:
            break;
    }
}

function displayDammages(spellName) {
    navigator.vibrate([150,0,150]);
    switch (spellName) {
        case "circle":
            displayVideo("/medias/phone_media/Impact_phone_rouge.webm")
            break;
        case "lineH":  
            displayVideo("/medias/phone_media/Impact_phone_bleu.webm")
            break;
        case "lineV":
            displayVideo("/medias/phone_media/Impact_phone_violet.webm")
            break;
    }
}

function displayVideo(src) {
    let video = document.createElement("video")
    video.src = src;
    video.autoplay = true;
    video.addEventListener("ended", () => {
        video.parentNode.removeChild(video)
    })
    videoDiv.appendChild(video)
}


function displayBaguette() {
    let src = ""
    if (player == 'player1') {
        src = "/medias/phone_media/baguette/baguette_rouge.png";
    } else {
        src = "/medias/phone_media/baguette/baguette_bleu.png";
    }

    document.getElementById("baguette").src = src
}


//* ##### Overlay #####

socket.on("validation", (state) => {

    if (state != "resetOverlay") {
        displayOverlay(state)
    }else{
        displayOverlay()
    }
})

function displayOverlay(icon) {
    let overlay = document.getElementById("overlay")
    let iconImg = document.getElementById("icon")
    let win_loose = document.getElementById("win_loose")

     switch (icon) {
        case "check":
            overlay.style.display = 'grid'
            iconImg.src = "/medias/phone_media/icons/check.png"
            break;

        case "loose":
            overlay.style.display = 'grid'
            iconImg.src = "/medias/phone_media/icons/loose.svg"
            win_loose.innerText = 'You loose'
            break;

        case "win":
            overlay.style.display = 'grid'
            iconImg.src = "/medias/phone_media/icons/win.svg"
            win_loose.innerText = 'You win'
            break;
     
        default:
            overlay.style.display = 'none'
            iconImg.src = ""
            win_loose.innerText = ''
            break;
     }
}

function displaySorcer(player) {
    let logo = document.getElementById("logo")
    let sorcer = document.querySelector(".imgSorcier")
    let input = document.getElementById("name")
    let button = document.querySelector(".confirmName")
    let ellipse = document.getElementById("ellipse")
    if (player == "player1") {
        logo.src = "/medias/phone_media/icons/Arcania_rouge.svg"
        sorcer.src = "/medias/phone_media/icons/sorcier_rouge.png"
        input.classList.add("player1input")
        button.classList.add("player1")
        ellipse.src = "/medias/phone_media/ellipses/red_ellipse.png"
    } else {
        logo.src = "/medias/phone_media/icons/Arcania_bleu.svg"
        sorcer.src = "/medias/phone_media/icons/sorcier_bleu.png"
        input.classList.add("player2input")
        button.classList.add("player2")
        ellipse.src = "/medias/phone_media/ellipses/blue_ellipse.png"
    }
}

/* -------------------------------------------------------------------------- */
/*                                 debug mode                                 */
/* -------------------------------------------------------------------------- */
function displayButtons() {
    let buttons = document.getElementById("buttons")
    if (buttons.style.display == "none") {
        buttons.style.display = "block"
    } else {
        buttons.style.display = "none"
    }
}