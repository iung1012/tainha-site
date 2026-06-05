const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { createPixCharge } = require('../services/payment');
const { generateTicketCode } = require('../services/ticket');
const { sendOrderConfirmationEmail } = require('../services/email');

const router = express.Router();

// Criar pedido (guest ou logado)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_name, customer_email, customer_cpf, items, user_id } = req.body;
    if (!customer_name || !customer_email || !items?.length) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Buscar produtos e calcular total (query individual para compatibilidade com pg-mem)
    const products = [];
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT * FROM products WHERE id=$1 AND active=TRUE',
        [Number(item.product_id)]
      );
      if (rows.length) products.push(rows[0]);
    }

    let total = 0;
    const enriched = items.map((item) => {
      const prod = products.find((p) => p.id === item.product_id);
      if (!prod) throw new Error(`Produto ${item.product_id} não encontrado`);
      if (prod.stock !== -1 && prod.stock < item.quantity) throw new Error(`Estoque insuficiente: ${prod.name}`);
      total += prod.price * item.quantity;
      return { ...item, product: prod };
    });

    await client.query('BEGIN');

    // Criar cobrança PIX
    const charge = await createPixCharge({
      amountCents: total,
      customer: { name: customer_name, email: customer_email, cpf: customer_cpf },
      orderId: 0,
    }).catch(() => null);

    // Inserir pedido
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total, syncpay_transaction_id, pix_code, pix_qr_code_url, pix_expires_at, customer_name, customer_email, customer_cpf)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        user_id || null,
        total,
        charge?.transactionId || null,
        charge?.pixCode || 'PIX_SIMULADO_CONFIGURE_SYNCPAY',
        charge?.pixQrUrl || null,
        charge?.expiresAt || new Date(Date.now() + 3600000),
        customer_name,
        customer_email,
        customer_cpf || null,
      ]
    );

    // Inserir itens
    for (const { product, quantity } of enriched) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name) VALUES ($1,$2,$3,$4,$5)',
        [order.id, product.id, quantity, product.price, product.name]
      );
      if (product.stock !== -1) {
        await client.query('UPDATE products SET stock=stock-$1 WHERE id=$2', [quantity, product.id]);
      }
    }

    await client.query('COMMIT');

    // Enviar email de confirmação em background
    sendOrderConfirmationEmail({ order }).catch(console.error);

    res.status(201).json({
      order_id: order.id,
      total: order.total,
      pix_code: order.pix_code,
      pix_qr_code_url: order.pix_qr_code_url,
      expires_at: order.pix_expires_at,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(err.message.includes('não encontrado') || err.message.includes('Estoque') ? 400 : 500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Consultar status do pedido
router.get('/:id/status', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, status, total, customer_name, customer_email, paid_at, pix_expires_at FROM orders WHERE id=$1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(rows[0]);
});

// Pedidos do cliente logado
router.get('/my/orders', authMiddleware, async (req, res) => {
  const { rows: orders } = await pool.query(
    'SELECT * FROM orders WHERE user_id=$1 OR customer_email=$2 ORDER BY created_at DESC',
    [req.user.id, req.user.email]
  );

  const result = await Promise.all(
    orders.map(async (order) => {
      const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [order.id]);
      const { rows: tickets } = await pool.query('SELECT * FROM tickets WHERE order_id=$1', [order.id]);
      return { ...order, items, tickets };
    })
  );

  res.json(result);
});

module.exports = router;
