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
       ('Tainha Grelhada', 'Tainha fresca do litoral gaúcho grelhada na brasa. Inclui 2 pães artesanais, alface fresca e tomate.', 8000, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=85', -1),
       ('Salmão Assado', 'Peixe nobre assado no forno com acompanhamentos especiais da casa. Opção premium da festa.', 20000, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=85', -1),
       ('Posta de Tainha', 'Posta generosa de 450g da tainha do litoral gaúcho, grelhada na brasa com tempero artesanal.', 3500, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=85', -1)`,
      []
    );
    console.log('✅ Produtos de exemplo criados');
  }

  await pool.end();
  console.log('✅ Seed concluído!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
