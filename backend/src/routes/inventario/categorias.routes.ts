import { Router } from "express";
import db from "../../config/database.ts";

const router = Router();

// Categorías activas para los filtros del módulo Inventario.
router.get("/", async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nombre, descripcion, icono, color, orden
      FROM categorias
      WHERE estado = true
      ORDER BY orden ASC, nombre ASC
    `);

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "No fue posible consultar categorías" });
  }
});

export default router;
