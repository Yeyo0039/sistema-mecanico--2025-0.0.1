import { inventorySchema } from '@/components/forms/schemas/inventory.schema'
import { validateSchema } from '@/composables/utils/schemaValidator'
import { apiFetch } from '@/services/apiFetch'
import { buildProductPayload, type ProductPayload } from '@/composables/utils/product.validator'

// crear producto del formulario
export async function GuardarProd(data: unknown) {
  const normalizedData = buildProductPayload(data as Partial<ProductPayload>)

  console.log('datos consegidos', normalizedData)
  const errors = validateSchema(inventorySchema, normalizedData)
  if (Object.keys(errors).length > 0) {
    console.error('Errores de validación:', errors)
    return errors
  }

  console.log('Datos válidos, procediendo a guardar el producto...', normalizedData)
  return apiFetch('/api/inventario/productos/_crear', {
    method: 'POST',
    body: JSON.stringify(normalizedData),
  })
}
