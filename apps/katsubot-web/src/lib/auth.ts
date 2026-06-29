const AUTH_STORAGE_KEY = 'katsubot.auth.token'
const PROFILE_STORAGE_KEY = 'katsubot.auth.profile'

export type UserProfile = {
  userName: string
  teamName: string
}

const DEFAULT_PROFILE: UserProfile = {
  userName: '사용자',
  teamName: '',
}

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

  setAuthToken(token)
  syncUserProfileFromToken(token)
  params.delete('jwt')
  params.delete('token')
  const query = params.toString()
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState({}, '', cleanUrl)
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, token.trim())
}

export function setUserProfile(profile: UserProfile): void {
  sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) {
      return null
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function syncUserProfileFromToken(token?: string | null): UserProfile | null {
  const jwt = (token ?? getAuthToken())?.trim()
  if (!jwt) {
    return null
  }
  const payload = decodeJwtPayload(jwt)
  if (!payload) {
    return null
  }
  const userName = String(payload.userName ?? payload.sub ?? DEFAULT_PROFILE.userName)
  const teamName = String(payload.teamName ?? payload.teamCode ?? '').trim()
  const profile = { userName, teamName }
  setUserProfile(profile)
  return profile
}

export function getUserProfile(): UserProfile {
  const stored = sessionStorage.getItem(PROFILE_STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<UserProfile>
      if (parsed.userName) {
        return {
          userName: parsed.userName,
          teamName: parsed.teamName?.trim() ?? '',
        }
      }
    } catch {
      // fall through
    }
  }
  return syncUserProfileFromToken() ?? DEFAULT_PROFILE
}

export function isAuthenticated(): boolean {
  return getAuthToken() != null
}

/** sessionStorage에 저장된 JWT. 로그인·SSO handoff 후에만 존재한다. */
export function getAuthToken(): string | null {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)?.trim()
  return stored || null
}

/** Strangler 동일 origin 또는 VITE_LEGACY_BASE_URL 기준 레거시 베이스 URL */
export function getLegacyBaseUrl(): string {
  const configured = import.meta.env.VITE_LEGACY_BASE_URL
  if (configured !== undefined) {
    return configured.replace(/\/$/, '')
  }
  return ''
}

export function getSsoLoginUrl(): string {
  return `${getLegacyBaseUrl()}/xs/vob/aichat/ssologin`
}

/** 로컬 dev에서 만료 JWT가 sessionStorage에 남아 API가 401일 때 호출 */
export function clearAuthToken(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(PROFILE_STORAGE_KEY)
}

/** sessionStorage JWT 제거. reload=false 이면 SPA 상태 전환(로그인 화면)용 */
export function logout(options?: { reload?: boolean }): void {
  clearAuthToken()
  if (options?.reload !== false) {
    window.location.reload()
  }
}
