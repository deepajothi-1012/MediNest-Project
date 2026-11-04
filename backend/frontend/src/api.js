const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(path, { method = 'GET', token, body, headers = {} } = {}) {
  const requestHeaders = { ...headers }
  const isFormData = body instanceof FormData
  const isBlob = typeof Blob !== 'undefined' && body instanceof Blob
  if (body !== undefined && !isFormData && !isBlob) {
    requestHeaders['Content-Type'] = 'application/json'
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData || isBlob ? body : JSON.stringify(body),
  })

  const payload = await response.json()
  if (!response.ok) {
    const error = new Error(payload.message || 'The request could not be completed')
    error.status = response.status
    throw error
  }
  return payload
}

export async function apiDownload(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    const payload = await response.json()
    const error = new Error(payload.message || 'The file could not be downloaded')
    error.status = response.status
    throw error
  }

  return response.blob()
}
