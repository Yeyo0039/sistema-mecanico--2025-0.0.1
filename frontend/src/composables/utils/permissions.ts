export function hasPermission(userRole: number, allowedRoles: number[]): boolean {
  return allowedRoles.includes(userRole)
}
