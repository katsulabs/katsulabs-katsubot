import { describe, expect, it, vi } from 'vitest'
import { ApiError, consumeSseBuffer, formatApiError, normalizeDonePayload } from './api'

describe('consumeSseBuffer', () => {
  it('parses delta and done events with optional title', () => {
    const onDelta = vi.fn()
    const onDone = vi.fn()
    const buffer = [
      'event: delta',
      'data: {"delta":"Hi"}',
      '',
      'event: done',
      'data: {"conversation_id":"c1","message_id":"m1","title":"휴가 문의"}',
      '',
    ].join('\n')

    consumeSseBuffer(buffer, { onDelta, onDone }, true)

    expect(onDelta).toHaveBeenCalledWith('Hi')
    expect(onDone).toHaveBeenCalledWith({
      conversation_id: 'c1',
      message_id: 'm1',
      title: '휴가 문의',
    })
  })

  it('normalizes camelCase done payload keys', () => {
    expect(
      normalizeDonePayload({ conversationId: 'c2', messageId: 99 }),
    ).toEqual({
      conversation_id: 'c2',
      message_id: '99',
    })
  })
})

describe('formatApiError', () => {
  it('adds login hint for 401', () => {
    const message = formatApiError(new ApiError(401, 'UNAUTHORIZED', '인증 필요'))
    expect(message).toContain('로그인')
  })
})

describe('listMessages normalization', () => {
  it('accepts messages and upstream content arrays', async () => {
    const { listMessages } = await import('./api')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ message_id: 42, role: 'USER', content: 'hello' }],
          has_more: false,
          next_cursor: null,
        }),
      }),
    )
    vi.stubGlobal('sessionStorage', {
      getItem: () => 'token',
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    })

    const messages = await listMessages('1')
    expect(messages).toEqual([{ id: '42', role: 'user', content: 'hello' }])
    vi.unstubAllGlobals()
  })
})
