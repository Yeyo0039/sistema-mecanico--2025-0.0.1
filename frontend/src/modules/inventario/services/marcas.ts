import { apiFetch } from '@/services/apiFetch'

export type Marca = {
  id: number
  nombre: string
  descripcion: string | null
  icono: string | null
}

export async function getMarcas(signal?: AbortSignal): Promise<Marca[]> {
  const response = await apiFetch<Marca[]>('/api/inventario/marcas', { signal })
  return response.data
}
