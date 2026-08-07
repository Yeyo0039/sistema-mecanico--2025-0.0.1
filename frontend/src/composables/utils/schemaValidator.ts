import type { FormSection, FormField } from '@/types/forms'

/**
 * ==========================================================
 * NORMALIZACIÓN
 * ==========================================================
 *
 * Convierte todos los valores del modelo según el tipo
 * definido en el schema.
 *
 * NO valida.
 *
 * SOLO transforma datos.
 *
 * Ejemplo
 *
 * "15"
 * ↓
 * 15
 *
 * "   Tornillo   "
 * ↓
 * "Tornillo"
 *
 */

export function normalizeSchema<T extends Record<string, unknown>>(
  schema: FormSection[],
  model: T,
): T {
  const normalized: Record<string, unknown> = {
    ...model,
  }

  for (const section of schema) {
    for (const field of section.fields) {
      normalized[field.name] = normalizeValue(normalized[field.name], field)
    }
  }

  return normalized as T
}

/**
 * ==========================================================
 * VALIDACIÓN
 * ==========================================================
 */

export function validateSchema(schema: FormSection[], model: Record<string, unknown>) {
  const normalized = normalizeSchema(schema, model)

  const errors: Record<string, string> = {}

  for (const section of schema) {
    for (const field of section.fields) {
      if (!field.required) continue

      if (isEmptyValue(normalized[field.name], field.type)) {
        errors[field.name] = `${field.label} es obligatorio`

        console.error(`[Validator] Campo obligatorio: ${field.label}`)
      }
    }
  }

  return {
    model: normalized,
    errors,
    valid: Object.keys(errors).length === 0,
  }
}

/**
 * ==========================================================
 * NORMALIZADOR GENÉRICO
 * ==========================================================
 *
 * Toda la lógica de transformación vive aquí.
 *
 * Si mañana agregas un nuevo tipo ("date",
 * "currency", "email"...)
 *
 * solamente modificas esta función.
 *
 */

function normalizeValue(value: unknown, field: FormField): unknown {
  switch (field.type) {
    case 'number':
      return normalizeNumber(value)

    case 'checkbox':
      return Array.isArray(value) ? value : []

    case 'file':
      return value instanceof File || typeof value === 'string' ? value : null

    case 'boolean':
      return Boolean(value)
    case 'text':
    case 'textarea':
    case 'email':
    case 'password':
    case 'select':
    default:
      return normalizeString(value)
  }
}

/**
 * Strings
 */

function normalizeString(value: unknown): string {
  if (value == null) return ''

  return String(value).trim().replace(/\s+/g, ' ')
}

/**
 * Numbers
 */

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Vacíos
 */

function isEmptyValue(value: unknown, fieldType: string) {
  switch (fieldType) {
    case 'number':
      return value === null

    case 'checkbox':
      return !Array.isArray(value) || value.length === 0

    case 'file':
      return value === null

    default:
      return value === null || value === undefined || String(value).trim() === ''
  }
}
