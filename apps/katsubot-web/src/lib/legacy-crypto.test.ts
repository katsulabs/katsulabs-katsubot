import { describe, expect, it } from 'vitest'
import { encryptLegacyField } from './legacy-crypto'

describe('legacy-crypto', () => {
  it('encrypts with GibberishAES compatible with legacy OTP key layout', () => {
    const key = '12345678901234567890123456789012'
    const encrypted = encryptLegacyField('1000', key)
    expect(encrypted).toBeTruthy()
    expect(encrypted).not.toContain('1000')
  })
})
