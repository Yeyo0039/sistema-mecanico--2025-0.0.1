import { Router } from "express";
import db from "../../config/database.ts";
const router = Router();

router.get("/", async (req, res) => {
  const categoryId = req.query.categoriaId
    ? Number(req.query.categoriaId)
    : null;
  const search =
    typeof req.query.search === "string" && req.query.search.trim()
      ? req.query.search.trim()
      : null;

  if (categoryId !== null && !Number.isInteger(categoryId)) {
    return res
      .status(400)
      .json({ message: "La categoría debe ser un número válido" });
  }

  try {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.referencia_interna,
        p.referencia_fabricante,
        p.id_categoria AS categoria_id,
        c.nombre AS categoria,
        c.icono AS categoria_icono,
        c.color AS categoria_color,
        m.nombre AS marca,
        COALESCE(precio.precio_venta, 0) AS precio,
        COALESCE(inv.cantidad, 0) AS stock
      FROM productos AS p
      LEFT JOIN categorias AS c ON c.id = p.id_categoria
      LEFT JOIN marcas AS m ON m.id = p.id_marca
      LEFT JOIN LATERAL (
        SELECT precio_venta
        FROM precios
        WHERE id_producto = p.id AND activo = true
        ORDER BY fecha DESC NULLS LAST, id_precio DESC
        LIMIT 1
      ) AS precio ON true
      LEFT JOIN inventario AS inv ON inv.id_producto = p.id
      WHERE ($1::integer IS NULL OR p.id_categoria = $1)
        AND (
          $2::text IS NULL
          OR p.nombre ILIKE '%' || $2 || '%'
          OR p.codigo ILIKE '%' || $2 || '%'
        )
      ORDER BY p.nombre ASC
    `,
      [categoryId, search],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "No fue posible consultar productos" });
  }
});

router.post("/_crear", async (req, res) => {
  console.log("Datos recibidos para crear producto:", req.body);
  const {
    codigo,
    referencia_interna,
    nombre,
    marca,
    categoria,
    compatibilidad,
    detalles,
    imagen,
    stock,
    stock_maximo,
    ubicacion,
    stock_minimo,
    precio_compra,
    precioVenta,
  } = req.body;

  if (
    codigo === undefined ||
    referencia_interna === undefined ||
    nombre === undefined ||
    categoria === undefined ||
    marca === undefined ||
    precioVenta === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    await db.query("BEGIN");

    const insertProducto = await db.query(
      `INSERT INTO productos
        (codigo, nombre, descripcion, id_categoria, id_marca, ubicacion, referencia_fabricante, referencia_interna, detalle, activo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
      [
        codigo,
        nombre,
        detalles,
        categoria,
        marca,
        ubicacion,
        null,
        referencia_interna,
        null,
        true,
      ],
    );

    const productoId = insertProducto.rows[0].id;

    await db.query(
      `INSERT INTO inventario
        (id_producto, cantidad, stock_minimo, stock_maximo, ubicacion)
        VALUES ($1, $2, $3, $4, $5)`,
      [
        productoId,
        stock,
        stock_minimo ?? null,
        stock_maximo ?? null,
        ubicacion ?? null,
      ],
    );

    await db.query(
      `INSERT INTO precios
        (id_producto, precio_compra, precio_venta, proveedor, fecha, activo)
        VALUES ($1, $2, $3, $4, NOW(), $5)`,
      [productoId, precio_compra ?? null, precioVenta, null, true],
    );

    if (Array.isArray(compatibilidad) && compatibilidad.length > 0) {
      const compatibilityValues = compatibilidad
        .filter((item) => item && item.id_producto === undefined)
        .map((item) => [
          productoId,
          item.fabricante ?? null,
          item.modelo ?? null,
          item.cilindraje ?? null,
          item.año_inicio ?? null,
          item.año_fin ?? null,
        ]);

      if (compatibilityValues.length > 0) {
        const queryText = `INSERT INTO compatibilidades
          (id_producto, fabricante, modelo, cilindraje, año_inicio, año_fin)
          VALUES ${compatibilityValues
            .map((_, index) => {
              const base = index * 6;
              return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
            })
            .join(", ")}`;

        await db.query(queryText, compatibilityValues.flat());
      }
    }

    await db.query("COMMIT");

    return res.status(201).json({
      message: "Producto creado exitosamente",
      id: productoId,
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    return res
      .status(500)
      .json({ message: "No fue posible crear el producto" });
  }
});
/* Fallback data belongs to development only and is retained for reference.
router.get("/example", (_req, res) => {
  return res.json([
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
});
*/

export default router;
