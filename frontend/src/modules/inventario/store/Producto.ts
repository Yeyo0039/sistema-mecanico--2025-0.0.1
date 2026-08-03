import { inventorySchema } from '@/components/forms/schemas/inventory.schema'
import { validateSchema } from '@/composables/utils/schemaValidator'
import { apiFetch } from '@/services/apiFetch'

// crear producto del formulario
export async function GuardarProd(data: unknown) {
  console.log('datos consegidos', data)
  const errors = validateSchema(inventorySchema, data)
  if (Object.keys(errors).length > 0) {
    console.error('Errores de validación:', errors)
    return errors
  } else {
    console.log('Datos válidos, procediendo a guardar el producto...', data)
    return apiFetch('/api/inventario/productos/_crear', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}
