<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import Toolbar from '@/components/DataViews/Toolbar.vue'
import DataView from '@/components/DataViews/DataView.vue'

import { getCategorias, type Categoria } from './services/categorias.service'
import { getProductos, type Producto } from './services/productos.service'
import type { ToolbarConfig, ToolbarFilter } from '@/components/DataViews/DataViewToolbar.types'

const productos = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])

const currentView = ref<'table' | 'cards'>('table')
const loading = ref(false)

//----------------------------------
// CONFIG FILTERS
//----------------------------------

const filters = computed<ToolbarFilter[]>(() => [
  {
    id: 'categoria',
    type: 'select',
    label: 'Categoría',
    items: categorias.value.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })),
  },
])

//----------------------------------
// CONFIG TOOLBAR
//----------------------------------

const toolbarConfig = computed<ToolbarConfig>(() => ({
  title: 'Inventario',

  search: true,

  actions: [
    {
      id: 'create-product',
      label: 'Agregar producto',
      icon: 'add',
    },
  ],

  filters: filters.value,

  views: ['table', 'cards'],
}))

//----------------------------------
// CONFIG DATAVIEW
//----------------------------------

const columns = computed(() => [
  {
    field: 'codigo',
    title: 'Código',
  },

  {
    field: 'nombre',
    title: 'Nombre',
  },

  {
    field: 'categoria',
    title: 'Categoría',
  },

  {
    field: 'marca',
    title: 'Marca',
  },

  {
    field: 'precio',
    title: 'Precio',
  },

  {
    field: 'stock',
    title: 'Stock',
  },
])

//----------------------------------
// EVENTOS DEL TOOLBAR
//----------------------------------

function handleSearch(value: string) {
  console.log('SEARCH:', value)
}

function handleFilter(filter: unknown) {
  console.log('FILTER:', filter)
}

function handleAction(action: unknown) {
  console.log('ACTION:', action)
}

function handleView(view: string) {
  console.log('VIEW:', view)

  currentView.value = view as 'table' | 'cards'
}

//----------------------------------
// DATA
//----------------------------------

async function loadData() {
  loading.value = true

  try {
    categorias.value = await getCategorias()
    productos.value = await getProductos()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <section class="inventory-view">
    <Toolbar
      :config="toolbarConfig"
      @search="handleSearch"
      @filter="handleFilter"
      @action="handleAction"
      @view="handleView"
    />

    <p v-if="loading">Cargando inventario...</p>

    <DataView
      v-else
      :rows="productos"
      :columns="columns"
      :view="currentView"
      :pagination="true"
      :page-size="20"
    />
  </section>
</template>

<style scoped>
.inventory-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
