import crypto from "crypto";
import { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/database.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../../uploads");

const DOCUMENTS_TABLE = "documentos";

export type DocumentContext =
  | "producto"
  | "orden"
  | "placa"
  | "usuario"
  | "publico"
  | "cotizacion";

export interface SaveDocumentInput {
  contexto: DocumentContext | string;
  clave: string;
  tipoDocumento: string;
  nombreOriginal?: string;
  metadata?: Record<string, unknown>;
  file?: {
    buffer?: Buffer;
    originalname?: string;
    mimetype?: string;
  };
  base64?: string;
}

function sanitizeSegment(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .trim()
    .toLowerCase();
}

function normalizeContext(contexto: string): DocumentContext {
  const normalized = String(contexto || "")
    .trim()
    .toLowerCase();
  if (normalized === "producto") return "producto";
  if (normalized === "orden") return "orden";
  if (normalized === "placa") return "placa";
  if (normalized === "usuario") return "usuario";
  if (normalized === "publico") return "publico";
  if (normalized === "cotizacion") return "cotizacion";
  return "usuario";
}

function buildRelativePath(
  contexto: DocumentContext,
  clave: string,
  tipoDocumento: string,
  originalName: string,
) {
  const base = sanitizeSegment(clave) || "sin-clave";
  const tipo = sanitizeSegment(tipoDocumento) || "documento";
  const ext = path.extname(originalName || "archivo.bin") || ".bin";
  const safeName = `${tipo}_${base}${ext}`;

  const folder =
    {
      producto: path.join("productos", base),
      orden: path.join("ordenes", base),
      placa: path.join("placas", base),
      usuario: path.join("usuarios", base),
      publico: path.join("publicos", base),
      cotizacion: path.join("cotizaciones", base),
    }[contexto] || path.join("generico", base);

  return path.join(folder, safeName).replace(/\\/g, "/");
}

function deriveEncryptionKey(
  contexto: DocumentContext,
  clave: string,
  tipoDocumento: string,
): Buffer {
  return crypto
    .createHash("sha256")
    .update(`${normalizeContext(contexto)}:${clave}:${tipoDocumento}`)
    .digest();
}

function validateContextKey(
  contexto: DocumentContext,
  clave: string,
): string | null {
  const value = String(clave || "").trim();
  if (!value) return "La clave es obligatoria";

  switch (contexto) {
    case "producto": {
      if (!/^producto[:_-][a-z0-9-]+$/i.test(value)) {
        return "La clave de producto debe tener formato producto:slug";
      }
      break;
    }
    case "orden": {
      if (!/^orden[:_-]\d+$/i.test(value)) {
        return "La clave de orden debe tener formato orden:123";
      }
      break;
    }
    case "placa": {
      if (!/^placa[:_-][a-z0-9-]+$/i.test(value)) {
        return "La clave de placa debe tener formato placa:ABC123";
      }
      break;
    }
    case "usuario": {
      if (!/^usuario[:_-][a-z0-9-]+$/i.test(value)) {
        return "La clave de usuario debe tener formato usuario:123";
      }
      break;
    }
    default:
      break;
  }

  return null;
}

function normalizeMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> {
  return metadata ? { ...metadata } : {};
}

async function upsertMultimediaRecord(
  productoId: number | null,
  tipo: string,
  nombreArchivo: string,
  rutaRelativa: string,
  principal = false,
) {
  if (!productoId) return null;

  const existing = await db.query(
    `SELECT id_multimedia FROM multimedia WHERE id_producto = $1 AND tipo = $2 LIMIT 1`,
    [productoId, tipo],
  );

  if (existing.rows.length > 0) {
    const result = await db.query(
      `UPDATE multimedia
       SET nombre_archivo = $1,
           ruta = $2,
           principal = $3,
           fecha_subida = NOW()
       WHERE id_multimedia = $4
       RETURNING id_multimedia, id_producto, tipo, nombre_archivo, ruta, principal`,
      [nombreArchivo, rutaRelativa, principal, existing.rows[0].id_multimedia],
    );

    return result.rows[0] ?? null;
  }

  const result = await db.query(
    `INSERT INTO multimedia (id_producto, tipo, nombre_archivo, ruta, principal)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_multimedia, id_producto, tipo, nombre_archivo, ruta, principal`,
    [productoId, tipo, nombreArchivo, rutaRelativa, principal],
  );

  return result.rows[0] ?? null;
}

function hashBuffer(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function readFileBuffer(input: SaveDocumentInput): Buffer {
  if (input.file?.buffer) return Buffer.from(input.file.buffer);
  if (input.base64) {
    const clean = input.base64.includes(",")
      ? input.base64.split(",").pop()
      : input.base64;
    return Buffer.from(clean || "", "base64");
  }
  throw new Error("No hay contenido de archivo para guardar");
}

async function ensureMultimediaTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS multimedia (
      id_multimedia SERIAL PRIMARY KEY,
      id_producto INTEGER,
      tipo VARCHAR(20),
      nombre_archivo TEXT,
      ruta TEXT,
      principal BOOLEAN DEFAULT FALSE,
      fecha_subida TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      CONSTRAINT multimedia_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES productos(id)
    );
  `);
}

async function ensureDocumentsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${DOCUMENTS_TABLE} (
      id SERIAL PRIMARY KEY,
      contexto TEXT NOT NULL,
      clave TEXT NOT NULL,
      tipo_documento TEXT NOT NULL,
      nombre_original TEXT NOT NULL,
      nombre_archivo TEXT NOT NULL,
      ruta_relativa TEXT NOT NULL UNIQUE,
      hash_contenido TEXT NOT NULL,
      iv TEXT NOT NULL,
      tag TEXT NOT NULL,
      mime_type TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      creado_en TIMESTAMPTZ DEFAULT NOW(),
      activo BOOLEAN DEFAULT TRUE
    );
  `);

  await db.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS documentos_unq
    ON ${DOCUMENTS_TABLE}(contexto, clave, tipo_documento, hash_contenido);
  `);
}

Promise.all([ensureMultimediaTable(), ensureDocumentsTable()]).catch(
  (error) => {
    console.error("No se pudo preparar las tablas de documentos", error);
  },
);

async function saveEncryptedFile(
  filePath: string,
  buffer: Buffer,
  key: Buffer,
) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, tag, encrypted]);
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, payload);
  return { iv, tag };
}

async function readEncryptedFile(
  filePath: string,
  key: Buffer,
  ivHex: string,
  tagHex: string,
) {
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const payload = await fsp.readFile(filePath);
  const encrypted = payload.subarray(32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

export async function guardarDocumento(input: SaveDocumentInput) {
  const contexto = normalizeContext(input.contexto);
  const clave = String(input.clave || "").trim();
  const tipoDocumento = String(input.tipoDocumento || "").trim();
  const nombreOriginal = String(
    input.nombreOriginal || input.file?.originalname || "documento.bin",
  ).trim();

  const missing = [];
  if (!contexto) missing.push("contexto");
  if (!clave) missing.push("clave");
  if (!tipoDocumento) missing.push("tipoDocumento");
  if (!nombreOriginal) missing.push("nombreOriginal");
  if (!input.file && !input.base64) missing.push("archivo");

  if (missing.length > 0) {
    return { ok: false, error: "Faltan parámetros obligatorios", missing };
  }

  const keyError = validateContextKey(contexto, clave);
  if (keyError) {
    return { ok: false, error: keyError };
  }

  const buffer = readFileBuffer(input);
  const hash = hashBuffer(buffer);
  const existing = await db.query(
    `SELECT id, nombre_original FROM ${DOCUMENTS_TABLE} WHERE contexto = $1 AND clave = $2 AND tipo_documento = $3 AND hash_contenido = $4 LIMIT 1`,
    [contexto, clave, tipoDocumento, hash],
  );

  if (existing.rows.length > 0) {
    return {
      ok: false,
      duplicate: true,
      message: "Documento duplicado; no se vuelve a guardar",
      existingId: existing.rows[0].id,
      nombreOriginal: existing.rows[0].nombre_original,
    };
  }

  const ext = path.extname(nombreOriginal || "archivo.bin") || ".bin";
  const nombreArchivo = `${sanitizeSegment(tipoDocumento)}_${sanitizeSegment(clave)}_${Date.now()}${ext}`;
  const relativePath = buildRelativePath(
    contexto,
    clave,
    tipoDocumento,
    nombreOriginal,
  );
  const absolutePath = path.join(uploadsRoot, relativePath);
  const key = deriveEncryptionKey(contexto, clave, tipoDocumento);
  const { iv, tag } = await saveEncryptedFile(absolutePath, buffer, key);

  const metadata = normalizeMetadata(input.metadata);
  const result = await db.query(
    `INSERT INTO ${DOCUMENTS_TABLE} (
      contexto,
      clave,
      tipo_documento,
      nombre_original,
      nombre_archivo,
      ruta_relativa,
      hash_contenido,
      iv,
      tag,
      mime_type,
      metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, ruta_relativa, nombre_archivo`,
    [
      contexto,
      clave,
      tipoDocumento,
      nombreOriginal,
      nombreArchivo,
      relativePath,
      hash,
      iv.toString("hex"),
      tag.toString("hex"),
      input.file?.mimetype || "application/octet-stream",
      JSON.stringify(metadata),
    ],
  );

  let multimediaRecord = null;
  const shouldUpdateMultimedia = metadata.actualizarMultimedia === true;
  if (contexto === "producto" && shouldUpdateMultimedia) {
    const productIdValue =
      metadata.productoId ?? metadata.id_producto ?? metadata.productId;
    const productId =
      typeof productIdValue === "number"
        ? productIdValue
        : Number(productIdValue);
    multimediaRecord = await upsertMultimediaRecord(
      Number.isFinite(productId) ? productId : null,
      tipoDocumento,
      nombreArchivo,
      relativePath,
      Boolean(metadata.principal),
    );
  }

  return {
    ok: true,
    id: result.rows[0].id,
    rutaRelativa: result.rows[0].ruta_relativa,
    nombreArchivo: result.rows[0].nombre_archivo,
    hash,
    multimedia: multimediaRecord,
  };
}

export async function listarDocumentos(
  filters: Partial<{
    contexto: string;
    clave: string;
    tipoDocumento: string;
  }> = {},
) {
  const where: string[] = [];
  const values: unknown[] = [];

  if (filters.contexto) {
    values.push(normalizeContext(filters.contexto));
    where.push(`contexto = $${values.length}`);
  }

  if (filters.clave) {
    values.push(String(filters.clave));
    where.push(`clave = $${values.length}`);
  }

  if (filters.tipoDocumento) {
    values.push(String(filters.tipoDocumento));
    where.push(`tipo_documento = $${values.length}`);
  }

  const query = `SELECT id, contexto, clave, tipo_documento, nombre_original, nombre_archivo, ruta_relativa, mime_type, metadata, creado_en FROM ${DOCUMENTS_TABLE}${where.length > 0 ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY creado_en DESC`;
  const result = await db.query(query, values);
  return result.rows;
}

export async function obtenerDocumento(id: number) {
  const result = await db.query(
    `SELECT id, contexto, clave, tipo_documento, nombre_original, nombre_archivo, ruta_relativa, iv, tag, mime_type, metadata FROM ${DOCUMENTS_TABLE} WHERE id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export async function leerDocumentoArchivo(id: number) {
  const documentRow = await obtenerDocumento(id);
  if (!documentRow) return null;

  const key = deriveEncryptionKey(
    documentRow.contexto,
    documentRow.clave,
    documentRow.tipo_documento,
  );
  const absolutePath = path.join(uploadsRoot, documentRow.ruta_relativa);
  const buffer = await readEncryptedFile(
    absolutePath,
    key,
    documentRow.iv,
    documentRow.tag,
  );

  return {
    buffer,
    mimeType: documentRow.mime_type || "application/octet-stream",
    nombreOriginal: documentRow.nombre_original,
  };
}
