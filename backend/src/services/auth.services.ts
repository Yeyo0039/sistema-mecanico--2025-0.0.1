import db from "../config/database.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "node:process";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

interface RegisterDTO {
  nombre: string;
  apellido: string;
  documento: string;
  usuario: string;
  correo: string;
  password: string;
}

export async function register(registerData: RegisterDTO) {
  const { nombre, apellido, documento, usuario, correo, password } =
    registerData;

  // Buscar usuario existente
  const exists = await db.query(
    `
      SELECT id
      FROM usuarios
      WHERE usuario = $1
         OR correo = $2
         OR documento = $3
    `,
    [usuario, correo, documento],
  );

  if (exists.rows.length > 0) {
    return {
      status: 400,
      success: false,
      message: "El usuario ya existe",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.query(
    `
    INSERT INTO usuarios
    (
      nombre,
      apellido,
      documento,
      usuario,
      correo,
      password_hash,
      id_rol
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7
    )
    RETURNING
      id,
      nombre,
      apellido,
      usuario,
      correo
    `,
    [
      nombre,
      apellido,
      documento,
      usuario,
      correo,
      passwordHash,
      1, // ADMIN
    ],
  );

  return {
    status: 201,
    success: true,
    message: "Administrador creado correctamente",
    usuario: result.rows[0],
  };
}

//loguin
interface LoginDTO {
  usuario: string;
  password: string;
}
export async function login(LoginData: LoginDTO) {
  const { usuario, password } = LoginData;

  const result = await db.query(
    `
      SELECT *
      FROM usuarios
      WHERE usuario = $1
    `,
    [usuario],
  );

  if (result.rows.length === 0) {
    return {
      status: 401,
      success: false,
      message: "Credenciales inválidas",
    };
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return {
      status: 401,
      success: false,
      message: "Credenciales inválidas",
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      rol: user.id_rol,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );

  return {
    status: 200,
    success: true,
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      correo: user.correo,
      rol: user.id_rol,
    },
  };
}
