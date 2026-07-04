import { EMAIL_REGEX, USERNAME_REGEX, PASSWORD_REGEX, DOCUMENT_REGEX, NAME_REGEX } from './regex'

import type { ValidationErrors } from './types.validations'

export function validateUser(data: any): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.nombre.trim()) {
    errors.nombre = 'Ingrese el nombre'
  } else if (!NAME_REGEX.test(data.nombre)) {
    errors.nombre = 'Nombre inválido'
  }

  if (!data.apellido.trim()) {
    errors.apellido = 'Ingrese el apellido'
  } else if (!NAME_REGEX.test(data.apellido)) {
    errors.apellido = 'Apellido inválido'
  }

  if (!EMAIL_REGEX.test(data.correo)) {
    errors.correo = 'Correo inválido'
  }

  if (!USERNAME_REGEX.test(data.usuario)) {
    errors.usuario = 'Usuario inválido'
  }

  if (!DOCUMENT_REGEX.test(data.documento)) {
    errors.documento = 'Documento inválido'
  }

  if (!PASSWORD_REGEX.test(data.password)) {
    errors.password = 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo'
  }

  if (data.password !== data.confirmarPassword) {
    errors.confirmarPassword = 'Las contraseñas no coinciden'
  }

  return errors
}
