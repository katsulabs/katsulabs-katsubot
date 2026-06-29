/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_TOKEN?: string
  readonly VITE_LEGACY_BASE_URL?: string
  readonly VITE_LEGACY_COMPANY_CODE?: string
  /** Vite dev proxy — katsubot-api (auth·katsubot-api-only 모드, default http://localhost:8081) */
  readonly VITE_KATSUBOT_API_PROXY_TARGET?: string
  /** Vite dev proxy — legacy hyobee (default http://localhost:8080) */
  readonly VITE_LEGACY_PROXY_TARGET?: string
  /** Vite dev proxy — /api/v1 대화·메시지 (default legacy :8080). katsubot-api만: http://localhost:8081 */
  readonly VITE_API_V1_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
