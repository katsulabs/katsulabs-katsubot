import { encryptLegacyField, encryptLegacyPassword } from './legacy-crypto'

export class LegacyLoginError extends Error {
  readonly code: 'ENCRYPT_KEY' | 'LOGIN' | 'TOKEN' | 'NETWORK'

  constructor(code: LegacyLoginError['code'], message: string) {
    super(message)
    this.name = 'LegacyLoginError'
    this.code = code
  }
}

type AuthErrorBody = {
  code?: string
  message?: string
  error?: string
}

function authFailureMessage(response: Response, fallback: string): string {
  if (response.status === 404) {
    return '로그인 API를 찾을 수 없습니다. chat-api(:8081)가 실행 중인지 확인하고 Vite dev 서버를 재시작하세요.'
  }
  if (response.status === 502 || response.status === 503) {
    return 'chat-api에 연결할 수 없습니다. ./scripts/boot-chat-api.sh 실행 후 다시 시도하세요.'
  }
  return fallback
}

async function parseAuthError(response: Response, fallback: string): Promise<LegacyLoginError> {
  const statusFallback = authFailureMessage(response, fallback)
  try {
    const body = (await response.json()) as AuthErrorBody
    const raw = body.message ?? body.error ?? statusFallback
    const message =
      raw === 'No message available' || !raw.trim() ? statusFallback : raw
    const code = body.code === 'ENCRYPT_KEY' || body.code === 'TOKEN' ? body.code : 'LOGIN'
    return new LegacyLoginError(code, message)
  } catch {
    return new LegacyLoginError('NETWORK', statusFallback)
  }
}

function authApiUrl(path: string): string {
  return `/api/v1/auth${path}`
}

async function fetchEncryptKey(): Promise<string> {
  const response = await fetch(authApiUrl('/encrypt-key'), {
    method: 'POST',
    credentials: 'include',
  })
  if (!response.ok) {
    throw await parseAuthError(response, '암호화 키 요청에 실패했습니다.')
  }
  const body = (await response.json()) as { encrypt_key?: string }
  const encryptKey = String(body.encrypt_key ?? '').replace(/ /g, '+')
  if (!encryptKey) {
    throw new LegacyLoginError('ENCRYPT_KEY', '암호화 키를 받지 못했습니다.')
  }
  return encryptKey
}

async function postAichatLogin(
  companyCode: string,
  userId: string,
  password: string,
  encryptKey: string,
  languageCode: string,
): Promise<string> {
  const response = await fetch(authApiUrl('/login'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company_code_encrypt: encryptLegacyField(companyCode, encryptKey),
      user_id_encrypt: encryptLegacyField(userId, encryptKey),
      password_encrypt: encryptLegacyPassword(password, encryptKey),
      language_code: languageCode,
    }),
  })
  if (!response.ok) {
    throw await parseAuthError(response, '로그인에 실패했습니다.')
  }
  const body = (await response.json()) as { token?: string }
  if (!body.token) {
    throw new LegacyLoginError('TOKEN', 'JWT를 받지 못했습니다.')
  }
  return body.token
}

export type LegacyPasswordLoginInput = {
  userId: string
  password: string
  companyCode?: string
  languageCode?: string
}

/**
 * chat-api UserMapper(hyobee-admin-db) + OTP 복호화 비밀번호 로그인.
 * encrypt-key → login → JWT
 */
export async function loginWithLegacyPassword(input: LegacyPasswordLoginInput): Promise<string> {
  const userId = input.userId.trim()
  const password = input.password
  if (!userId || !password) {
    throw new LegacyLoginError('LOGIN', '아이디와 비밀번호를 입력해 주세요.')
  }

  const companyCode = input.companyCode ?? import.meta.env.VITE_LEGACY_COMPANY_CODE ?? '1000'
  const languageCode = input.languageCode ?? 'ko'

  const encryptKey = await fetchEncryptKey()
  return postAichatLogin(companyCode, userId, password, encryptKey, languageCode)
}

export function formatLegacyLoginError(error: unknown): string {
  if (error instanceof LegacyLoginError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return '로그인 중 오류가 발생했습니다.'
}
