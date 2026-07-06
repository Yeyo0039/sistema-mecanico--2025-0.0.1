<script setup lang="ts">
import SideBar from '@/components/dashboard/SideBar.vue'
import DashboardHeader from '@/components/dashboard/dashboardHeader.vue'

const props = defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="dashboard-layout">
    <SideBar />

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
