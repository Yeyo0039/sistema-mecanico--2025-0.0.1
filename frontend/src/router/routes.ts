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
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: workSpace,
  },
  {
    path: '/clients',
    name: 'Clients',
    component: workSpace,
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: workSpace,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: workSpace,
  },
  {
    path: '/users',
    name: 'Users',
    component: workSpace,
  },
]

export { routes }
