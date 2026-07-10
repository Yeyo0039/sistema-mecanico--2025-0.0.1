<script setup>
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  search: {
    type: String,
    default: '',
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['search', 'filter'])
</script>

<template>
  <div class="dv-toolbar">
    <input
      :value="props.search"
      class="dv-search"
      placeholder="Buscar..."
      @input="emit('search', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.dv-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.dv-search {
  width: min(320px, 100%);
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
}
</style>
