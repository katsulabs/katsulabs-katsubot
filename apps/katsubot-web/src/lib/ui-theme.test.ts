import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyUiTheme, getStoredUiTheme, initUiTheme, UI_THEME_STORAGE_KEY } from './ui-theme'

function createStorageMock() {
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

describe('ui-theme', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock())
    vi.stubGlobal('document', {
      documentElement: {
        attributes: new Map<string, string>(),
        setAttribute(name: string, value: string) {
          this.attributes.set(name, value)
        },
        removeAttribute(name: string) {
          this.attributes.delete(name)
        },
        getAttribute(name: string) {
          return this.attributes.get(name) ?? null
        },
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to dark when storage is empty', () => {
    expect(getStoredUiTheme()).toBe('dark')
  })

  it('reads and applies stored theme', () => {
    localStorage.setItem(UI_THEME_STORAGE_KEY, 'dark')
    const theme = initUiTheme()
    expect(theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-ui-theme')).toBe('dark')
  })

  it('persists theme on apply', () => {
    applyUiTheme('gray')
    expect(localStorage.getItem(UI_THEME_STORAGE_KEY)).toBe('gray')
    expect(document.documentElement.getAttribute('data-ui-theme')).toBe('gray')
  })
})
