import Workspace from '@/components/dashboard/Workspace.vue'
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
    component: Workspace,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Workspace,
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Workspace,
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: Workspace,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Workspace,
  },
  {
    path: '/users',
    name: 'Users',
    component: Workspace,
  },
]

export { routes }
