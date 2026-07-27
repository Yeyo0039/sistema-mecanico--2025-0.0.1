// selectLoader.ts

import { getCategorias } from '@/modules/inventario/services/categorias.service'

export async function loadSelectOptions(id: string) {
  console.log('cargando datos del select :', id)
  switch (id) {
    case 'categoria':
      const cat = await getCategorias()
      console.log(cat)
      return cat
    case 'marcas':
      return

    case 'compatibilidades':
      return

    default:
      return []
  }
}
