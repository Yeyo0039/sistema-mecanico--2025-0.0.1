export interface ValidationResult {
  valid: boolean
  message: string
}

export interface ValidationErrors {
  nombre?: string
  apellido?: string
  correo?: string
  usuario?: string
  documento?: string
  password?: string
  confirmarPassword?: string
}
