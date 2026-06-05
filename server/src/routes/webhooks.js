const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');
const { generateTicketCode } = require('../services/ticket');
const { sendTicketEmail } = require('../services/email');

const router = express.Router();

// Sincpay envia o webhook com assinatura no header
function verifySignature(payload, signature) {
  if (!process.env.SYNCPAY_WEBHOOK_SECRET) return true; // skip em dev
  const expected = crypto
    .createHmac('sha256', process.env.SYNCPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
}

router.post('/syncpay', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['x-syncpay-signature'] || req.headers['x-webhook-signature'];
  if (!verifySignature(req.body, sig)) {
    return res.status(400).json({ error: 'Assinatura inválida' });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: 'Payload inválido' });
  }

  // Syncpay pode enviar diferentes formatos — adapte conforme a documentação real
  const eventType = event.event || event.type;
  const transactionId = event.data?.id || event.transaction_id || event.charge_id;
  const orderId = event.data?.metadata?.order_id || event.metadata?.order_id;

  if (eventType === 'payment.paid' || eventType === 'charge.paid') {
    await handlePaymentPaid(transactionId, orderId);
  }

  res.json({ received: true });
});

async function handlePaymentPaid(transactionId, orderId) {
  const client = await pool.connect();
  try {
    let orderQuery;
    if (orderId) {
      orderQuery = await client.query("SELECT * FROM orders WHERE id=$1 AND status='pending'", [orderId]);
    } else if (transactionId) {
      orderQuery = await client.query("SELECT * FROM orders WHERE syncpay_transaction_id=$1 AND status='pending'", [transactionId]);
    }

    if (!orderQuery?.rows.length) return;
    const order = orderQuery.rows[0];

    await client.query('BEGIN');
    await client.query("UPDATE orders SET status='paid', paid_at=NOW() WHERE id=$1", [order.id]);

    // Gerar ingressos
    const { rows: items } = await client.query('SELECT * FROM order_items WHERE order_id=$1', [order.id]);
    const tickets = [];

    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        const code = generateTicketCode();
        const { rows: [ticket] } = await client.query(
          'INSERT INTO tickets (order_id, order_item_id, ticket_code) VALUES ($1,$2,$3) RETURNING *',
          [order.id, item.id, code]
        );
        tickets.push(ticket);
      }
    }

    await client.query('COMMIT');

    // Enviar email com ingressos
    sendTicketEmail({ order, items, tickets }).catch(console.error);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro no webhook handlePaymentPaid:', err);
  } finally {
    client.release();
  }
}

module.exports = router;
