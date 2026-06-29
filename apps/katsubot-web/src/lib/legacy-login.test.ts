import { afterEach, describe, expect, it, vi } from 'vitest'
import { LegacyLoginError, loginWithLegacyPassword } from './legacy-login'

describe('loginWithLegacyPassword', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects empty credentials', async () => {
    await expect(loginWithLegacyPassword({ userId: '', password: '' })).rejects.toMatchObject({
      code: 'LOGIN',
    })
  })

  it('returns JWT after aichat auth login flow', async () => {
    const fetchMock = vi.fn(async (input: string) => {
      if (input.endsWith('/encrypt-key')) {
        return new Response(JSON.stringify({ encrypt_key: '12345678901234567890123456789012' }))
      }
      if (input.endsWith('/login')) {
        return new Response(
          JSON.stringify({ token: 'legacy-jwt-token', user_name: '김효성', team_name: 'DX기획팀' }),
        )
      }
      return new Response('', { status: 404 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await loginWithLegacyPassword({ userId: 'user01', password: 'secret' })

    expect(result.token).toBe('legacy-jwt-token')
    expect(result.userName).toBe('김효성')
    expect(result.teamName).toBe('DX기획팀')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const loginCall = fetchMock.mock.calls[1]
    expect(loginCall[0]).toContain('/api/v1/auth/login')
    expect(String(loginCall[1]?.body)).toContain('user_id_encrypt')
  })

  it('maps encrypt-key 404 to katsubot-api hint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ message: 'No message available' }), { status: 404 }),
      ),
    )

    await expect(loginWithLegacyPassword({ userId: 'user01', password: 'secret' })).rejects.toEqual(
      expect.objectContaining<Partial<LegacyLoginError>>({
        code: 'LOGIN',
        message: expect.stringContaining('katsubot-api'),
      }),
    )
  })

  it('surfaces login errors from auth API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string) => {
        if (input.endsWith('/encrypt-key')) {
          return new Response(JSON.stringify({ encrypt_key: '12345678901234567890123456789012' }))
        }
        return new Response(
          JSON.stringify({ code: 'LOGIN_NMP', message: '비밀번호가 올바르지 않습니다.' }),
          { status: 401 },
        )
      }),
    )

    await expect(loginWithLegacyPassword({ userId: 'user01', password: 'bad' })).rejects.toEqual(
      expect.objectContaining<Partial<LegacyLoginError>>({
        code: 'LOGIN',
        message: '비밀번호가 올바르지 않습니다.',
      }),
    )
  })
})
