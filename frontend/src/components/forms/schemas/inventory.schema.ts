import type { FormSection } from '@/types/forms'

export const inventorySchema: FormSection[] = [
  {
    title: 'Información General',

    columns: 2,

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

        options: ['Ortesis', 'Prótesis', 'Insumo'],
      },
    ],
  },

  {
    title: 'Inventario',

    columns: 2,

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
    ],
  },
]
