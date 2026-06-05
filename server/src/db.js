require('dotenv').config();
const fs = require('fs');
const path = require('path');

let pool;

async function getPool() {
  if (pool) return pool;

  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  } else {
    // Modo local: PostgreSQL em memória (pg-mem)
    console.log('⚠️  DATABASE_URL não definida — usando banco em memória (pg-mem)');
    const { newDb } = require('pg-mem');
    const db = newDb();
    const { Pool } = db.adapters.createPg();
    pool = new Pool();
  }

  return pool;
}

async function initDB() {
  const p = await getPool();
  const schema = fs.readFileSync(
    path.join(__dirname, '../migrations/schema.sql'),
    'utf8'
  );
  await p.query(schema);
  console.log('Database schema initialized');
}

// Proxy que delega para o pool depois que estiver pronto
const poolProxy = new Proxy({}, {
  get(_, prop) {
    return (...args) => getPool().then((p) => p[prop](...args));
  },
});

module.exports = { pool: poolProxy, initDB };
