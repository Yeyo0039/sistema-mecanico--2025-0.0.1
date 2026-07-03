import { Router } from "express";
import db from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const result = await db.query("SELECT * FROM usuarios WHERE usuario = $1", [
      usuario,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev-secret-key";

    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        rol: user.id_rol,
      },
      jwtSecret,
      {
        expiresIn: "8h",
      },
    );

    return res.json({
      success: true,
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.id_rol,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;
