export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'textarea'
  | 'date'
  | 'checkbox'

export interface FormField {
  name: string
  label: string
  type: FieldType

  placeholder?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean

  options?: string[]
}

export interface FormSection {
  title: string

  columns?: 1 | 2 | 3 | 4

  fields: FormField[]
}
