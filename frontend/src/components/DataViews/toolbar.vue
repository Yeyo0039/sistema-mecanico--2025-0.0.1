<script setup lang="ts">
import { ref, watch } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

import type {
  ToolbarAction,
  ToolbarConfig,
  ToolbarFilterPayload,
  ToolbarView,
} from './DataViewToolbar.types'

/*
--------------------------------------------------------
STATE
--------------------------------------------------------
*/

const searchValue = ref('')

/*
--------------------------------------------------------
PROPS
--------------------------------------------------------
*/

const props = defineProps<{
  config: ToolbarConfig
}>()

/*
--------------------------------------------------------
EMITS
--------------------------------------------------------
*/

const emit = defineEmits<{
  search: [value: string]
  action: [action: ToolbarAction]
  filter: [payload: ToolbarFilterPayload]
  view: [view: ToolbarView]
}>()

/*
--------------------------------------------------------
SEARCH
--------------------------------------------------------
*/

watch(searchValue, (value) => {
  emit('search', value)
})

/*
--------------------------------------------------------
EMITTERS
--------------------------------------------------------
*/

function emitAction(action: ToolbarAction) {
  emit('action', action)
}

function emitFilter(id: string, value: string | number | boolean | null | Array<string | number>) {
  emit('filter', {
    id,
    value,
  })
}

function emitView(view: ToolbarView) {
  emit('view', view)
}

function handleInputFilter(id: string, type: string, event: Event) {
  const value = (event.target as HTMLInputElement).value

  emitFilter(id, type === 'number' ? Number(value) : value)
}
</script>

<template>
  <section class="toolbar">
    <!-- TÍTULO -->

    <h2 v-if="config.title" class="toolbar-title">
      {{ config.title }}
    </h2>

    <!-- BUSCADOR -->

    <BaseInput
      v-if="config.search"
      v-model="searchValue"
      class="toolbar-search"
      label="Buscar"
      type="text"
      placeholder="Buscar..."
    />

    <!-- FILTROS -->

    <div v-if="config.filters?.length" class="toolbar-filters">
      <div v-for="filter in config.filters" :key="filter.id" class="toolbar-filter">
        <!-- SELECT -->

        <BaseSelect
          v-if="filter.type === 'select'"
          :id="filter.id"
          :label="filter.label"
          :options="filter.items ?? []"
          @update:model-value="(value) => emitFilter(filter.id, value)"
        />

        <!-- INPUT -->

        <input
          v-else
          class="toolbar-input"
          :type="filter.type"
          @input="handleInputFilter(filter.id, filter.type, $event)"
        />
      </div>
    </div>

    <!-- ACCIONES -->

    <div v-if="config.actions?.length" class="toolbar-actions">
      <BaseButton
        v-for="action in config.actions"
        :key="action.id"
        :text="action.label"
        :icon="action.icon"
        @click="emitAction(action)"
      />
    </div>

    <!-- VISTAS -->

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
  padding: 1rem;

  background: var(--color-surface, #fff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.toolbar-title {
  margin: 0;
  white-space: nowrap;
  font-size: 1.25rem;
  font-weight: 700;
}

.toolbar-search {
  flex: 1;
  max-width: 420px;
}

.toolbar-filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex: 1;
}

.toolbar-filter {
  min-width: 180px;
}

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

.toolbar-actions,
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
