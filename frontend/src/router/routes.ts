import DashboardPage from '@/pages/DashboardPage.vue'
import InventoryPage from '@/pages/inventoryPage.vue'
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
    component: DashboardPage,
  },
  {
    path: '/inventoy',
    name: 'Inventory',
    component: InventoryPage,
  },
]

export { routes }
