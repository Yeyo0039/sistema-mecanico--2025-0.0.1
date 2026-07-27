<script setup lang="ts">
import BaseForm from './baseForm.vue'
import { inventorySchema } from './schemas/inventory.schema'

import { reactive } from 'vue'
const productModel = reactive({
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
</script>
<template>
  <BaseForm :schema="inventorySchema" , :model="productModel" />
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
