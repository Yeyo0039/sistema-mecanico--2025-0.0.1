<script setup lang="ts">
import { computed, reactive } from 'vue'

import TableView from './views/TableView.vue'
import CardView from './views/CardView.vue'
import CompactView from './views/CompactView.vue'
import Pagination from './Pagination.vue'

import type { ToolbarView } from './DataViewToolbar.types.ts'

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },

  columns: {
    type: Array,
    default: () => [],
  },

  view: {
    type: String,
    default: 'table',
  },

  pagination: {
    type: Boolean,
    default: false,
  },

  pageSize: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['action', 'select-row'])

const ui = reactive({
  page: 1,

  currentView: props.view ?? 'table',
})

const currentView = computed<ToolbarView>(() => {
  return (props.view ?? ui.currentView) as ToolbarView
})

const pageSize = computed(() => {
  return props.pageSize ?? 20
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
  console.log(emit)
}

function handleRowSelect(row: any) {
  emit('select-row', row)
}
</script>

<template>
  <div class="dv">
    <TableView
      v-if="currentView === 'table'"
      :rows="visibleRows"
      :columns="props.columns ?? []"
      @action="executeAction"
      @select-row="handleRowSelect"
    />

    <CardView
      v-else-if="currentView === 'cards'"
      :rows="visibleRows"
      :columns="props.columns ?? []"
      @action="executeAction"
      @select-row="handleRowSelect"
    />

    <CompactView
      v-else
      :rows="visibleRows"
      :columns="props.columns ?? []"
      @action="executeAction"
      @select-row="handleRowSelect"
    />

    <Pagination v-if="props.pagination" :page="ui.page" :pages="totalPages" @change="changePage" />
  </div>
</template>

<style scoped>
.dv {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
