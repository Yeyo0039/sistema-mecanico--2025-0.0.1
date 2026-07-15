<script setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  pages: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div v-if="props.pages > 1" class="dv-pagination">
    <button
      v-for="pageNumber in props.pages"
      :key="pageNumber"
      type="button"
      class="dv-page"
      :class="{ active: pageNumber === props.page }"
      @click="emit('change', pageNumber)"
    >
      {{ pageNumber }}
    </button>
  </div>
</template>

<style scoped>
.dv-pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.dv-page {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  cursor: pointer;
  color: white;
}

.dv-page.active {
  background: var(--color-primary);
  color: white;
}
</style>
