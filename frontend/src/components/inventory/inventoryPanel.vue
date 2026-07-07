<script setup lang="ts">
import InventoryStats from './inventoryStats.vue'
import InventoryToolbar from './inventoryToolbar.vue'
import InventoryFilters from './inventoryFilters.vue'
import InventoryTable from './inventoryTable.vue'
import DashboardCard from '../dashboard/dashboardCard.vue'
import SideBar from '../dashboard/SideBar.vue'
</script>

<template>
  <DashboardCard title="inventario">
    <SideBar />
    <InventoryStats />

    <InventoryToolbar />

    <InventoryFilters />

    <InventoryTable />
  </DashboardCard>
</template>
