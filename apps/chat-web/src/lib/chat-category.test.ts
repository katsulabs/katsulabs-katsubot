import { describe, expect, it } from 'vitest'
import { searchTypeFromChatCategory, toApiChatCategory } from './chat-category'

describe('chat-category', () => {
  it('maps search types to legacy chat_category', () => {
    expect(toApiChatCategory('internal')).toBe('internal_rules')
    expect(toApiChatCategory('web')).toBe('web_search')
    expect(toApiChatCategory('journal')).toBe('rnd_search')
  })

  it('maps chat_category back to search types', () => {
    expect(searchTypeFromChatCategory('web_search')).toBe('web')
    expect(searchTypeFromChatCategory('rnd_search')).toBe('journal')
    expect(searchTypeFromChatCategory('internal_rules')).toBe('internal')
  })
})
