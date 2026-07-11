<script setup lang="ts">
import Toolbar from './Toolbar.vue'
import TableView from './views/TableView.vue'
import CardView from './views/CardView.vue'
import CompactView from './views/CompactView.vue'
import Pagination from './Pagination.vue'
import { computed, reactive, onMounted, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },

  rows: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['action', 'selection-change'])

const ui = reactive({
  page: 1,

  pageSize: 20,

  search: '',

  filters: {},

  sort: null,

  mode: props.config.mode ?? 'table',
})

watch(
  () => props.config.mode,
  (value) => {
    if (value) {
      ui.mode = value
    }
  },
)

const filteredRows = computed(() => {
  let data = [...props.rows]

  if (ui.search) {
    const value = ui.search.toLowerCase()

    data = data.filter((row) =>
      JSON.stringify(row)

        .toLowerCase()

        .includes(value),
    )
  }

  // filtros personalizados
  // próximamente

  // ordenamiento
  // próximamente

  return data
})

const totalRows = computed(() => filteredRows.value.length)

const totalPages = computed(() => {
  return Math.max(
    1,

    Math.ceil(totalRows.value / ui.pageSize),
  )
})

const visibleRows = computed(() => {
  const start = (ui.page - 1) * ui.pageSize

  return filteredRows.value.slice(
    start,

    start + ui.pageSize,
  )
})

const viewContext = computed(() => ({
  config: props.config,

  rows: visibleRows.value,

  columns: props.config.columns ?? [],

  actions: props.config.actions ?? [],

  filters: ui.filters,

  sort: ui.sort,

  page: ui.page,

  pageSize: ui.pageSize,

  totalRows: totalRows.value,
}))

function changePage(page: number) {
  ui.page = page
}

function onSearch(value: string) {
  ui.search = value

  ui.page = 1
}

function onFilter(filters: any) {
  ui.filters = filters

  ui.page = 1
}

function executeAction(action: any, row: any) {
  if (action.callback) {
    action.callback(row)
  }

  emit('action', {
    action,

    row,
  })
}
</script>

<template>
  <div class="dv">
    <Toolbar
      v-if="config.toolbar"
      :config="config"
      :search="ui.search"
      :filters="ui.filters"
      @search="onSearch"
      @filter="onFilter"
    />

    <TableView v-if="ui.mode === 'table'" :rows="visibleRows" :columns="config.columns ?? []" @action="executeAction" />

    <CardView v-else-if="ui.mode === 'cards'" :rows="visibleRows" :columns="config.columns ?? []" @action="executeAction" />

    <CompactView v-else :rows="visibleRows" :columns="config.columns ?? []" @action="executeAction" />

    <Pagination v-if="config.pagination" :page="ui.page" :pages="totalPages" @change="changePage" />
  </div>
</template>
