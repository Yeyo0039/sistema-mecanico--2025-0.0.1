const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

client
  .connect()
  .then(async () => {
    const res = await client.query(
      "SELECT current_database() AS db, current_user AS usr",
    );
    console.log(JSON.stringify(res.rows[0]));
    await client.end();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
