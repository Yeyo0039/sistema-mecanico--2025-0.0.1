<script setup lang="ts">
import DataView from '@/components/DataViews/DataView.vue'
const inventoryConfig = {
  title: 'Inventario',
  mode: 'table',
  pagination: true,
  toolbar: true,
  columns: [
    { field: 'id', title: 'ID', width: '80px' },
    { field: 'nombre', title: 'Nombre' },
    { field: 'codigo', title: 'Código' },
    { field: 'categoria', title: 'Categoria' },
    { field: 'precio', title: 'Precio' },
    { field: 'stock', title: 'Stock' },
    { field: 'acciones', title: 'Acciones' },
  ],
  source: {
    type: 'api',
    endpoint: 'http://localhost:3000/api/productos',
  },
}
</script>

<template>
  <section class="inventory-view">
    <DataView :config="inventoryConfig" />
  </section>
</template>

<style scoped>
.inventory-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
