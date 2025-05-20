// src/utils/qrHandler.js
const qrcode = require('qrcode-terminal');

/**
 * Función para mostrar el código QR en la terminal
 * @param {string} qr - Código QR a mostrar
 */
function displayQR(qr) {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
}

module.exports = {
    displayQR
};
