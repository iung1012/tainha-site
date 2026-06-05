const express = require('express');
const { pool } = require('../db');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(adminMiddleware);

// Dashboard stats
router.get('/stats', async (req, res) => {
  const [total, paid, pending, revenue] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM orders'),
    pool.query("SELECT COUNT(*) FROM orders WHERE status='paid'"),
    pool.query("SELECT COUNT(*) FROM orders WHERE status='pending'"),
    pool.query("SELECT COALESCE(SUM(total),0) AS revenue FROM orders WHERE status='paid'"),
  ]);
  res.json({
    total_orders: parseInt(total.rows[0].count),
    paid_orders: parseInt(paid.rows[0].count),
    pending_orders: parseInt(pending.rows[0].count),
    total_revenue: parseInt(revenue.rows[0].revenue),
  });
});

// Listar todos os pedidos
router.get('/orders', async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let orderRows;
  if (status) {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE status=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    orderRows = rows;
  } else {
    const { rows } = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    orderRows = rows;
  }

  const result = await Promise.all(
    orderRows.map(async (o) => {
      const { rows: items } = await pool.query(
        'SELECT product_name AS name, quantity AS qty, unit_price AS price FROM order_items WHERE order_id=$1',
        [o.id]
      );
      return { ...o, items };
    })
  );
  res.json(result);
});

// Detalhe do pedido
router.get('/orders/:id', async (req, res) => {
  const [order, items, tickets] = await Promise.all([
    pool.query('SELECT * FROM orders WHERE id=$1', [req.params.id]),
    pool.query('SELECT * FROM order_items WHERE order_id=$1', [req.params.id]),
    pool.query('SELECT * FROM tickets WHERE order_id=$1', [req.params.id]),
  ]);
  if (!order.rows.length) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json({ ...order.rows[0], items: items.rows, tickets: tickets.rows });
});

// Atualizar status do pedido manualmente
router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'paid', 'cancelled', 'expired'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Status inválido' });
  const { rows } = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(rows[0]);
});

// Validar ingresso (scan QR code)
router.post('/tickets/validate', async (req, res) => {
  const { ticket_code } = req.body;
  if (!ticket_code) return res.status(400).json({ error: 'ticket_code obrigatório' });

  const code = ticket_code.replace(/^TAINHA-/, '');
  const { rows } = await pool.query(
    `SELECT t.*, o.customer_name, o.customer_email, oi.product_name, oi.quantity
     FROM tickets t
     JOIN orders o ON o.id=t.order_id
     JOIN order_items oi ON oi.id=t.order_item_id
     WHERE t.ticket_code=$1`,
    [code]
  );

  if (!rows.length) return res.status(404).json({ error: 'Ingresso não encontrado' });
  const ticket = rows[0];

  if (ticket.validated) {
    return res.status(409).json({ error: 'Ingresso já utilizado', validated_at: ticket.validated_at });
  }

  await pool.query('UPDATE tickets SET validated=TRUE, validated_at=NOW() WHERE id=$1', [ticket.id]);
  res.json({ success: true, customer_name: ticket.customer_name, product_name: ticket.product_name });
});

module.exports = router;
