import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearAuthToken,
  getLegacyBaseUrl,
  getSsoLoginUrl,
  isAuthenticated,
  logout,
  setAuthToken,
} from './auth'

function createSessionStorageMock() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  }
}

describe('auth', () => {
  beforeEach(() => {
    vi.stubGlobal('sessionStorage', createSessionStorageMock())
  })

  afterEach(() => {
    clearAuthToken()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('tracks session token as authenticated', () => {
    expect(isAuthenticated()).toBe(false)
    setAuthToken('jwt-abc')
    expect(isAuthenticated()).toBe(true)
  })

  it('builds SSO login URL from legacy base', () => {
    vi.stubEnv('VITE_LEGACY_BASE_URL', 'http://legacy.test')
    expect(getLegacyBaseUrl()).toBe('http://legacy.test')
    expect(getSsoLoginUrl()).toBe('http://legacy.test/xs/vob/aichat/ssologin')
  })

  it('uses same-origin SSO when legacy base is unset', () => {
    vi.stubEnv('VITE_LEGACY_BASE_URL', '')
    expect(getSsoLoginUrl()).toBe('/xs/vob/aichat/ssologin')
  })

  it('clears token without reload when reload is false', () => {
    setAuthToken('jwt-abc')
    logout({ reload: false })
    expect(isAuthenticated()).toBe(false)
  })
})
