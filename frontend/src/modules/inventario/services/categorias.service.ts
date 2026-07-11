import { apiFetch } from '@/services/apiFetch'

// Datos visuales que vienen directamente de la tabla categorias.
export type Categoria = {
  id: number
  nombre: string
  descripcion: string | null
  icono: string | null
  color: string | null
  orden: number
}

export async function getCategorias(signal?: AbortSignal): Promise<Categoria[]> {
  const response = await apiFetch<Categoria[]>('/api/categorias', { signal })
  return response.data
}
