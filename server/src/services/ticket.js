const crypto = require('crypto');
const QRCode = require('qrcode');

function generateTicketCode() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

async function generateQrCodeBase64(ticketCode) {
  return QRCode.toDataURL(`TAINHA-${ticketCode}`, {
    width: 256,
    margin: 2,
    color: { dark: '#023E8A', light: '#FFFFFF' },
  });
}

module.exports = { generateTicketCode, generateQrCodeBase64 };
