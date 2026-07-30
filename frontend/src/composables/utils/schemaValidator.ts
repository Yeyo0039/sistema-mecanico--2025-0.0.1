import { productModel } from '@/components/forms/productForm.vue'
import type { FormSection } from '@/types/forms'

export function validateSchema(schema: FormSection[], model: any) {
  const errors: Record<string, string> = {}
  for (const section of schema) {
    for (const field of section.fields) {
      const value = model[field.name]
      if (field.required) {
        if (!value) {
          errors[field.name] = `${field.label} es obligatorio`
        }
      }
    }
  }
}
