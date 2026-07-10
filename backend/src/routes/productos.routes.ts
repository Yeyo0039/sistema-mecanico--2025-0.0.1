import { Router } from "express";
import db from "../config/database.ts";
const router = Router();

router.get("/productos", async (_req, res) => {
  const defaultQuery = "select * from productos";
  try {
    const rows = await db.query(defaultQuery);
    if (rows) {
      return res.json([rows]);
    }
    res.json([
      {
        id: 1,
        nombre: "Aceite 10W40",
        codigo: "ACE-001",
        precio: 24.5,
        stock: 15,
      },
      {
        id: 2,
        nombre: "Filtro de aire",
        codigo: "FIL-002",
        precio: 18,
        stock: 8,
      },
      {
        id: 3,
        nombre: "Pastillas de freno",
        codigo: "FRE-003",
        precio: 45,
        stock: 12,
      },
      {
        id: 4,
        nombre: "Batería 60Ah",
        codigo: "BAT-004",
        precio: 140,
        stock: 5,
      },
    ]);
  } catch (error) {
    return error;
  }
});

export default router;
