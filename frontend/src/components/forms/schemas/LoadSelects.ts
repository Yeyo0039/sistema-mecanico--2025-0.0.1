// selectLoader.ts

import { getCategorias } from '@/modules/inventario/services/categorias.service'

/*
--------------------------------------------------------
CACHE
--------------------------------------------------------
*/

type SelectCache<T> = {
  data: T[]
  time: number
}

const CACHE_TIME = 15 * 60 * 1000 // 15 minutos

const cache = new Map<string, SelectCache<unknown>>()

/*
--------------------------------------------------------
HELPERS
--------------------------------------------------------
*/

function isValidCache(item: SelectCache<unknown>): boolean {
  return Date.now() - item.time < CACHE_TIME
}

function saveCache<T>(id: string, data: T[]): void {
  cache.set(id, {
    data,
    time: Date.now(),
  })
}

function getCache<T>(id: string): T[] | null {
  const item = cache.get(id)

  if (!item) {
    return null
  }

  if (!isValidCache(item)) {
    cache.delete(id)
    return null
  }

  return item.data as T[]
}

/*
--------------------------------------------------------
SELECT LOADER
--------------------------------------------------------
*/

export async function loadSelectOptions(id: string) {
  console.log('cargando datos del select:', id)

  const cached = getCache(id)

  if (cached) {
    console.log('cache encontrado')

    return cached
  }

  switch (id) {
    case 'categoria': {
      const data = await getCategorias()

      saveCache(id, data)

      return data
    }

    default:
      return []
  }
}
