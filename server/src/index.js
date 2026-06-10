require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' } });

app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));

// Webhook precisa do body raw antes do json parser
app.use('/api/webhooks', require('./routes/webhooks'));

app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Servir o frontend em produção
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(distPath));
  app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')));
}

async function seedDev() {
  if (process.env.DATABASE_URL) return; // só em modo local
  const bcrypt = require('bcrypt');
  const { pool } = require('./db');

  const existing = await pool.query('SELECT id FROM users LIMIT 1');
  if (existing.rows.length) return;

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'admin')",
    [process.env.ADMIN_NAME || 'Admin', process.env.ADMIN_EMAIL || 'admin@tainha.dev', hash]
  );
  await pool.query(
    `INSERT INTO products (name, description, price, image_url, stock) VALUES
     ('Tainha Grelhada', 'Tainha fresca do litoral gaúcho grelhada na brasa. Inclui 2 pães artesanais, alface fresca e tomate.', 8000, '/images/hero.png', -1),
     ('Salmão Assado', 'Peixe nobre assado no forno com acompanhamentos especiais da casa. Opção premium da festa.', 20000, '/images/brasa.png', -1),
     ('Posta de Tainha', 'Posta generosa de 450g da tainha do litoral gaúcho, grelhada na brasa com tempero artesanal.', 3500, '/images/prato.png', -1)`,
    []
  );
  console.log(`✅ Seed local: admin ${process.env.ADMIN_EMAIL || 'admin@tainha.dev'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
}

async function start() {
  await initDB();
  await seedDev();
  app.listen(PORT, () => console.log(`🐟 Servidor rodando na porta ${PORT}`));
}

start().catch((err) => { console.error('Erro ao iniciar servidor:', err); process.exit(1); });
