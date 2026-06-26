import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('exports chat page root', () => {
    expect(App).toBeTypeOf('function')
  })
})
