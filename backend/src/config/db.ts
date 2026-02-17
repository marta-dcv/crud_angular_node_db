import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Opcional: comprobar conexión al arrancar
db.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

db.on('error', (err: any) => {
  console.error('❌ Error en PostgreSQL', err);
});

export { db as pool };