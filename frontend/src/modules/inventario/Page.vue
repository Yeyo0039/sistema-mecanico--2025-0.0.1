<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DataView from '@/components/DataViews/DataView.vue'
import InventoryFilters from './components/inventoryFilters.vue'
import { getCategorias, type Categoria } from './services/categorias.service'
import { getProductos, type Producto } from './services/productos.service'

const rows = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])
const categoriaSeleccionada = ref<number | null>(null)
const loading = ref(false)
let controller: AbortController | undefined
let categoriesController: AbortController | undefined

const config = {
  title: 'Inventario',
  mode: 'table',
  toolbar: true,
  pagination: true,
  columns: [
    { field: 'codigo', title: 'Código' },
    { field: 'nombre', title: 'Nombre' },
    { field: 'categoria', title: 'Categoría' },
    { field: 'marca', title: 'Marca' },
    { field: 'precio', title: 'Precio' },
    { field: 'stock', title: 'Stock' },
  ],
}

async function loadProductos() {
  controller?.abort()
  const currentController = new AbortController()
  controller = currentController
  loading.value = true

  try {
    rows.value = await getProductos(
      { categoriaId: categoriaSeleccionada.value },
      currentController.signal,
    )
  } catch (error) {
    if ((error as Error).name !== 'AbortError') rows.value = []
  } finally {
    // Una solicitud anterior no puede terminar la carga de una solicitud más nueva.
    if (controller === currentController) loading.value = false
  }
}

function seleccionarCategoria(id: number | null) {
  categoriaSeleccionada.value = id
  void loadProductos()
}

onMounted(async () => {
  categoriesController = new AbortController()
  try {
    categorias.value = await getCategorias(categoriesController.signal)
  } catch (error) {
    if ((error as Error).name !== 'AbortError') categorias.value = []
  }

  await loadProductos()
})

onBeforeUnmount(() => {
  controller?.abort()
  categoriesController?.abort()
  rows.value = []
  categorias.value = []
})
</script>

<template>
  <section class="inventory-view">
    <InventoryFilters
      :categorias="categorias"
      :categoria-seleccionada="categoriaSeleccionada"
      :loading="loading"
      @seleccionar="seleccionarCategoria"
    />
    <p v-if="loading" class="loading">Cargando inventario...</p>
    <DataView v-else :config="config" :rows="rows" />
  </section>
</template>

<style scoped>
.inventory-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
