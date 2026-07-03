import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
    ? Number(process.env.POSTGRES_PORT)
    : undefined,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

db.on("error", (err) => {
  console.error("Error inesperado en PostgreSQL:", err);
});

export default db;
