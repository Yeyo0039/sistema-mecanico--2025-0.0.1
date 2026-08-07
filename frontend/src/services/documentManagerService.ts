export interface DocumentUploadPayload {
  contexto: string
  clave: string
  tipoDocumento: string
  nombreOriginal?: string
  metadata?: Record<string, unknown>
  file: File
}

export async function uploadDocument(payload: DocumentUploadPayload) {
  const formData = new FormData()
  formData.append('file', payload.file)
  formData.append('contexto', payload.contexto)
  formData.append('clave', payload.clave)
  formData.append('tipoDocumento', payload.tipoDocumento)

  if (payload.nombreOriginal) {
    formData.append('nombreOriginal', payload.nombreOriginal)
  }

  if (payload.metadata) {
    formData.append('metadata', JSON.stringify(payload.metadata))
  }

  const response = await fetch('http://localhost:3000/api/documents/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || error.error || 'No se pudo subir el documento')
  }

  return response.json()
}

export async function listDocuments(filters?: {
  contexto?: string
  clave?: string
  tipoDocumento?: string
}) {
  const params = new URLSearchParams()

  if (filters?.contexto) params.set('contexto', filters.contexto)
  if (filters?.clave) params.set('clave', filters.clave)
  if (filters?.tipoDocumento) params.set('tipoDocumento', filters.tipoDocumento)

  const response = await fetch(`http://localhost:3000/api/documents?${params.toString()}`)

  if (!response.ok) {
    throw new Error('No se pudieron listar los documentos')
  }

  return response.json()
}
