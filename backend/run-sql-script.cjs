const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const sqlPath = path.resolve(
  __dirname,
  "..",
  ".dbclient",
  "storage",
  "1783097129018@@127.0.0.1@5432@sistema_mecanico_2026@public",
  "alter-template.sql",
);
const sql = fs.readFileSync(sqlPath, "utf8");

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

(async () => {
  try {
    await client.connect();
    await client.query(sql);
    console.log("SQL_OK");
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
