require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const { pool, initDB } = require('../src/db');

async function seed() {
  await initDB();

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@tainhadomar.com.br';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrador';

  const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (!existing.rows.length) {
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'admin')",
      [name, email, hash]
    );
    console.log(`✅ Admin criado: ${email} / ${password}`);
  } else {
    console.log(`ℹ️  Admin já existe: ${email}`);
  }

  // Produto de exemplo
  const prod = await pool.query('SELECT id FROM products LIMIT 1');
  if (!prod.rows.length) {
    await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock) VALUES
       ('Prato de Tainha Grelhada', 'Tainha fresca grelhada na brasa com acompanhamentos da casa: arroz, farofa, salada e molho especial.', 8900, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', -1),
       ('Prato de Tainha Frita', 'Tainha dourada frita com chips de mandioca, salada fresca e molho tártaro artesanal.', 8500, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', -1),
       ('Combo Família (2 pratos)', 'Dois pratos à escolha (grelhado ou frito) com dose de caipirinha da casa.', 16000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', -1)`,
      []
    );
    console.log('✅ Produtos de exemplo criados');
  }

  await pool.end();
  console.log('✅ Seed concluído!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
