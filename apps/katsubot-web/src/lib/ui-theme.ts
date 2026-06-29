export type UiTheme = 'light' | 'dark' | 'gray'

export const UI_THEME_CODES: UiTheme[] = ['light', 'dark', 'gray']
export const UI_THEME_STORAGE_KEY = 'katsubotUiTheme'
export const DEFAULT_UI_THEME: UiTheme = 'dark'

export function isUiTheme(value: string | null | undefined): value is UiTheme {
  return value === 'light' || value === 'dark' || value === 'gray'
}

export function getStoredUiTheme(): UiTheme {
  try {
    const stored = localStorage.getItem(UI_THEME_STORAGE_KEY)
    if (isUiTheme(stored)) {
      return stored
    }
  } catch {
    // ignore storage errors (private mode, etc.)
  }
  return DEFAULT_UI_THEME
}

export function applyUiTheme(theme: UiTheme, persist = true): void {
  document.documentElement.setAttribute('data-ui-theme', theme)
  if (persist) {
    try {
      localStorage.setItem(UI_THEME_STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }
}

export function initUiTheme(): UiTheme {
  const theme = getStoredUiTheme()
  applyUiTheme(theme, false)
  return theme
}

export function uiThemeLabel(theme: UiTheme): string {
  switch (theme) {
    case 'dark':
      return 'Dark'
    case 'gray':
      return 'Gray'
    default:
      return 'Light'
  }
}
