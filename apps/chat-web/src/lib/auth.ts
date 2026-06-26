const AUTH_STORAGE_KEY = 'katsubot.auth.token'

/**
 * 레거시 JSP → React 전환 시 URL 쿼리로 전달된 JWT를 sessionStorage에 보관한다.
 * 지원 파라미터: `jwt`, `token`
 */
export function initAuthFromUrl(): void {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('jwt') ?? params.get('token')
  if (!token) {
    return
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, token)
  params.delete('jwt')
  params.delete('token')
  const query = params.toString()
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState({}, '', cleanUrl)
}

export function getAuthToken(): string {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (stored) {
    return stored
  }
  return import.meta.env.VITE_AUTH_TOKEN ?? 'dev-token'
}
