import type { FormSection } from '@/types/forms'

export const inventorySchema: FormSection[] = [
  {
    title: 'Información General',

    columns: 4,

    fields: [
      {
        name: 'codigo',
        label: 'Código',
        type: 'text',
      },

      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
      },

      {
        name: 'marca',
        label: 'Marca',
        type: 'text',
      },

      {
        name: 'categoria',
        label: 'Categoría',
        type: 'select',
      },
      {
        name: 'compatibilidad',
        label: 'Motos y compatibilidades',
        type: 'checkbox',
      },
    ],
  },

  {
    title: 'Inventario',

    columns: 4,

    fields: [
      {
        name: 'stock',
        label: 'Stock',
        type: 'number',
      },

      {
        name: 'stockMinimo',
        label: 'Stock mínimo',
        type: 'number',
      },

      {
        name: 'precioCompra',
        label: 'Precio compra',
        type: 'number',
      },

      {
        name: 'precioVenta',
        label: 'Precio venta',
        type: 'number',
      },
      {
        name: 'detalles',
        label: 'detalles',
        type: 'textarea',
      },
      {
        name: 'image',
        label: 'imagen no disponible',
        type: 'text',
      },
    ],
  },
]
