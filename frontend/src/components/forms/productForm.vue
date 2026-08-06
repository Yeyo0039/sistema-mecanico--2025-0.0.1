<script setup lang="ts">
import BaseForm from './baseForm.vue'
import { inventorySchema } from './schemas/inventory.schema'
import BaseButton from '../ui/BaseButton.vue'
import { reactive, toRaw, watch } from 'vue'
import { GuardarProd } from '../../modules/inventario/store/Producto.ts'
import { validateSchema } from '@/composables/utils/schemaValidator'

const props = defineProps<{
  initialProduct?: Record<string, unknown> | null
}>()

// Modelo Reactivo del formulario.
// Se mantiene separado del objeto de errores para permitir
// una validación y renderizado claro de los mensajes.
type ProductModel = {
  codigo: string
  referencia_interna: string
  nombre: string
  marca: string
  categoria: string | number | null
  compatibilidad: unknown[]
  detalles: string
  imagen: File | string | null
  stock: number | null
  stock_maximo: number | null
  ubicacion: string
  stock_minimo: number | null
  precio_compra: number | null
  precioVenta: number | null
  proveedor: string
  activo: string | number | null
}

const productModel = reactive<ProductModel>({
  codigo: '',
  referencia_interna: '',
  nombre: '',
  marca: '',
  categoria: null,
  compatibilidad: [],
  detalles: '',
  imagen: null,
  stock: null,
  stock_maximo: null,
  ubicacion: '',
  stock_minimo: null,
  precio_compra: null,
  precioVenta: null,
  proveedor: '',
  activo: '1',
})

// Objeto de errores uniforme para todos los campos del schema.
// Todos los valores son strings para que los componentes de entrada
// puedan mostrar mensajes y estilos de error de forma consistente.
const errors = reactive({
  codigo: '',
  referencia_interna: '',
  nombre: '',
  marca: '',
  categoria: '',
  compatibilidad: '',
  detalles: '',
  imagen: '',
  stock: '',
  stock_maximo: '',
  ubicacion: '',
  stock_minimo: '',
  precio_compra: '',
  precioVenta: '',
})

function resetProductModel() {
  productModel.codigo = ''
  productModel.referencia_interna = ''
  productModel.nombre = ''
  productModel.marca = ''
  productModel.categoria = null
  productModel.compatibilidad = []
  productModel.detalles = ''
  productModel.imagen = null
  productModel.stock = null
  productModel.stock_maximo = null
  productModel.ubicacion = ''
  productModel.stock_minimo = null
  productModel.precio_compra = null
  productModel.precioVenta = null
}

function formatInternalCode(id: unknown, code: unknown): string {
  if (typeof id === 'number' && Number.isFinite(id)) {
    return `inv-${String(id).padStart(5, '0')}`
  }

  if (typeof id === 'string') {
    const digits = id.trim()
    if (/^\d+$/.test(digits)) {
      return `inv-${digits.padStart(5, '0')}`
    }
  }

  return normalizeString(code)
}

function setProductModel(product: Record<string, unknown>) {
  productModel.codigo = formatInternalCode(
    product.id ?? product.codigo ?? null,
    product.codigo ?? '',
  )
  productModel.referencia_interna = String(product.referencia_interna ?? '')
  productModel.nombre = String(product.nombre ?? '')
  productModel.marca = String(product.marca ?? '')

  const categoriaValue = product.categoria ?? product.categoria_id ?? null
  productModel.categoria =
    typeof categoriaValue === 'string' || typeof categoriaValue === 'number' ? categoriaValue : null

  productModel.compatibilidad = Array.isArray(product.compatibilidad) ? product.compatibilidad : []

  productModel.detalles = String(product.detalles ?? '')

  const imagenValue = product.imagen ?? null
  productModel.imagen =
    typeof imagenValue === 'string' || imagenValue instanceof File ? imagenValue : null

  const stockValue =
    typeof product.stock === 'number' ? product.stock : Number(product.stock ?? NaN)
  productModel.stock = Number.isNaN(stockValue) ? null : stockValue

  const stockMaximoValue =
    typeof product.stock_maximo === 'number'
      ? product.stock_maximo
      : Number(product.stock_maximo ?? NaN)
  productModel.stock_maximo = Number.isNaN(stockMaximoValue) ? null : stockMaximoValue

  productModel.ubicacion = String(product.ubicacion ?? '')

  const stockMinimoValue =
    typeof product.stock_minimo === 'number'
      ? product.stock_minimo
      : Number(product.stock_minimo ?? NaN)
  productModel.stock_minimo = Number.isNaN(stockMinimoValue) ? null : stockMinimoValue

  const precioCompraValue =
    typeof product.precio_compra === 'number'
      ? product.precio_compra
      : Number(product.precio_compra ?? NaN)
  productModel.precio_compra = Number.isNaN(precioCompraValue) ? null : precioCompraValue

  const precioVentaValue =
    typeof product.precioVenta === 'number'
      ? product.precioVenta
      : typeof product.precio === 'number'
        ? product.precio
        : Number(product.precioVenta ?? product.precio ?? NaN)
  productModel.precioVenta = Number.isNaN(precioVentaValue) ? null : precioVentaValue
}

watch(
  () => props.initialProduct,
  (product) => {
    if (product) {
      setProductModel(product)
      return
    }

    resetProductModel()
  },
  { immediate: true },
)

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

async function ProductoForm() {
  clearErrors()

  const data = structuredClone(toRaw(productModel))

  // Validación local antes de enviar los datos al servicio.
  // validateSchema devuelve un objeto con mensajes por campo.
  const validationErrors = validateSchema(inventorySchema, data)
  Object.assign(errors, validationErrors)

  if (Object.keys(validationErrors).length > 0) {
    console.log('Errores de validación:', validationErrors)
    return
  }

  const result = await GuardarProd(data)

  if (result && Object.keys(result).length > 0) {
    Object.assign(errors, result)
    console.log('Errores devueltos por el servicio:', result)
    return
  }

  console.log('Producto validado y listo para guardar')
}
</script>
<template>
  <!--
    BaseForm recibe el schema y el modelo reactivo.
    errors se pasa para que cada campo pueda leer su mensaje
    y marcar visualmente el input cuando la validación falla.
  -->
  <BaseForm :schema="inventorySchema" :model="productModel" :errors="errors" />
  <BaseButton
    type="button"
    variant="primary"
    size="md"
    icon="+"
    text="Guardar"
    @click="ProductoForm"
  />
</template>
<style>
#field-image {
  min-height: 300px;
}

#field-nombre {
  grid-column: span 2;
}

#field-compatibilidad {
  grid-column: span 4;
}

#field-detalles {
  grid-column: span 4;
}
#section-informacion-general {
  background: white;
  padding: 30px;
  border-radius: 25px;
}

#section-inventario {
  background: #f8fafc;
  padding: 30px;
  border-radius: 25px;
}
</style>
