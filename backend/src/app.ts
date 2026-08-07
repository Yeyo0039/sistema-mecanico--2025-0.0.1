import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import categoriasRoutes from "./routes/inventario/categorias.routes.ts";
import productosRoutes from "./routes/inventario/productos.routes.ts";
import documentsRoutes from "./routes/documents.routes.ts";

import marcasRoutes from "./routes/inventario/marcas.routes.ts";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventario/categorias", categoriasRoutes);
app.use("/api/inventario/productos", productosRoutes);
app.use("/api/inventario/marcas", marcasRoutes); // Asegúrate de importar correctamente las rutas de marcas
app.use("/api/documents", documentsRoutes);
// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Sistema Mecánico funcionando",
  });
});

export default app;
