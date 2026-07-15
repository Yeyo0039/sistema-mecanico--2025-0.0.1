<script setup lang="ts">
import { computed, reactive } from 'vue'

import TableView from './views/TableView.vue'
import CardView from './views/CardView.vue'
import CompactView from './views/CompactView.vue'
import Pagination from './Pagination.vue'

import type { ToolbarView } from './DataViewToolbar.types.ts'

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },

  rows: {
    type: Array,
    default: () => [],
  },

  view: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['action'])

const ui = reactive({
  page: 1,

  currentView: props.config.defaultView ?? 'table',
})

const currentView = computed<ToolbarView>(() => {
  return (props.view ?? ui.currentView) as ToolbarView
})

const pageSize = computed(() => {
  return props.config.pageSize ?? 20
})

const totalRows = computed(() => {
  return props.rows.length
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalRows.value / pageSize.value))
})

const visibleRows = computed(() => {
  const start = (ui.page - 1) * pageSize.value

  return props.rows.slice(start, start + pageSize.value)
})

function changePage(page: number) {
  ui.page = page
}

function executeAction(action: any, row: any) {
  emit('action', {
    action,
    row,
  })
}
</script>

<template>
  <div class="dv">
    <TableView
      v-if="currentView === 'table'"
      :rows="visibleRows"
      :columns="config.columns ?? []"
      @action="executeAction"
    />

    <CardView
      v-else-if="currentView === 'cards'"
      :rows="visibleRows"
      :columns="config.columns ?? []"
      @action="executeAction"
    />

    <CompactView
      v-else
      :rows="visibleRows"
      :columns="config.columns ?? []"
      @action="executeAction"
    />

    <Pagination v-if="config.pagination" :page="ui.page" :pages="totalPages" @change="changePage" />
  </div>
</template>

<style scoped>
.dv {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
