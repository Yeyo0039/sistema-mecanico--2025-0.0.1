<script setup lang="ts">
import BaseForm from './baseForm.vue'
import { inventorySchema } from './schemas/inventory.schema'
import BaseButton from '../ui/BaseButton.vue'
import { reactive, toRaw } from 'vue'
import { GuardarProd } from '@/modules/inventario/store/Producto.ts'

//modelo de producto basico
export const productModel = reactive({
  codigo: '',

  nombre: '',

  marca: '',

  categoria: null,

  compatibilidad: [],

  detalles: '',

  image: '',

  stock: 0,

  ubicacion: '',

  stockMinimo: 0,

  precioCompra: 0,

  precioVenta: 0,
})
const errors = reactive({
  codigo: '',

  nombre: '',

  marca: '',

  categoria: null,

  compatibilidad: [],

  detalles: '',

  image: '',

  stock: 0,

  ubicacion: '',

  stockMinimo: 0,

  precioCompra: 0,

  precioVenta: 0,
})
function ProductoForm() {
  let data = structuredClone(toRaw(productModel))
  console.log('formulario de producto:', data)
  GuardarProd(data)
}
</script>
<template>
  <BaseForm :schema="inventorySchema" , :model="productModel" />
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
