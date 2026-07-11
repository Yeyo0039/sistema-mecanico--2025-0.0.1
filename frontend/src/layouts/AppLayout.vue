<script setup lang="ts">
import SideBar from '@/components/layout/SideBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="dashboard-layout">
    <SideBar />
    <div class="dashboard-content">
      <AppHeader />
      <main class="dashboard-page"><slot /></main>
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
  min-width: 0;
}
.dashboard-page {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
