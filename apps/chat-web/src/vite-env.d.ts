/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_TOKEN?: string
  readonly VITE_LEGACY_BASE_URL?: string
  readonly VITE_LEGACY_COMPANY_CODE?: string
  /** Vite dev proxy — chat-api base (default http://localhost:8081) */
  readonly VITE_CHAT_API_PROXY_TARGET?: string
  /** Vite dev proxy — legacy hyobee base (default http://localhost:8080) */
  readonly VITE_LEGACY_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
