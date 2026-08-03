import { useNotification } from '@/composables/useNotification'

// Dirección base del backend. Los servicios usan rutas cortas, por ejemplo '/api/productos'.
const API_URL = 'http://localhost:3000'

// Error uniforme: la pantalla puede consultar status, message y body.
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body: unknown = null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type ApiResponse<T> = {
  // true cuando apiFetch devuelve una respuesta; si falla, lanza ApiError.
  success: true
  // Contenido real que responde el backend.
  data: T
  // Código HTTP: 200, 201, 404, 500, etc.
  status: number
}

export type ApiFetchOptions = RequestInit & {
  // Controla si las respuestas exitosas deben mostrar notificaciones.
  // Por defecto todas las respuestas exitosas notifican a menos que se pase false.
  notifySuccess?: boolean
  // Controla si las respuestas de error deben notificar.
  // Por defecto los errores siempre se notifican.
  notifyError?: boolean
}

// Mensajes de respaldo cuando el backend no devuelve message ni mensaje.
const statusMessages: Record<number, string> = {
  100: 'Continuando con la solicitud.',
  101: 'El protocolo de conexión está cambiando.',
  102: 'La solicitud está siendo procesada.',
  200: 'Operación completada con éxito.',
  201: 'Recurso creado correctamente.',
  202: 'Solicitud aceptada y en proceso.',
  204: 'Operación completada.',
  300: 'Hay múltiples opciones disponibles.',
  301: 'El recurso fue movido permanentemente.',
  302: 'El recurso se encuentra temporalmente en otra ubicación.',
  304: 'No hay cambios desde la última solicitud.',
  400: 'Datos inválidos en la solicitud.',
  401: 'No autorizado. Inicia sesión nuevamente.',
  402: 'Pago requerido o sesión expirada.',
  403: 'No tienes permisos para esta acción.',
  404: 'Recurso no encontrado.',
  405: 'Método no permitido.',
  406: 'El formato solicitado no es aceptable.',
  408: 'Tiempo de espera agotado.',
  409: 'Conflicto: el recurso ya existe.',
  410: 'Recurso eliminado o no disponible.',
  415: 'Tipo de contenido no soportado.',
  422: 'Datos inválidos o incompletos.',
  429: 'Demasiadas solicitudes. Intenta más tarde.',
  500: 'Error interno del servidor.',
  501: 'Funcionalidad no implementada.',
  502: 'Error de pasarela.',
  503: 'Servicio no disponible.',
  504: 'Tiempo de espera del servidor agotado.',
  507: 'Espacio insuficiente en el servidor.',
  508: 'Bucle detectado en el servidor.',
  600: 'Error de conexión con la base de datos.',
  601: 'Error de comunicación con el servidor de archivos.',
  602: 'Error al cifrar o descifrar datos.',
  603: 'Archivo no encontrado en el servidor.',
  604: 'Error de autenticación del token.',
  605: 'Sesión expirada o inválida.',
  606: 'No se pudo procesar la solicitud por validaciones internas.',
  607: 'Dependencia externa no disponible.',
  608: 'Error desconocido en el backend.',
  609: 'Error al guardar en la base de datos.',
  610: 'Error al generar documento o reporte.',
  611: 'Inconsistencia en datos relacionados.',
}

export function getStatusMessage(status: number, fallback = 'Error inesperado o no declarado.') {
  return statusMessages[status] ?? fallback
}

function getUrl(path: string) {
  // Acepta tanto URLs absolutas como rutas internas del backend.
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

async function readBody(response: Response): Promise<unknown> {
  // 204 significa operación correcta sin cuerpo.
  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json().catch(() => null)

  return response.text().catch(() => null)
}

function getBodyMessage(body: unknown, fallback: string) {
  // El backend puede responder { message } o { mensaje }.
  if (body && typeof body === 'object') {
    const candidate = body as { message?: unknown; mensaje?: unknown }
    if (typeof candidate.message === 'string') return candidate.message
    if (typeof candidate.mensaje === 'string') return candidate.mensaje
  }

  return fallback
}

/**
 * Cliente HTTP global.
 *
 * 1. Agrega token JWT y Content-Type cuando corresponde.
 * 2. Ejecuta fetch.
 * 3. Muestra BaseNotification mediante useNotification ante errores HTTP.
 * 4. Devuelve datos normalizados o lanza ApiError.
 *
 * GET:
 * const response = await apiFetch<Producto[]>('/api/productos')
 * const productos = response.data
 *
 * POST con alerta de éxito:
 * await apiFetch('/api/productos', {
 *   method: 'POST', body: JSON.stringify(nuevoProducto), notifySuccess: true,
 * })
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiResponse<T>> {
  const {
    notifySuccess = true,
    notifyError = true,
    headers: optionHeaders,
    ...requestOptions
  } = options
  // useNotification comparte su estado reactivo con NotificationContainer.
  const notify = useNotification()
  // FormData define su propio Content-Type; no debemos sobrescribirlo.
  const isFormData = requestOptions.body instanceof FormData
  const headers = new Headers(optionHeaders)
  const token = localStorage.getItem('authToken')

  // No enviar "Bearer null" cuando todavía no hay sesión.
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  try {
    const response = await fetch(getUrl(path), { ...requestOptions, headers })
    const body = await readBody(response)
    const defaultMessage = getStatusMessage(
      response.status,
      response.statusText || 'Error inesperado.',
    )
    const message = getBodyMessage(body, defaultMessage)

    if (!response.ok) {
      // 4xx y 5xx: una alerta global y un ApiError para lógica adicional de la pantalla.
      if (notifyError) notify.error(`Error ${response.status}`, message)
      throw new ApiError(response.status, message, body)
    }

    if (notifySuccess) notify.success('Operación exitosa', message)

    const data =
      body && typeof body === 'object' && 'data' in body ? (body as { data: T }).data : (body as T)

    return { success: true, data, status: response.status }
  } catch (error) {
    // Cancelar una petición al salir de un módulo no muestra alerta.
    if (error instanceof ApiError || (error instanceof Error && error.name === 'AbortError'))
      throw error

    // Sin red, CORS o backend apagado: error seguro y mensaje por defecto.
    const message = 'Error inesperado o de conexión.'
    notify.error('Error de conexión', message)
    throw new ApiError(0, message, error)
  }
}

/**
 * Versión para descargar PDF, Excel, imágenes u otros archivos.
 * Ejemplo: const file = await apiFetchBlob('/api/reportes/inventario', { notifySuccess: true })
 */
export async function apiFetchBlob(path: string, options: ApiFetchOptions = {}) {
  const {
    notifySuccess = true,
    notifyError = true,
    headers: optionHeaders,
    ...requestOptions
  } = options
  const notify = useNotification()
  const headers = new Headers(optionHeaders)
  const token = localStorage.getItem('authToken')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  try {
    const response = await fetch(getUrl(path), { ...requestOptions, headers })

    if (!response.ok) {
      const body = await readBody(response)
      const message = getBodyMessage(body, getStatusMessage(response.status, response.statusText))
      notify.error(`Error ${response.status}`, message)
      throw new ApiError(response.status, message, body)
    }

    const blob = await response.blob()
    if (notifySuccess) notify.success('Documento cargado', 'El archivo se cargó correctamente.')

    return {
      ok: true as const,
      status: response.status,
      blob,
      contentType: response.headers.get('content-type') ?? 'application/octet-stream',
    }
  } catch (error) {
    if (error instanceof ApiError || (error instanceof Error && error.name === 'AbortError'))
      throw error

    const message = 'Error al descargar el archivo.'
    notify.error('Error de conexión', message)
    throw new ApiError(0, message, error)
  }
}
