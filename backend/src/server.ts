import app from "./app.ts";
import db from "./config/database.ts";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("postgreSQL conectado");
    console.log("Hora del servidor:", result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con postgreSQL");
    console.error(error);
  }
}

startServer();
