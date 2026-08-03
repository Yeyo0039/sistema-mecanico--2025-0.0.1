import type { ToolbarFilterPayload } from '@/components/DataViews/DataViewToolbar.types'
import { apiFetch } from '@/services/apiFetch'
import { reactive } from 'vue'
import { ref } from 'vue'
/*
|--------------------------------------------------------------------------
| PRODUCTO
|--------------------------------------------------------------------------
*/

export type Producto = {
  id: number
  nombre: string
  codigo: string

  descripcion?: string | null

  categoria_id: number | null
  categoria: string | null
  categoria_icono: string | null
  categoria_color: string | null

  marca: string | null

  precio: number | string
  stock: number | string
}

/*
|--------------------------------------------------------------------------
| FILTROS DEL INVENTARIO
|--------------------------------------------------------------------------
|
| Todos los filtros empiezan vacíos.
| El Toolbar solamente actualiza estos valores.
|
*/

export type ProductoFilters = {
  search: string | null
  categoriaId: number | null
  marca: string | null
  stock: number | null
  precioMin: number | null
  precioMax: number | null
}

/*
|--------------------------------------------------------------------------
| ESTADO INICIAL
|--------------------------------------------------------------------------
*/

export const productoFilters: ProductoFilters = reactive({
  search: null,
  categoriaId: null,
  marca: null,
  stock: null,
  precioMin: null,
  precioMax: null,
})
export const productoRows = ref<Producto[]>([])

export const loading = ref(false)

export async function reloadProductos(signal?: AbortSignal) {
  loading.value = true

  try {
    productoRows.value = await getProductos(productoFilters, signal)
  } finally {
    loading.value = false
  }
}
/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
|
| Se ejecuta cuando el Toolbar emite:
|
| emit('search', 'aceite')
|
*/

export async function handleSearch(value: string) {
  productoFilters.search = value || null

  await reloadProductos()
}
/*
|--------------------------------------------------------------------------
| FILTERS
|--------------------------------------------------------------------------
|
| El Toolbar emite:
|
| {
|   id:'categoria',
|   value:3
| }
|
*/

export async function handleFilter(filter: ToolbarFilterPayload) {
  switch (filter.id) {
    case 'categoria':
      productoFilters.categoriaId = Number(filter.value) || null
      break

    case 'marca':
      productoFilters.marca = String(filter.value || '') || null
      break

    case 'stock':
      productoFilters.stock = Number(filter.value) || null
      break

    case 'precioMin':
      productoFilters.precioMin = Number(filter.value) || null
      break

    case 'precioMax':
      productoFilters.precioMax = Number(filter.value) || null
      break
  }

  await reloadProductos()
}
/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/
type ToolbarAction = {
  id: string
  label: string
  icon?: string
}

export function handleAction(action: ToolbarAction) {
  switch (action.id) {
    case 'create-product':
      console.log('Crear producto')

      break

    case 'delete-product':
      console.log('Eliminar producto')

      break

    default:
      break
  }
}

/*
|--------------------------------------------------------------------------
| GET PRODUCTOS
|--------------------------------------------------------------------------
|
| Construye automáticamente la URL dependiendo de
| los filtros activos.
|
*/

export async function getProductos(
  filters: ProductoFilters = productoFilters,
  signal?: AbortSignal,
): Promise<Producto[]> {
  const params = new URLSearchParams()

  /*
  -----------------------------------
  SEARCH
  -----------------------------------
  */

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  /*
  -----------------------------------
  CATEGORIA
  -----------------------------------
  */

  if (filters.categoriaId) {
    params.set('categoriaId', String(filters.categoriaId))
  }

  /*
  -----------------------------------
  QUERY STRING
  -----------------------------------
  */

  const query = params.toString()

  const response = await apiFetch<Producto[]>(
    `/api/inventario/productos${query ? `?${query}` : ''}`,
    {
      signal,
    },
  )
  console.log(response)
  return response.data
}
