/* -------------------------------------------------------------------------- */
/*                                   QR Code                                  */
/* -------------------------------------------------------------------------- */
// Function to generate QR code
//Template = generateQRCode("containerID", 'localhost', '3000', parameters='param1=value1&param2=value2');
function generateQRCode(canvasContainerID, url, port, subdirectory = "", parameters = "") {

    /* ------------------------------- Create URL ------------------------------- */
    let qrCodeUrl = "error"
    if (PRODUCTION_MODE == "Production") {
      qrCodeUrl = `https://${url}:${port}/${subdirectory}?${parameters}`;
    }else if(PRODUCTION_MODE == "Development"){
      qrCodeUrl = `http://${url}:${port}/${subdirectory}?${parameters}`;
    }
    console.log(qrCodeUrl)
  
    /* ----------------------------- Generate QrCode ---------------------------- */
    const qrCodeContainer = document.getElementById(canvasContainerID);
  
    /* -------------------- Clear previous QR code if exists -------------------- */
    qrCodeContainer.innerHTML = '';
  
    /* ---------------------------- Generate QR code ---------------------------- */
    new QRCode(qrCodeContainer, {
      text: qrCodeUrl,
      width: 200,
      height: 200
    });
  
  }

function displayQrCode(){
    /* --------------------------- animation qrCode IN -------------------------- */
    document.getElementById("qrCode1").classList.remove("screenOut")
    document.getElementById("qrCode2").classList.remove("screenOut")
}