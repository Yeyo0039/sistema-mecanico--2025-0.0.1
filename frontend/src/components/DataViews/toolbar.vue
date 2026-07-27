<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { ref, watch } from 'vue'

import type {
  ToolbarAction,
  ToolbarConfig,
  ToolbarFilter,
  ToolbarFilterPayload,
  ToolbarView,
} from './DataViewToolbar.types'

const searchValue = ref('')

const props = defineProps<{
  config: ToolbarConfig
}>()

const emit = defineEmits<{
  search: [value: string]
  action: [action: ToolbarAction]
  filter: [payload: ToolbarFilterPayload]
  view: [view: ToolbarView]
}>()

function emitEvent(event: 'search' | 'action' | 'filter' | 'view', payload: unknown) {
  switch (event) {
    case 'search':
      emit('search', payload as string)
      break

    case 'action':
      emit('action', payload as ToolbarAction)
      break

    case 'filter':
      emit('filter', payload as ToolbarFilterPayload)
      break

    case 'view':
      emit('view', payload as ToolbarView)
      break
  }
}

watch(searchValue, (value) => {
  emitEvent('search', value)
})

function emitAction(action: ToolbarAction) {
  emitEvent('action', action)
}

function emitFilter(filter: ToolbarFilter, value: string | number | boolean | null) {
  emitEvent('filter', {
    id: filter.id,
    value,
  })
}

function emitView(view: ToolbarView) {
  emitEvent('view', view)
}
</script>

<template>
  <section class="toolbar">
    <h2 v-if="config.title" class="toolbar-title">
      {{ config.title }}
    </h2>

    <BaseInput
      v-if="config.search"
      v-model="searchValue"
      class="toolbar-search"
      label="Buscar"
      type="text"
      placeholder="Buscar..."
    />

    <div v-if="config.filters?.length" class="toolbar-filters">
      <div v-for="filter in config.filters" :key="filter.id" class="toolbar-filter">
        <label>
          {{ filter.label }}
        </label>

        <select
          v-if="filter.type === 'select'"
          class="toolbar-input"
          @change="emitFilter(filter, ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">Seleccione...</option>

          <option v-for="item in filter.items" :key="String(item.value)" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <input
          v-else
          class="toolbar-input"
          :type="filter.type"
          @input="
            emitFilter(
              filter,
              filter.type === 'number'
                ? Number(($event.target as HTMLInputElement).value)
                : ($event.target as HTMLInputElement).value,
            )
          "
        />
      </div>
    </div>

    <div v-if="config.actions?.length" class="toolbar-actions">
      <BaseButton
        v-for="action in config.actions"
        :key="action.id"
        :text="action.label"
        :icon="action.icon"
        @click="emitAction(action)"
      />
    </div>

    <div v-if="config.views?.length" class="toolbar-views">
      <BaseButton
        v-for="view in config.views"
        :key="view"
        :text="view"
        variant="secondary"
        @click="emitView(view)"
      />
    </div>
  </section>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;

  width: 100%;
  align-content: center;
  padding: 1rem;

  background: var(--color-surface, #fff);

  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

/* titulo */

.toolbar-title {
  margin: 0;

  white-space: nowrap;

  font-size: 1.25rem;

  font-weight: 700;
}

/* buscador */

.toolbar-search {
  flex: 1;

  max-width: 420px;
}

/* filtros */

.toolbar-filters {
  display: flex;

  gap: 0.75rem;

  align-items: center;

  flex: 1;
}

.toolbar-filter {
  min-width: 180px;
}

/* etiquetas */

.toolbar-filter label {
  display: none;
}

/* inputs */

.toolbar-input {
  height: 38px;

  width: 100%;

  padding: 0 0.75rem;

  border-radius: 8px;

  border: 1px solid #0c37f5;

  background: white;

  font-size: 0.9rem;

  outline: none;
}

.toolbar-input:focus {
  border-color: #2563eb;
}

/* botones */

.toolbar-actions {
  display: flex;

  gap: 0.5rem;
}

.toolbar-views {
  display: flex;

  gap: 0.5rem;
}

@media (max-width: 900px) {
  .toolbar {
    flex-wrap: wrap;
  }

  .toolbar-search,
  .toolbar-filters {
    width: 100%;
  }

  .toolbar-filters {
    flex-wrap: wrap;
  }
}
</style>
