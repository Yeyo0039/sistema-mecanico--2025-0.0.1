import workSpace from '@/components/workSpace/workSpace.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: workSpace,
    meta: { module: 'dashboard' },
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: workSpace,
    meta: { module: 'inventory' },
  },
  {
    path: '/clients',
    name: 'Clients',
    component: workSpace,
    meta: { module: 'dashboard' },
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: workSpace,
    meta: { module: 'dashboard' },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: workSpace,
    meta: { module: 'dashboard' },
  },
  {
    path: '/users',
    name: 'Users',
    component: workSpace,
    meta: { module: 'dashboard' },
  },
]

export { routes }
