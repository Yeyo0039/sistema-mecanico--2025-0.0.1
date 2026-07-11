import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import categoriasRoutes from "./routes/categorias.routes.ts";
import productosRoutes from "./routes/productos.routes.ts";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Sistema Mecánico funcionando",
  });
});

export default app;
