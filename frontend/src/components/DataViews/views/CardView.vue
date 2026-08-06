<script setup>
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
  <div class="dv-cards">
    <article v-for="row in rows" :key="row.id" class="dv-card" @click="selectRow(row)">
      <div v-for="column in columns" :key="column.field" class="dv-card-item">
        <span class="dv-card-label">{{ column.title }}</span>
        <span class="dv-card-value">{{ row[column.field] }}</span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.dv-cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.dv-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}

.dv-card-item {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0;
}

.dv-card-label {
  color: var(--color-text-secondary);
}
</style>
