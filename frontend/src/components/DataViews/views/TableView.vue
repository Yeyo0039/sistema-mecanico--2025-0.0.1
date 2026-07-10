<script setup>
import TableCell from './TableCell.vue'

defineProps({
  rows: {
    type: Array,
    default: () => [],
  },

  columns: {
    type: Array,
    default: () => [],
  },

  rowKey: {
    type: String,
    default: 'id',
  },
})
</script>

<template>
  <div class="dv-table-wrapper">
    <table class="dv-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            :style="{ width: column.width || 'auto' }"
            :class="column.headerClass"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]" class="dv-row">
          <TableCell v-for="column in columns" :key="column.field" :row="row" :column="column" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dv-table-wrapper {
  width: 100%;

  overflow: auto;
}

.dv-table {
  width: 100%;

  min-width: 900px;

  border-collapse: collapse;
}

.dv-table thead {
  position: sticky;

  top: 0;

  background: rgb(52, 62, 202);

  z-index: 5;
}

.dv-table th {
  padding: 12px;

  text-align: left;

  white-space: nowrap;

  font-size: 14px;

  font-weight: 600;

  border-bottom: 1px solid #5a14fd;
}

.dv-row {
  transition: 0.15s;
}

.dv-row:hover {
  background: #05f0f08c;
}
</style>
