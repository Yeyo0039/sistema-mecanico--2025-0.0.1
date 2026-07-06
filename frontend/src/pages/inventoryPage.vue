<script setup lang="ts">
import DashboardLayout from '@/layouts/dashboardLayoud.vue'
import InventoryPanel from '@/components/inventory/inventoryPanel.vue'
</script>

<template>
  <DashboardLayout title="Inventario" subtitle="Administración de productos">
    <InventoryPanel />
  </DashboardLayout>
</template>
