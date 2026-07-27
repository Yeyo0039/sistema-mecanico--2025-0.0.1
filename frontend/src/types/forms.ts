export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'textarea'
  | 'date'
  | 'checkbox'
  | 'file'

export type SelectDatabaseOption = {
  id: number | string
  nombre: string
}

export type SelectOption = {
  value: number | string
  label: string
}
export interface FormField {
  name: string
  label: string
  type: FieldType

  placeholder?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean

  source?: string
  options?: SelectOption[]
}

export interface FormSection {
  title: string

  columns?: 1 | 2 | 3 | 4

  fields: FormField[]
}
