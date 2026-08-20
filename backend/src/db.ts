import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Thiếu biến môi trường POSTGRES_URL (hoặc DATABASE_URL). Xem backend/.env.example.'
  );
}

export const sql = neon(connectionString);
