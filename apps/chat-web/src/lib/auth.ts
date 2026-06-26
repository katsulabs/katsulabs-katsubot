export function getAuthToken(): string {
  return import.meta.env.VITE_AUTH_TOKEN ?? 'dev-token'
}
