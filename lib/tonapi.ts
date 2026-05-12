export function tonapiHeaders(): HeadersInit {
  const headers: Record<string, string> = { accept: 'application/json' }
  if (process.env.TONAPI_KEY) {
    headers['Authorization'] = `Bearer ${process.env.TONAPI_KEY}`
  }
  return headers
}
