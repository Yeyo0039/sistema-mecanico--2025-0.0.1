<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import Toolbar from '@/components/DataViews/toolbar.vue'
import DataView from '@/components/DataViews/DataView.vue'

import ProductForm from '@/components/forms/productForm.vue'

import { getCategorias, type Categoria } from './services/categorias.service'

import {
  handleSearch,
  handleFilter,
  productoRows,
  loading,
  reloadProductos,
} from './services/productos.service'

import type {
  ToolbarConfig,
  ToolbarFilter,
  ToolbarAction,
} from '@/components/DataViews/DataViewToolbar.types'

//----------------------------------------------------
// STATE
//----------------------------------------------------

const categorias = ref<Categoria[]>([])

const currentView = ref<'table' | 'cards'>('table')

const mode = ref<'list' | 'form'>('list')

//----------------------------------------------------
// FILTERS
//----------------------------------------------------

const filters = computed<ToolbarFilter[]>(() => [
  {
    id: 'categoria',
    type: 'select',
    label: 'Categoría',

    items: categorias.value.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })),
  },
])

//----------------------------------------------------
// TOOLBAR CONFIG
//----------------------------------------------------

const toolbarConfig = computed<ToolbarConfig>(() => ({
  title: 'Inventario',

  search: true,

  actions: [
    {
      id: 'create-product',
      label: 'Agregar producto',
      icon: 'add',
    },
    {
      id: 'edit-product',
      label: 'Editar producto',
      icon: 'edit',
    },
  ],

  filters: filters.value,

  views: ['table', 'cards'],
}))

//----------------------------------------------------
// DATAVIEW
//----------------------------------------------------

const columns = computed(() => [
  {
    field: 'codigo',
    title: 'Código',
  },

  {
    field: 'nombre',
    title: 'Nombre',
  },

  {
    field: 'categoria',
    title: 'Categoría',
  },

  {
    field: 'marca',
    title: 'Marca',
  },

  {
    field: 'precio',
    title: 'Precio',
  },
  {
    field: 'referencia_interna',
    title: 'Referencia int',
  },
  { field: 'referencia_fabricante', title: 'Referencia fab' },
  {
    field: 'stock',
    title: 'Stock',
  },
])
///edicion y seleccion de productos
const emit = defineEmits<{
  (e: 'select-product', product: ProductEntity): void
}>()

type ProductRow = Record<string, unknown>

type SelectedProductData = {
  id?: number | string
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
  referencia_fabricante?: string
  precio?: number | string | null
  [key: string]: unknown
}

class ProductEntity {
  raw: ProductRow
  data: SelectedProductData

  constructor(raw: ProductRow, data: SelectedProductData) {
    this.raw = raw
    this.data = data
  }

  get entityName() {
    return 'Producto'
  }

  get className() {
    return 'ProductEntity'
  }

  get id() {
    return typeof this.raw.id === 'number'
      ? this.raw.id
      : typeof this.raw.id === 'string'
        ? Number(this.raw.id)
        : undefined
  }

  toJSON() {
    return {
      ...this.raw,
      ...this.data,
    }
  }
}

const selectedProductEntity = ref<ProductEntity | null>(null)
const selectionCache = ref<{ entity: ProductEntity; selectedAt: number } | null>(null)

function normalizeStringOrNumber(value: unknown): string | number | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (value == null) {
    return undefined
  }

  const stringValue = String(value)
  if (stringValue.trim() === '') {
    return undefined
  }

  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? stringValue : numberValue
}

function formatInternalProductCode(id: unknown, existingCode: unknown): string {
  if (typeof id === 'number' && Number.isFinite(id)) {
    return `inv-${String(id).padStart(5, '0')}`
  }

  if (typeof id === 'string') {
    const digits = id.trim()
    if (/^\d+$/.test(digits)) {
      return `inv-${digits.padStart(5, '0')}`
    }
  }

  return normalizeString(existingCode)
}

function normalizeFileOrString(value: unknown): string | File | null {
  if (typeof value === 'string' || value instanceof File) {
    return value
  }

  return null
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value
  }

  const parsed = Number(value ?? NaN)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeString(value: unknown): string {
  return value == null ? '' : String(value)
}

function mapRowToProductSchema(row: ProductRow): SelectedProductData {
  const dataViewFields = columns.value.reduce(
    (acc, column) => {
      acc[column.field] = row[column.field] ?? null
      return acc
    },
    {} as Record<string, unknown>,
  )

  const schemaData: SelectedProductData = {
    id: normalizeStringOrNumber(row.id ?? row.producto_id ?? row.productoId ?? undefined),
    ...dataViewFields,
    codigo: formatInternalProductCode(
      row.id ?? row.producto_id ?? row.productoId ?? null,
      row.codigo,
    ),
    referencia_interna: normalizeString(row.referencia_interna),
    nombre: normalizeString(row.nombre),
    marca: normalizeString(row.marca),
    categoria: normalizeStringOrNumber(row.categoria_id ?? row.categoria ?? null),
    compatibilidad: Array.isArray(row.compatibilidad) ? row.compatibilidad : [],
    detalles: normalizeString(row.detalles),
    imagen: normalizeFileOrString(row.imagen),
    stock: normalizeNumber(row.stock),
    stock_maximo: normalizeNumber(row.stock_maximo),
    ubicacion: normalizeString(row.ubicacion),
    stock_minimo: normalizeNumber(row.stock_minimo),
    precio_compra: normalizeNumber(row.precio_compra),
    precioVenta:
      typeof row.precioVenta === 'number'
        ? row.precioVenta
        : typeof row.precio === 'number'
          ? row.precio
          : normalizeNumber(row.precioVenta ?? row.precio),
    proveedor: normalizeString(row.proveedor),
    activo: normalizeStringOrNumber(row.activo ?? '1'),
    referencia_fabricante: normalizeString(row.referencia_fabricante),
    precio: normalizeStringOrNumber(row.precio ?? null),
  }

  if (Number.isNaN(schemaData.stock as number)) {
    schemaData.stock = null
  }
  if (Number.isNaN(schemaData.stock_maximo as number)) {
    schemaData.stock_maximo = null
  }
  if (Number.isNaN(schemaData.stock_minimo as number)) {
    schemaData.stock_minimo = null
  }
  if (Number.isNaN(schemaData.precio_compra as number)) {
    schemaData.precio_compra = null
  }
  if (Number.isNaN(schemaData.precioVenta as number)) {
    schemaData.precioVenta = null
  }

  console.log('Mapeando fila al esquema de producto:', schemaData)
  return schemaData
}

function selectProduct(row: ProductRow) {
  console.log('Fila seleccionada en DataView:', row)

  const schemaData = mapRowToProductSchema(row)
  const productEntity = new ProductEntity(row, schemaData)

  selectedProductEntity.value = productEntity
  selectionCache.value = {
    entity: productEntity,
    selectedAt: Date.now(),
  }

  const productId = productEntity.id
  console.log('Entidad creada:', {
    className: productEntity.className,
    entityName: productEntity.entityName,
    id: productId,
    value: productEntity.toJSON(),
  })
  console.log('Cache temporal de selección actualizado:', selectionCache.value)

  emit('select-product', productEntity)

  mode.value = 'form'
  return productEntity
}

//----------------------------------------------------
// TOOLBAR EVENTS
//----------------------------------------------------

function handleView(view: string) {
  console.log('VIEW:', view)

  currentView.value = view as 'table' | 'cards'
}

function onToolbarAction(action: ToolbarAction) {
  switch (action.id) {
    case 'create-product':
      selectedProductEntity.value = null
      selectionCache.value = null
      console.log('Creando producto nuevo: limpia selección previa y cache temporal')
      mode.value = 'form'
      break
    case 'edit-product':
      console.log(
        'Modo edición activado sin selección directa: el usuario debe seleccionar una fila o cargar un producto existente',
      )
      mode.value = 'form'
      break
    default:
      mode.value = 'list'
      break
  }
}

//----------------------------------------------------
// FORM EVENTS
//----------------------------------------------------

function closeForm() {
  mode.value = 'list'
}

//----------------------------------------------------
// LOAD DATA
//----------------------------------------------------

async function loadData() {
  loading.value = true

  try {
    categorias.value = await getCategorias()

    await reloadProductos()
  } finally {
    loading.value = false
    mode.value = 'list'
  }
}

onMounted(loadData)
</script>

<template>
  <!-- LISTADO -->

  <section v-if="mode === 'list'" class="inventory-view">
    <Toolbar
      :config="toolbarConfig"
      @search="handleSearch"
      @filter="handleFilter"
      @action="onToolbarAction"
      @view="handleView"
    />

    <p v-if="loading">Cargando inventario...</p>

    <DataView
      v-else
      :rows="productoRows"
      :columns="columns"
      :view="currentView"
      :pagination="true"
      :page-size="20"
      @select-row="selectProduct"
    />
  </section>

  <!-- FORMULARIO -->

  <section v-else class="inventory-form">
    <ProductForm :initial-product="selectedProductEntity?.data ?? null" />

    <button class="back-button" @click="closeForm">Volver al inventario</button>
  </section>
</template>

<style scoped>
.inventory-view,
.inventory-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-button {
  align-self: flex-start;
}
</style>
