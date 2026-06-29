import { describe, expect, it } from 'vitest'
import {
  isListedConversation,
  isPlaceholderConversationTitle,
  mergeConversationTitles,
  normalizeConversations,
  PLACEHOLDER_CONVERSATION_TITLE,
  shouldShowConversationTitleShimmer,
  titleFromFirstMessage,
} from './conversation-list'

const placeholderConversation = {
  id: 'draft-1',
  title: PLACEHOLDER_CONVERSATION_TITLE,
  created_at: '2026-01-01T00:00:00Z',
}

const titledConversation = {
  id: 'chat-1',
  title: '휴가 규정 문의',
  created_at: '2026-01-01T00:00:00Z',
}

describe('normalizeConversations', () => {
  it('drops rows without id and dedupes by id', () => {
    const result = normalizeConversations([
      { id: '1', title: 'A', created_at: 't' },
      { id: null as unknown as string, title: 'broken', created_at: 't' },
      { id: '1', title: 'A duplicate', created_at: 't' },
      { id: '2', title: 'B', created_at: 't' },
    ])
    expect(result).toEqual([
      { id: '1', title: 'A', created_at: 't', chat_category: undefined },
      { id: '2', title: 'B', created_at: 't', chat_category: undefined },
    ])
  })
})

describe('mergeConversationTitles', () => {
  it('applies local title overrides after refresh', () => {
    const merged = mergeConversationTitles(
      [{ id: '1', title: PLACEHOLDER_CONVERSATION_TITLE, created_at: 't' }],
      { '1': '효성 정보' },
    )
    expect(merged[0]?.title).toBe('효성 정보')
  })
})

describe('titleFromFirstMessage', () => {
  it('uses trimmed user text as the sidebar title', () => {
    expect(titleFromFirstMessage('  효성 정보  ')).toBe('효성 정보')
  })

  it('truncates long messages', () => {
    const long = '가'.repeat(60)
    expect(titleFromFirstMessage(long)).toBe(`${'가'.repeat(50)}...`)
  })
})

describe('isPlaceholderConversationTitle', () => {
  it('detects placeholder titles', () => {
    expect(isPlaceholderConversationTitle(PLACEHOLDER_CONVERSATION_TITLE)).toBe(true)
    expect(isPlaceholderConversationTitle('효성 정보')).toBe(false)
  })
})

describe('isListedConversation', () => {
  it('hides placeholder conversations without messages', () => {
    expect(isListedConversation(placeholderConversation, null, false, false, false)).toBe(false)
    expect(isListedConversation(placeholderConversation, 'draft-1', false, false, false)).toBe(false)
  })

  it('shows placeholder conversations after chat starts', () => {
    expect(isListedConversation(placeholderConversation, 'draft-1', true, false, false)).toBe(true)
    expect(isListedConversation(placeholderConversation, 'draft-1', false, true, false)).toBe(true)
  })

  it('always shows titled conversations', () => {
    expect(isListedConversation(titledConversation, null, false, false, false)).toBe(true)
  })
})

describe('shouldShowConversationTitleShimmer', () => {
  it('shows shimmer for placeholder title on the active conversation', () => {
    expect(
      shouldShowConversationTitleShimmer(
        placeholderConversation,
        'draft-1',
        PLACEHOLDER_CONVERSATION_TITLE,
        false,
        null,
      ),
    ).toBe(true)
  })

  it('keeps titled conversations visible while streaming follow-up messages', () => {
    expect(
      shouldShowConversationTitleShimmer(
        titledConversation,
        'chat-1',
        '휴가 규정 문의',
        false,
        null,
      ),
    ).toBe(false)
  })

  it('hides shimmer when title typing starts', () => {
    expect(
      shouldShowConversationTitleShimmer(
        placeholderConversation,
        'draft-1',
        '휴가',
        true,
        'draft-1',
      ),
    ).toBe(false)
  })

  it('shows shimmer while waiting for title after stream', () => {
    expect(
      shouldShowConversationTitleShimmer(
        placeholderConversation,
        'draft-1',
        PLACEHOLDER_CONVERSATION_TITLE,
        false,
        null,
      ),
    ).toBe(true)
  })
})
