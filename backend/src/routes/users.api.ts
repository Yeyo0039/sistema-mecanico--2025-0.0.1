import { Router } from "express";
import db from "../config/database.ts";

const router = Router();

router.get("/usuarios/:usuario", async (req, res) => {
  const user = req.params.usuario;
  try {
    const result = await db.query("SELECT * FROM usuarios WHERE usuario = $1", [
      user,
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
