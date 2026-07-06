import { ROLES } from '@/constants/roles'

const menu = [
  {
    title: 'Dashboard',
    icon: '🏠',
    path: '/dashboard',
    roles: [ROLES.ADMIN, ROLES.MECANICO, ROLES.RECEPCION],
  },

  {
    title: 'Inventario',
    icon: '📦',
    path: '/inventory',
    roles: [ROLES.ADMIN, ROLES.MECANICO],
  },

  {
    title: 'Clientes',
    icon: '👥',
    path: '/clients',
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
  },

  {
    title: 'Vehículos',
    icon: '🚗',
    path: '/vehicles',
    roles: [ROLES.ADMIN, ROLES.MECANICO],
  },

  {
    title: 'Órdenes',
    icon: '🛠️',
    path: '/orders',
    roles: [ROLES.ADMIN, ROLES.MECANICO],
  },

  {
    title: 'Usuarios',
    icon: '👤',
    path: '/users',
    roles: [ROLES.ADMIN],
  },
]
export default menu
