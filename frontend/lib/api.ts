export function getPublicApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'
}

export function getServerApiBaseUrl(): string {
  return process.env.API_INTERNAL_BASE_URL ?? getPublicApiBaseUrl()
}
