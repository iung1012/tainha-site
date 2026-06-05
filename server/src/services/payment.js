const axios = require('axios');

const client = axios.create({
  baseURL: process.env.SYNCPAY_BASE_URL || 'https://api.syncpay.com.br/v1',
  headers: {
    Authorization: `Bearer ${process.env.SYNCPAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Cria cobrança PIX via Syncpay
// Ajuste os campos conforme a documentação real da Syncpay
async function createPixCharge({ amountCents, customer, orderId, expiresInSeconds = 3600 }) {
  if (!process.env.SYNCPAY_API_KEY) {
    console.log('⚠️  SYNCPAY_API_KEY não definida — usando PIX simulado para dev');
    return {
      transactionId: `sim_${Date.now()}`,
      pixCode: '00020126580014br.gov.bcb.pix0136simulado-local-dev-tainha-site5204000053039865802BR5925Tainha do Mar Dev6009SAO PAULO62070503***6304ABCD',
      pixQrUrl: null,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  }

  const { data } = await client.post('/charges', {
    amount: amountCents,
    payment_method: 'pix',
    customer: {
      name: customer.name,
      email: customer.email,
      document: customer.cpf ? customer.cpf.replace(/\D/g, '') : undefined,
      document_type: 'cpf',
    },
    metadata: { order_id: String(orderId) },
    expires_in: expiresInSeconds,
  });

  return {
    transactionId: data.id,
    pixCode: data.pix?.qr_code || data.pix_code,
    pixQrUrl: data.pix?.qr_code_url || data.qr_code_url || null,
    expiresAt: data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + expiresInSeconds * 1000),
  };
}

// Consulta status da cobrança
async function getChargeStatus(transactionId) {
  const { data } = await client.get(`/charges/${transactionId}`);
  return data.status; // 'pending', 'paid', 'cancelled', 'expired'
}

module.exports = { createPixCharge, getChargeStatus };
