<script setup lang="ts">
import type { Categoria } from '../services/categorias.service'

defineProps<{
  categorias: Categoria[]
  categoriaSeleccionada: number | null
  loading?: boolean
}>()

const emit = defineEmits<{
  seleccionar: [id: number | null]
}>()
</script>

<template>
  <div class="filters" aria-label="Filtrar inventario por categoría">
    <button
      type="button"
      class="category-filter"
      :class="{ active: categoriaSeleccionada === null }"
      :disabled="loading"
      @click="emit('seleccionar', null)"
    >
      <span class="material-symbols-rounded">apps</span>
      Todos
    </button>

    <button
      v-for="categoria in categorias"
      :key="categoria.id"
      type="button"
      class="category-filter"
      :class="{ active: categoriaSeleccionada === categoria.id }"
      :style="{ '--category-color': categoria.color || '#2563eb' }"
      :disabled="loading"
      @click="emit('seleccionar', categoria.id)"
    >
      <span class="material-symbols-rounded">{{ categoria.icono || 'category' }}</span>
      {{ categoria.nombre }}
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.category-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}
.category-filter:hover:not(:disabled),
.category-filter.active {
  border-color: var(--category-color, var(--color-primary));
  background: color-mix(in srgb, var(--category-color, var(--color-primary)) 18%, transparent);
}
.category-filter:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
