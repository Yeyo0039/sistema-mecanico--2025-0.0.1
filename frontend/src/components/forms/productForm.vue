<script setup lang="ts">
import BaseForm from './baseForm.vue'
import { inventorySchema } from './schemas/inventory.schema'
import BaseButton from '../ui/BaseButton.vue'
import { reactive, toRaw } from 'vue'
import { GuardarProd } from '../../modules/inventario/store/Producto.ts'
import { validateSchema } from '@/composables/utils/schemaValidator'

// Modelo Reactivo del formulario.
// Se mantiene separado del objeto de errores para permitir
// una validación y renderizado claro de los mensajes.
const productModel = reactive({
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
