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
     ('Prato de Tainha Grelhada', 'Tainha fresca grelhada na brasa com arroz, farofa e salada.', 8900, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', -1),
     ('Prato de Tainha Frita', 'Tainha dourada frita com chips de mandioca e molho tártaro artesanal.', 8500, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', -1),
     ('Combo Família (2 pratos)', 'Dois pratos à escolha com dose de caipirinha da casa.', 16000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', -1)`,
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
