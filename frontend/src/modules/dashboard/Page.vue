<script setup lang="ts">
import DashboardCard from './components/DashboardCard.vue'
</script>

<template>
  <section class="stats">
    <DashboardCard title="Productos" value="245" subtitle="En inventario" icon="📦" />
    <DashboardCard title="Vehículos" value="18" subtitle="Registrados" icon="🚗" />
    <DashboardCard title="Clientes" value="54" subtitle="Activos" icon="👥" />
    <DashboardCard title="Órdenes" value="13" subtitle="Pendientes" icon="🛠️" />
  </section>
</template>

<style scoped>.stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1.5rem; }</style>
