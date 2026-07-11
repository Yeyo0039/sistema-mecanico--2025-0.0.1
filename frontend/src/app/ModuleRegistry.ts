import DashboardModule from '@/modules/dashboard'
import InventarioModule from '@/modules/inventario'

/** Public catalogue of application modules. Keep implementation details inside each module. */
export const ModuleRegistry = {
  dashboard: DashboardModule,
  inventory: InventarioModule,
} as const

export type ModuleName = keyof typeof ModuleRegistry
