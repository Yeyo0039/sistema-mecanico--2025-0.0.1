<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DashboardLayout from '@/layouts/dashboardLayoud.vue'
import DashboardCard from '@/components/dashboard/dashboardCard.vue'
import InventarioView from '@/components/dashboard/InventarioView.vue'
import menu from '@/config/sideMenuConfig'
import { hasPermission } from '@/composables/utils/permissions'

const userRole = 1
const route = useRoute()
const router = useRouter()

const visibleMenu = computed(() => menu.filter((item) => hasPermission(userRole, item.roles)))

const activeModule = computed(() => route.path.replace('/', '') || 'dashboard')

const DashboardHomeView = {
  name: 'DashboardHomeView',
  components: { DashboardCard },
  template: `
    <div class="stats">
      <DashboardCard title="Productos" value="245" subtitle="En inventario" icon="📦" />
      <DashboardCard title="Vehículos" value="18" subtitle="Registrados" icon="🚗" />
      <DashboardCard title="Clientes" value="54" subtitle="Activos" icon="👥" />
      <DashboardCard title="Órdenes" value="13" subtitle="Pendientes" icon="🛠️" />
    </div>
  `,
}

const PlaceholderModule = {
  name: 'PlaceholderModule',
  template: `
    <section class="placeholder-module">
      <h3>Módulo en construcción</h3>
      <p>Este módulo se habilitará próximamente con el mismo flujo que Inventario.</p>
    </section>
  `,
}

const activeView = computed(() => {
  switch (activeModule.value) {
    case 'inventory':
      return InventarioView
    case 'clients':
    case 'vehicles':
    case 'orders':
    case 'users':
      return PlaceholderModule
    default:
      return DashboardHomeView
  }
})

const layoutTitle = computed(() => {
  return activeModule.value === 'inventory' ? 'Inventario' : 'Dashboard'
})

const layoutSubtitle = computed(() => {
  return activeModule.value === 'inventory'
    ? 'Administración de productos'
    : 'Resumen general del sistema'
})

function changeModule(path: string) {
  router.push(path)
}
</script>

<template>
  <DashboardLayout
    :title="layoutTitle"
    :subtitle="layoutSubtitle"
    :active-module="activeModule"
    :menu-items="visibleMenu"
    @change-module="changeModule"
  >
    <component :is="activeView" />
  </DashboardLayout>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.placeholder-module {
  padding: 2rem;
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  background: var(--color-surface);
}
</style>
