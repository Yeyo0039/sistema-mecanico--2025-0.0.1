<script setup lang="ts">
import SideBar from '@/components/dashboard/SideBar.vue'
import DashboardHeader from '@/components/dashboard/dashboardHeader.vue'
import { useNotification } from '@/composables/useNotification'
import { onMounted } from 'vue'

type MenuItem = {
  path: string
  title: string
  icon: string
  roles: number[]
}

const props = defineProps<{
  title: string
  subtitle?: string
  activeModule?: string
  menuItems?: MenuItem[]
}>()

const emit = defineEmits<{
  (event: 'change-module', value: string): void
}>()

const notify = useNotification()

onMounted(() => {
  notify.success('Bienvenido', 'Has iniciado sesión correctamente')
})
</script>

<template>
  <div class="dashboard-layout">
    <SideBar
      :menu-items="props.menuItems"
      :active-module="props.activeModule"
      @change-module="emit('change-module', $event)"
    />

    <div class="dashboard-content">
      <DashboardHeader :title="props.title" :subtitle="props.subtitle" />

      <main class="dashboard-page">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-page {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
