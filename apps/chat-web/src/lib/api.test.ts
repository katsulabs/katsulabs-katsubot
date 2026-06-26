import { describe, expect, it, vi } from 'vitest'
import { consumeSseBuffer } from './api'

describe('consumeSseBuffer', () => {
  it('parses delta and done events', () => {
    const onDelta = vi.fn()
    const onDone = vi.fn()
    const buffer = [
      'event: delta',
      'data: {"delta":"Hi"}',
      '',
      'event: done',
      'data: {"conversation_id":"c1","message_id":"m1"}',
      '',
    ].join('\n')

    consumeSseBuffer(buffer, { onDelta, onDone }, true)

    expect(onDelta).toHaveBeenCalledWith('Hi')
    expect(onDone).toHaveBeenCalledWith({ conversation_id: 'c1', message_id: 'm1' })
  })
})
