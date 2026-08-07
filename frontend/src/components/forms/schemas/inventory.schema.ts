import type { FormSection } from '@/types/forms'

export const inventorySchema: FormSection[] = [
  {
    title: 'Información General',

    columns: 4,
    entity: {
      table: 'productos',
      primaryKey: 'id',
    },
    fields: [
      {
        name: 'codigo',
        label: 'Código interno',
        type: 'text',
        required: true,
      },

      {
        name: 'referencia_interna',
        label: 'Referencia interna',
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
        name: 'imagen',
        label: 'imagen no disponible',
        type: 'file',
      },
    ],
  },

  {
    title: 'Inventario',

    columns: 4,
    entity:{
      table:"inventario",
      primariKey:"id_inventario"
    }
    fields: [
      {
        name: 'stock',
        label: 'Stock',
        type: 'number',
        required: true,
      },
      {
        name: 'stock_maximo',
        label: 'Stock máximo',
        type: 'number',
        required: false,
      },
      {
        name: 'ubicacion',
        label: 'Ubicacion',
        type: 'text',
        required: false,
      },
      {
        name: 'stock_minimo',
        label: 'Stock mínimo',
        type: 'number',
        required: false,
      },
    ],
  },
  {
    title: 'Precios',

    columns: 4,
    fields: [
      {
        name: 'precio_compra',
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
      {
        name: 'proveedor',
        label: 'Proveedor',
        type: 'text',
        required: false,
      },
      {
        name: 'activo',
        label: 'Activo',
        type: 'select',
        required: true,
        options: [
          { label: 'Sí', value: '1' },
          { label: 'No', value: '0' },
        ],
      },
    ],
  },
]
