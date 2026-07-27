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
        required: true,
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
        type: 'select',
        required: true,
      },

      {
        name: 'categoria',
        label: 'Categoría',
        type: 'select',
        required: true,
        source: 'categorias',
      },
      {
        name: 'compatibilidad',
        label: 'Motos y compatibilidades',
        type: 'checkbox',
      },
      {
        name: 'detalles',
        label: 'detalles',
        type: 'textarea',
      },
      {
        name: 'image',
        label: 'imagen no disponible',
        type: 'file',
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
        required: true,
      },
      {
        name: 'ubicacion',
        label: 'Ubicacion',
        type: 'text',
        required: false,
      },
      {
        name: 'stockMinimo',
        label: 'Stock mínimo',
        type: 'number',
        required: false,
      },

      {
        name: 'precioCompra',
        label: 'Precio compra',
        type: 'number',
        required: true,
      },

      {
        name: 'precioVenta',
        label: 'Precio venta',
        type: 'number',
        required: true,
      },
    ],
  },
]
