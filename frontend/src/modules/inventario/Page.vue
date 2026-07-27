<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import Toolbar from '@/components/DataViews/toolbar.vue'
import DataView from '@/components/DataViews/DataView.vue'

import ProductForm from '@/components/forms/productForm.vue'

import { getCategorias, type Categoria } from './services/categorias.service'

import {
  getProductos,
  handleSearch,
  handleFilter,
  productoRows,
  loading,
  reloadProductos,
} from './services/productos.service'

import type {
  ToolbarConfig,
  ToolbarFilter,
  ToolbarAction,
} from '@/components/DataViews/DataViewToolbar.types'

//----------------------------------------------------
// STATE
//----------------------------------------------------

const categorias = ref<Categoria[]>([])

const currentView = ref<'table' | 'cards'>('table')

const mode = ref<'list' | 'form'>('list')

//----------------------------------------------------
// FILTERS
//----------------------------------------------------

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

//----------------------------------------------------
// TOOLBAR CONFIG
//----------------------------------------------------

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

//----------------------------------------------------
// DATAVIEW
//----------------------------------------------------

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

//----------------------------------------------------
// TOOLBAR EVENTS
//----------------------------------------------------

function handleView(view: string) {
  console.log('VIEW:', view)

  currentView.value = view as 'table' | 'cards'
}

function onToolbarAction(action: ToolbarAction) {
  switch (action.id) {
    case 'create-product':
      mode.value = 'form'
      break

    default:
      mode.value = 'list'

      break
  }
}

//----------------------------------------------------
// FORM EVENTS
//----------------------------------------------------

function closeForm() {
  mode.value = 'list'
}

//----------------------------------------------------
// LOAD DATA
//----------------------------------------------------

async function loadData() {
  loading.value = true

  try {
    categorias.value = await getCategorias()

    await getProductos()
  } finally {
    loading.value = false
    mode.value = 'list'
  }
}

onMounted(reloadProductos)
</script>

<template>
  <!-- LISTADO -->

  <section v-if="mode === 'list'" class="inventory-view">
    <Toolbar
      :config="toolbarConfig"
      @search="handleSearch"
      @filter="handleFilter"
      @action="onToolbarAction"
      @view="handleView"
    />

    <p v-if="loading">Cargando inventario...</p>

    <DataView
      v-else
      :rows="productoRows"
      :columns="columns"
      :view="currentView"
      :pagination="true"
      :page-size="20"
    />
  </section>

  <!-- FORMULARIO -->

  <section v-else class="inventory-form">
    <ProductForm />

    <button class="back-button" @click="closeForm">Volver al inventario</button>
  </section>
</template>

<style scoped>
.inventory-view,
.inventory-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-button {
  align-self: flex-start;
}
</style>
