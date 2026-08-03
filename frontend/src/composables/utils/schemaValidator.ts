import type { FormSection } from '@/types/forms'

/**
 * Valida un modelo contra un schema de formulario.
 *
 * El resultado es un objeto de errores uniforme con las claves
 * de los campos y mensajes de error legibles.
 */
export function validateSchema(schema: FormSection[], model: any) {
  const errors: Record<string, string> = {}

  for (const section of schema) {
    for (const field of section.fields) {
      const value = model[field.name]

      if (!field.required) {
        continue
      }

      const isInvalid = isEmptyValue(value, field.type)

      if (isInvalid) {
        errors[field.name] = `${field.label} es obligatorio`
        console.error(`Error: ${field.label} es obligatorio`)
      }
    }
  }

  return errors
}

function isEmptyValue(value: unknown, fieldType: string) {
  if (fieldType === 'number') {
    return value === null || value === undefined || value === ''
  }

  if (fieldType === 'checkbox') {
    return (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'string' && value.trim() === '')
    )
  }

  return value === null || value === undefined || String(value).trim() === ''
}
