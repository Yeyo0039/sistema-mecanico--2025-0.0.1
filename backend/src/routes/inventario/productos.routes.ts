import { Router } from "express";
import db from "../../config/database.ts";
const router = Router();

async function upsertInventarioProducto(
  productoId: number,
  stock: unknown,
  stockMinimo: unknown,
  stockMaximo: unknown,
  ubicacion: unknown,
) {
  const existingInventario = await db.query(
    `SELECT id_inventario FROM inventario WHERE id_producto = $1 LIMIT 1`,
    [productoId],
  );

  if (existingInventario.rows.length > 0) {
    await db.query(
      `UPDATE inventario
       SET cantidad = $2,
           stock_minimo = $3,
           stock_maximo = $4,
           ubicacion = $5
       WHERE id_producto = $1`,
      [
        productoId,
        stock ?? 0,
        stockMinimo ?? null,
        stockMaximo ?? null,
        ubicacion ?? null,
      ],
    );
    return;
  }

  await db.query(
    `INSERT INTO inventario
      (id_producto, cantidad, stock_minimo, stock_maximo, ubicacion)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      productoId,
      stock ?? 0,
      stockMinimo ?? null,
      stockMaximo ?? null,
      ubicacion ?? null,
    ],
  );
}

async function upsertPrecioProducto(
  productoId: number,
  precioCompra: unknown,
  precioVenta: unknown,
) {
  const existingPrecio = await db.query(
    `SELECT id_precio FROM precios WHERE id_producto = $1 LIMIT 1`,
    [productoId],
  );

  if (existingPrecio.rows.length > 0) {
    await db.query(
      `UPDATE precios
       SET precio_compra = $2,
           precio_venta = $3,
           proveedor = $4,
           fecha = NOW(),
           activo = $5
       WHERE id_producto = $1`,
      [productoId, precioCompra ?? null, precioVenta, null, true],
    );
    return;
  }

  await db.query(
    `INSERT INTO precios
      (id_producto, precio_compra, precio_venta, proveedor, fecha, activo)
      VALUES ($1, $2, $3, $4, NOW(), $5)`,
    [productoId, precioCompra ?? null, precioVenta, null, true],
  );
}

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
    id,
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

    let productoId =
      Number.isInteger(Number(id)) && Number(id) > 0 ? Number(id) : null;
    let persistedProductId: number | null = null;

    if (productoId !== null) {
      persistedProductId = productoId;
      await db.query(
        `UPDATE productos
         SET codigo = $1,
             nombre = $2,
             descripcion = $3,
             id_categoria = $4,
             id_marca = $5,
             ubicacion = $6,
             referencia_interna = $7,
             detalle = $8,
             activo = $9
         WHERE id = $10`,
        [
          codigo,
          nombre,
          detalles,
          categoria,
          marca,
          ubicacion,
          referencia_interna,
          null,
          true,
          productoId,
        ],
      );

      if (persistedProductId === null) {
        throw new Error(
          "No se pudo determinar el id del producto para actualizar",
        );
      }

      await upsertInventarioProducto(
        persistedProductId,
        stock,
        stock_minimo,
        stock_maximo,
        ubicacion,
      );

      await upsertPrecioProducto(
        persistedProductId,
        precio_compra,
        precioVenta,
      );
    } else {
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

      persistedProductId = insertProducto.rows[0].id;
      productoId = persistedProductId;

      if (persistedProductId === null) {
        throw new Error("No se pudo obtener el id del producto creado");
      }

      await upsertInventarioProducto(
        persistedProductId,
        stock,
        stock_minimo,
        stock_maximo,
        ubicacion,
      );

      await upsertPrecioProducto(
        persistedProductId,
        precio_compra,
        precioVenta,
      );
    }

    if (Array.isArray(compatibilidad) && compatibilidad.length > 0) {
      const compatibilityValues = compatibilidad
        .filter((item) => item && item.id_producto === undefined)
        .map((item) => [
          persistedProductId,
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

    if (imagen && persistedProductId) {
      const imageName =
        typeof imagen === "string" ? imagen : imagen?.name || "imagen";
      const imageValue = typeof imagen === "string" ? imagen : null;
      const existing = await db.query(
        `SELECT id_multimedia FROM multimedia WHERE id_producto = $1 AND tipo = $2 LIMIT 1`,
        [persistedProductId, "imagen"],
      );

      if (existing.rows.length > 0) {
        await db.query(
          `UPDATE multimedia SET nombre_archivo = $1, ruta = $2, principal = true WHERE id_multimedia = $3`,
          [imageName, imageValue ?? "", existing.rows[0].id_multimedia],
        );
      } else {
        await db.query(
          `INSERT INTO multimedia (id_producto, tipo, nombre_archivo, ruta, principal)
           VALUES ($1, $2, $3, $4, true)`,
          [persistedProductId, "imagen", imageName, imageValue ?? ""],
        );
      }
    }

    await db.query("COMMIT");

    return res.status(201).json({
      message: "Producto creado exitosamente",
      id: persistedProductId,
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
