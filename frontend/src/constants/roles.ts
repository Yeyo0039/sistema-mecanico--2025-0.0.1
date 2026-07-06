export const ROLES = {
  ADMIN: 1,
  MECANICO: 2,
  RECEPCION: 3,
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
