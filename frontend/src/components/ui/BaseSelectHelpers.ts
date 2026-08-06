import type { SelectOption, SelectOptionSource } from '@/types/forms'

export type AddSelectOptionPayload = {
  source: string
  field: string
  type: 'select' | 'checkbox'
  value: string
  label: string
  createdAt: string
}

export function normalizeOptions(
  options: SelectOptionSource = [],
  isCheckbox = false,
): SelectOption[] {
  if (!Array.isArray(options)) {
    return []
  }

  if (options.length === 0) {
    return isCheckbox
      ? []
      : [
          {
            value: '',
            label: 'Sin opciones disponibles',
          },
        ]
  }

  return options.map((option): SelectOption => {
    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
      }
    }

    if (typeof option === 'object' && option !== null) {
      if ('id' in option && 'nombre' in option) {
        return {
          value: option.id as string | number,
          label: String(option.nombre),
        }
      }

      if ('value' in option && 'label' in option) {
        return {
          value: option.value as string | number,
          label: String(option.label),
        }
      }
    }

    return {
      value: '',
      label: 'Opción inválida',
    }
  })
}

export function buildAddOptionPayload(
  source: string,
  field: string,
  type: 'select' | 'checkbox',
  value: string,
): AddSelectOptionPayload {
  return {
    source,
    field,
    type,
    value,
    label: value,
    createdAt: new Date().toISOString(),
  }
}
