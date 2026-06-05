const express = require('express');
const { pool } = require('../db');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE active=TRUE ORDER BY id');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE id=$1 AND active=TRUE', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(rows[0]);
});

// Admin: listar todos
router.get('/admin/all', adminMiddleware, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
  res.json(rows);
});

// Admin: criar produto
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name e price obrigatórios' });
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, image_url, stock) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description || null, price, image_url || null, stock ?? -1]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Admin: atualizar produto
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image_url, stock, active } = req.body;
    const { rows } = await pool.query(
      `UPDATE products SET
        name=COALESCE($1,name),
        description=COALESCE($2,description),
        price=COALESCE($3,price),
        image_url=COALESCE($4,image_url),
        stock=COALESCE($5,stock),
        active=COALESCE($6,active)
       WHERE id=$7 RETURNING *`,
      [name, description, price, image_url, stock, active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
