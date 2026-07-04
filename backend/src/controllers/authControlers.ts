import type { Request, Response } from "express";
import * as AuthService from "../services/auth.services.ts";

export async function register(req: Request, res: Response) {
  try {
    const result = await AuthService.register(req.body);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await AuthService.login(req.body);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
