import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Sistema Mecánico funcionando",
  });
});

export default app;
