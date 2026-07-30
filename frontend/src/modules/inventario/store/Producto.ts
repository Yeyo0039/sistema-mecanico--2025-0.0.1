import { inventorySchema } from '@/components/forms/schemas/inventory.schema'
import { validateSchema } from '@/composables/utils/schemaValidator'

// crear producto del formulario
export function GuardarProd(data: unknown) {
  console.log('datos consegidos', data)
  validateSchema(inventorySchema, data)
}
