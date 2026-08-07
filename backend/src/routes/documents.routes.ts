import { Router } from "express";
import multer from "multer";
import {
  guardarDocumento,
  listarDocumentos,
  leerDocumentoArchivo,
} from "../services/documentManager.ts";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const body = typeof req.body === "object" && req.body ? req.body : {};
    const result = await guardarDocumento({
      contexto: body.contexto,
      clave: body.clave,
      tipoDocumento: body.tipoDocumento,
      nombreOriginal: body.nombreOriginal || req.file?.originalname,
      metadata: body.metadata ? JSON.parse(body.metadata) : undefined,
      base64: body.base64,
      file: req.file
        ? {
            buffer: req.file.buffer,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
          }
        : undefined,
    });

    if (!result.ok) {
      const status = result.duplicate ? 409 : 400;
      return res.status(status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("upload/documentos", error);
    return res
      .status(500)
      .json({ ok: false, error: "No fue posible guardar el documento" });
  }
});

router.get("/", async (req, res) => {
  try {
    const documents = await listarDocumentos({
      contexto:
        typeof req.query.contexto === "string" ? req.query.contexto : undefined,
      clave: typeof req.query.clave === "string" ? req.query.clave : undefined,
      tipoDocumento:
        typeof req.query.tipoDocumento === "string"
          ? req.query.tipoDocumento
          : undefined,
    });
    return res.json(documents);
  } catch (error) {
    console.error("list/documentos", error);
    return res
      .status(500)
      .json({ ok: false, error: "No fue posible listar los documentos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ ok: false, error: "id inválido" });
    }

    const documentRow = await leerDocumentoArchivo(id);
    if (!documentRow) {
      return res
        .status(404)
        .json({ ok: false, error: "Documento no encontrado" });
    }

    res.setHeader("Content-Type", documentRow.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(documentRow.nombreOriginal)}"`,
    );
    return res.end(documentRow.buffer);
  } catch (error) {
    console.error("read/documentos", error);
    return res
      .status(500)
      .json({ ok: false, error: "No fue posible leer el documento" });
  }
});

export default router;
