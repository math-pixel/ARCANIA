/* -------------------------------------------------------------------------- */
/*                               Set up varible                               */
/* -------------------------------------------------------------------------- */

let canSendSpell = true

// ##### ml5 #####
let brain;
let state = 'waiting';
let targetLabel;
let rawData = []; // Stocke les données brutes de l'accéléromètre
let sequenceLength = 15; // La longueur de la séquence pour chaque axe
let collectionInterval; // Pour stocker l'identifiant de l'intervalle de collecte

function lockOrientation() {
    // Check if the screen.orientation property is supported
    if (screen.orientation) {
        // Lock the screen orientation to landscape
        screen.orientation.lock('portrait')
            .then(() => {
                console.log('Orientation locked');
            })
            .catch((err) => {
                console.error('Unable to lock orientation: ', err);
            });
        } else {
            console.warn('Screen orientation API not supported');
        }
} 
  
function setFullscreen(){
    // Check if the Fullscreen API is supported
    if (document.documentElement.requestFullscreen) {
        // Request fullscreen
        document.documentElement.requestFullscreen().then(() => {
            console.log("Fullscreen OK !")
        })
        .catch((err) => {
            console.error('Unable to enter fullscreen mode: ', err);
        });
    
    }else {
        console.warn('Fullscreen API not supported');
    }
}


// ##### Song #####
// let bipSound;
// let lineSong
// let squareSong
// let circleSong
// let triangleSong

// ##### Label #####
let labelAllConfidence = ""


// ##### Average Spell #####
let currentSpell = "nothing"
let arrayAverageSpell = []

/* -------------------------------------------------------------------------- */
/*                         Init/Defined player number                         */
/* -------------------------------------------------------------------------- */
let player = "player";
let indicationPlayerConnection = document.getElementById("playerNumber")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if(urlParams.has('playerNumber')){
    const number = urlParams.get('playerNumber')

    if (number >= 1 && number <= 2) {
        // set player id
        player = `player${number}`;

        // remove indication of player connection
        indicationPlayerConnection.innerHTML = ""
    }else{
        indicationPlayerConnection.innerHTML = "Wrong id Player must be 1 or 2"
    }

}else{
    console.error("there is not 'playerNumber' in URL")
    //TODO fullscreen page for this error
}

/* -------------------------------------------------------------------------- */
/*                               init websocket                               */
/* -------------------------------------------------------------------------- */
const socket = io();

/* ---------------------------- Connection socket --------------------------- */

// Function to extract room ID from the URI
function extractRoomIdFromUri() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('roomId');
}

// Function to handle the connection status
socket.on('connectionStatus', (data) => {
    console.log('Connection status:', data.message);
});

// Function to handle the response from the server
socket.on('slave_connected', (data) => {
    console.log('Server response:', data.message);

    // Extract room ID from the URI
    const roomId = extractRoomIdFromUri();
    console.log("emit room id: ", roomId)
    // Join the room
    socket.emit('joinRoom', roomId);
});

// when connected to the room
socket.on("roomJoined", (roomID) => {
    socket.emit("setupRemoteID", player)
    displaySorcer(player) 
})

// Get current room id : socket.emit("getRoom") 
socket.on("getRoom", (roomID) => {
    console.log(roomID)
})

// Send identification data to the server
socket.emit('identification', 'Slave');

/* -------------------------- socket event Arcania -------------------------- */

//* send name of remote to identify it
socket.on("connect", () => {
    socket.on("damaged", (spell) => {
        displayDammages(spell)
    })
});

socket.on("ROOM_CLOSED", (roomID) => {
    socket.disconnect()
})

/* -------------------------------------------------------------------------- */
/*                                preload Song                                */
/* -------------------------------------------------------------------------- */
function preload() {
    // bipSound = loadSound('../sound/bip.mp3');

    // lineSong = loadSound('../sound/ligne.mp3')
    // squareSong = loadSound('../sound/carrer.mp3')
    // circleSong = loadSound('../sound/cercle.mp3')
    // triangleSong = loadSound('../sound/triangle.mp3')
}

/* -------------------------------------------------------------------------- */
/*                              Setup p5 project                              */
/* -------------------------------------------------------------------------- */
function setup() {
    // Configuration du réseau de neurones
    let inputs = [];
    for (let i = 0; i < sequenceLength; i++) {
        inputs.push('x' + i);
        inputs.push('y' + i);
        inputs.push('z' + i);
        // inputs.push('xOrien' + i);
        // inputs.push('yOrien' + i);
        // inputs.push('zOrien' + i);
    }

    let options = {
        inputs: inputs,
        outputs: 4,
        task: 'classification',
        layers: [
            {
              type: 'dense',
              units: 16,
              activation: 'relu'
            },
            {
              type: 'dense',
              units: 8,
              activation: 'sigmoid'
            },
            {
              type: 'dense',
              activation: 'sigmoid'
            }
          ],
        debug: true
    }

    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: '/model/bestResult/model.json',
        metadata: '/model/bestResult/model_meta.json',
        weights: '/model/bestResult/model.weights.bin',
    };//capteur_orientation/model2_027
    brain.load(modelInfo, brainLoaded);

    // Boutons pour la collecte de données
    // createCollectButton('Start Detection Spell');
}

/* -------------------------------------------------------------------------- */
/*                              Machine Learning                              */
/* -------------------------------------------------------------------------- */
function brainLoaded() {
    console.log('Classification ready!');
}
let maxCountOfSpell = 1
/* -------------------------------------------------------------------------- */
/*           Defined whitch spell is catch and send it in websocket           */
/* -------------------------------------------------------------------------- */
function collectData(x, y, z, xOrientation, yOrientation, zOrientation) {
    // Arrondir les valeurs à deux décimales
    let roundedX = parseFloat(x.toFixed(3));
    let roundedY = parseFloat(y.toFixed(3));
    let roundedZ = parseFloat(z.toFixed(3));
    let roundedXOrientation = parseFloat(xOrientation.toFixed(3));
    let roundedYOrientation = parseFloat(yOrientation.toFixed(3));
    let roundedZOrientation = parseFloat(zOrientation.toFixed(3));

    rawData.push({ x: roundedX, y: roundedY, z: roundedZ , xO : roundedXOrientation, yO : roundedYOrientation, zO : roundedZOrientation });

    if (rawData.length === sequenceLength) {
        let dataObject = {};
        for (let i = 0; i < sequenceLength; i++) {
            dataObject['x' + i] = rawData[i].x;
            dataObject['y' + i] = rawData[i].y;
            dataObject['z' + i] = rawData[i].z;
            // dataObject['xO' + i] = rawData[i].xO;
            // dataObject['y0' + i] = rawData[i].yO;
            // dataObject['z0' + i] = rawData[i].zO;
        }

        // brain.normalizeData();
        brain.classify(dataObject, function(error, results) {
            if (error) {
                console.error(error);
                labelAllConfidence = error.toSring()
                // socket.emit("console", JSON.stringify(error))
            } else {

                // ? set up interface
                labelAllConfidence = "";
                for (let index = 0; index < results.length; index++) {
                    labelAllConfidence += `${results[index].label} : ${results[index].confidence} \n`
                }


                /* -------------------------------------------------------------------------- */
                /*           Create array of finding spell and get the most popular           */
                /* -------------------------------------------------------------------------- */

                let label = results[0].label;
                let confidence = results[0].confidence;
                targetLabel = label;
                if (confidence > 0.07) {
                    // console.log(label, confidence);

                    //* add spell to array
                    //? MAX 5 spells | Average 3 to send it to server
                    if (arrayAverageSpell.length > maxCountOfSpell) {


                        //? create temp array ( because can't pass throught reference )
                        let temp = [...arrayAverageSpell]
                        
                        //* remove first element and add new
                        temp.shift()
                        temp.push(label)


                        arrayAverageSpell = [...temp]

                        
                    }else{
                        arrayAverageSpell.push(label)
                    }

                    currentSpell = getAverageSpell(arrayAverageSpell)

                    if (canSendSpell) {
                        socket.emit("console", currentSpell)
                    }
                    if (currentSpell.biggestSpell != "nothing") {

                        if (canSendSpell == true) {
                            sendSpellInWebsocket(currentSpell.biggestSpell)
                            delaySendSpell()
                        }
                    }

                    if (currentSpell.chargingSpell != "nothing") {

                        if (canSendSpell == true) {
                            sendSpellInWebsocket(currentSpell.chargingSpell + "_loading")
                        }
                    }
                    
                }
                
            }
        });

        rawData = []; // Réinitialiser pour la prochaine séquence
    }
}

function delaySendSpell(){

    canSendSpell = false
    setTimeout(() => {
        resetSpellArray()
        canSendSpell = true
    }, 3000)
}

/* -------------------------------------------------------------------------- */
/*         Get an array and return the biggest and second most average        */
/* -------------------------------------------------------------------------- */
let biggest = ["nothing", maxCountOfSpell]
let second = ["nothing", 0]
function getAverageSpell(array){

    let uniqueElements = [...new Set(array)];

    const elementCounts = uniqueElements.map(value => [value, array.filter(str => str === value).length]);

    //? example

    elementCounts.forEach(element => {
    // document.getElementById("debug").innerHTML = elementCounts

        //? get biggest element
        if (element[1] > maxCountOfSpell && element[0] !== biggest[0]) {

            biggest = element

        }else if (second[0] !== "nothing" && element[1] > second[1] ){
            //? get the charging form
            second = element

        }else{
            //? add "nothing" spell
            second = element
        }


    });
    
    // document.getElementById("debug").innerHTML = JSON.stringify({ "1: " : biggest[0], "2:" : second[0] }) + elementCounts
    return { "biggestSpell" : biggest[0], "chargingSpell" : second[0] }
}

/* -------------------------------------------------------------------------- */
/*                        Send spell Form in Websocket                        */
/* -------------------------------------------------------------------------- */
function sendSpellInWebsocket(label){
    // socket.emit("console", label)

    switch(label){
        case "triangle":
            // triangleSong.play()
            break;
        case "square":
            // squareSong.play()
            break;
        case "circle":
            // circleSong.play()
            socket.emit(player, "circle")
            break;
        case "circle_loading":
            socket.emit(player, "circle_loading")    
            break;
        case "hline":
            // lineSong.play()
            socket.emit(player, "lineH")
            break;
        case "hline_loading":
            socket.emit(player, 'lineH_loading')
            break;
        case "vline":
            socket.emit(player, 'lineV')
            break;
        case "vline_loading":
            socket.emit(player, 'lineV_loading')
            break;
    }
}

function resetSpellArray(){
    arrayAverageSpell = ["nothing","nothing","nothing","nothing"]
    biggest = ["nothing", maxCountOfSpell]
    second = ["nothing", 0]
}

// create start button
//TODO test with iphone for authorization
function createCollectButton(buttonText) {
    let button = createButton(buttonText);
    button.position(20, 60);
    button.mousePressed(() => {
        prepareToCollect();
    });
}


/* -------------------------------------------------------------------------- */
/*                                Ml5 Function                                */
/* -------------------------------------------------------------------------- */
function prepareToCollect() {
    if (state === 'waiting') {
        state = 'preparing';
        setTimeout(() => startCollecting(), 1500);
    }
}

function startCollecting() {
    if (state === 'preparing') {
        // bipSound.play();
        state = 'collecting';
        collectionInterval = setInterval(() => {
            if (window.DeviceMotionEvent && window.latestDeviceMotionEvent && latestDeviceOrientationEvent) {
                let event = window.latestDeviceMotionEvent;
                let eventOrientation = latestDeviceOrientationEvent
                if (is_iOS()) {
                    collectData(
                        event.accelerationIncludingGravity.x * -1,
                        event.accelerationIncludingGravity.y * -1,
                        event.accelerationIncludingGravity.z * -1,
                        eventOrientation.x * -1,
                        eventOrientation.y * -1,
                        eventOrientation.z * -1
                    );
                }else{
                    collectData(
                        event.accelerationIncludingGravity.x,
                        event.accelerationIncludingGravity.y,
                        event.accelerationIncludingGravity.z,
                        eventOrientation.x,
                        eventOrientation.y,
                        eventOrientation.z
                    );
                }
            }
        }, 100);
    }
}

/* -------------------------------------------------------------------------- */
/*      Get Device Orientation ( Gyroscope ) and Motion ( Accelerometer )     */
/* -------------------------------------------------------------------------- */
//? merge all information with 'startCollecting' Function in ml5 part 

window.addEventListener("deviceorientation", (event) => {
    latestDeviceOrientationEvent = {
        x : event.alpha,
        y : event.beta,
        z : event.gamma
    }
  });

  // Gestionnaire d'événements pour l'accéléromètre
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        window.latestDeviceMotionEvent = event;
    });
}

/* -------------------------------------------------------------------------- */
/*                             Draw Function p5js                             */
/* -------------------------------------------------------------------------- */

// function draw() {
//     background(255);
//     fill(0);
//     textSize(24);
//     textAlign(LEFT, TOP);
//     text('Collecte: ' + state, 50, 50);
//     text('Label: ' + labelAllConfidence, 50, 70);
// }

/* -------------------------------------------------------------------------- */
/*                           IOS REQUEST PERMISSION                           */
/* -------------------------------------------------------------------------- */

function is_iOS() {
    return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

async function request(eventConstructor) {
    const type = eventConstructor.name;
    if (typeof eventConstructor.requestPermission === "function") {
        const permissionState = await eventConstructor.requestPermission();
        if (permissionState === "granted") {
            return true;
        } else {
            errorElement.innerHTML = `${type} permission denied`;
            reject(new Error(`${type} permission denied`));
            return false;
        }
    } else {
        reject(new Error(`${type}.requestPermission is not a function`));
        return false;
    }
}