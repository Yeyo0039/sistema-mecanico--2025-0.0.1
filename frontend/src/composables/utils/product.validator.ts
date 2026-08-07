export type ProductFormModel = {
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
  id?: number | null
}

export type ProductPayload = {
  id?: number | null
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

export function normalizeString(value: unknown): string {
  if (typeof value === 'string') {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeActiveValue(value: unknown): string | number | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return '1'
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

export function createEmptyProductModel(): ProductFormModel {
  return {
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
  }
}

export function normalizeProductModel(product: Record<string, unknown> = {}): ProductFormModel {
  const categoriaValue = product.categoria ?? product.categoria_id ?? null
  const imagenValue = product.imagen ?? null
  const stockValue = toNumber(product.stock)
  const stockMaximoValue = toNumber(product.stock_maximo)
  const stockMinimoValue = toNumber(product.stock_minimo)
  const precioCompraValue = toNumber(product.precio_compra)
  const precioVentaValue = toNumber(
    product.precioVenta ?? product.precio ?? product.precio_venta ?? null,
  )

  return {
    id: typeof product.id === 'number' ? product.id : null,
    codigo: formatInternalCode(product.id ?? product.codigo ?? null, product.codigo ?? ''),
    referencia_interna: normalizeString(product.referencia_interna),
    nombre: normalizeString(product.nombre),
    marca: normalizeString(product.marca),
    categoria:
      typeof categoriaValue === 'string' || typeof categoriaValue === 'number'
        ? categoriaValue
        : null,
    compatibilidad: Array.isArray(product.compatibilidad) ? product.compatibilidad : [],
    detalles: normalizeString(product.detalles),
    imagen: typeof imagenValue === 'string' || imagenValue instanceof File ? imagenValue : null,
    stock: stockValue,
    stock_maximo: stockMaximoValue,
    ubicacion: normalizeString(product.ubicacion),
    stock_minimo: stockMinimoValue,
    precio_compra: precioCompraValue,
    precioVenta: precioVentaValue,
    proveedor: normalizeString(product.proveedor),
    activo: normalizeActiveValue(product.activo),
  }
}

export function buildProductPayload(
  model: Partial<ProductFormModel> | Record<string, unknown>,
): ProductPayload {
  const payload: ProductPayload = {
    id: typeof model.id === 'number' ? model.id : null,
    codigo: normalizeString(model.codigo),
    referencia_interna: normalizeString(model.referencia_interna),
    nombre: normalizeString(model.nombre),
    marca: normalizeString(model.marca),
    categoria:
      typeof model.categoria === 'string' || typeof model.categoria === 'number'
        ? model.categoria
        : null,
    compatibilidad: Array.isArray(model.compatibilidad) ? model.compatibilidad : [],
    detalles: normalizeString(model.detalles),
    imagen: model.imagen instanceof File || typeof model.imagen === 'string' ? model.imagen : null,
    stock: toNumber(model.stock),
    stock_maximo: toNumber(model.stock_maximo),
    ubicacion: normalizeString(model.ubicacion),
    stock_minimo: toNumber(model.stock_minimo),
    precio_compra: toNumber(model.precio_compra),
    precioVenta: toNumber(model.precioVenta),
    proveedor: normalizeString(model.proveedor),
    activo: normalizeActiveValue(model.activo),
  }

  return payload
}
