<script setup lang>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-row'])

function selectRow(row) {
  emit('select-row', row)
}
</script>

<template>
  <div class="dv-compact">
    <div v-for="row in rows" :key="row.id" class="dv-compact-row" @click="selectRow(row)">
      <div v-for="column in columns" :key="column.field" class="dv-compact-cell">
        <strong>{{ column.title }}:</strong>
        <span>{{ row[column.field] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dv-compact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dv-compact-row {
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
}

.dv-compact-cell {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.2rem 0;
}
</style>
