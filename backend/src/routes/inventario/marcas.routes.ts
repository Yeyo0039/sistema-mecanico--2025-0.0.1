import { Router } from "express";
import db from "../../config/database.ts";

const router = Router();
router.get("/", async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM marcas
      WHERE activo = true
      ORDER BY nombre ASC
    `);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "No fue posible consultar marcas" });
  }
});
export default router;
