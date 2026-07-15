import { inventorySchema } from '@/components/forms/schemas/inventory.schema'
import { apiFetch } from '@/services/apiFetch'

// Tipo que usa la UI. Agrega aquí cada nueva columna que entregue el backend.
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

/**
 * Obtiene productos del backend.
 * signal cancela fetch cuando Vue desmonta Inventario.
 * apiFetch muestra errores automáticamente y devuelve response.data.
 *
 * Uso:
 * const controller = new AbortController()
 * rows.value = await getProductos(controller.signal)
 * onBeforeUnmount(() => controller.abort())
 */
export async function getProductos(
  filters: { categoriaId?: number | null; search?: string } = {},
  signal?: AbortSignal,
): Promise<Producto[]> {
  // GET no activa notifySuccess para no saturar alertas al cargar la tabla.
  const params = new URLSearchParams()
  if (filters.categoriaId) params.set('categoriaId', String(filters.categoriaId))
  if (filters.search?.trim()) params.set('search', filters.search.trim())

  const query = params.toString()
  const response = await apiFetch<Producto[]>(`/api/productos${query ? `?${query}` : ''}`, {
    signal,
  })
  return response.data
}

export function crearProductos() {}
