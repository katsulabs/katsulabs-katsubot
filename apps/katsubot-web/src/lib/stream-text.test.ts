import { describe, expect, it, vi } from 'vitest'
import { streamTextReveal } from './stream-text'

describe('streamTextReveal', () => {
  it('reveals text character by character', async () => {
    vi.useFakeTimers()
    const partials: string[] = []

    const done = streamTextReveal('abc', (partial) => partials.push(partial), {
      charDelayMs: 10,
    })

    await vi.runAllTimersAsync()
    await done

    expect(partials).toEqual(['', 'a', 'ab', 'abc'])
    vi.useRealTimers()
  })

  it('stops early when aborted', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const partials: string[] = []

    const done = streamTextReveal('hello', (partial) => partials.push(partial), {
      charDelayMs: 10,
      signal: controller.signal,
    })

    await vi.advanceTimersByTimeAsync(25)
    controller.abort()
    await vi.runAllTimersAsync()
    await done

    expect(partials.length).toBeLessThan(6)
    vi.useRealTimers()
  })
})
