import type { Conversation } from './api'

export const PLACEHOLDER_CONVERSATION_TITLE = '새 대화'

const MAX_CONVERSATION_TITLE_LENGTH = 50

export function isPlaceholderConversationTitle(title: string): boolean {
  const normalized = title.trim()
  return (
    normalized.length === 0 ||
    normalized === PLACEHOLDER_CONVERSATION_TITLE ||
    normalized.toLowerCase() === 'new chat'
  )
}

/** 첫 사용자 메시지로 사이드바 제목 생성 (레거시 WRTN truncate 규칙과 동일) */
export function titleFromFirstMessage(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) {
    return PLACEHOLDER_CONVERSATION_TITLE
  }
  if (trimmed.length <= MAX_CONVERSATION_TITLE_LENGTH) {
    return trimmed
  }
  return `${trimmed.slice(0, MAX_CONVERSATION_TITLE_LENGTH)}...`
}

/** API·로컬 상태 공통 — id 없는 행 제거, id 기준 dedupe */
export function normalizeConversations(items: Conversation[]): Conversation[] {
  const seen = new Set<string>()
  const normalized: Conversation[] = []
  for (const raw of items) {
    const id = String(raw.id ?? (raw as Conversation & { conversation_id?: string }).conversation_id ?? '').trim()
    if (!id || id === 'null' || id === 'undefined') {
      continue
    }
    if (seen.has(id)) {
      continue
    }
    seen.add(id)
    normalized.push({
      id,
      title: raw.title?.trim() || PLACEHOLDER_CONVERSATION_TITLE,
      created_at: raw.created_at,
      chat_category: raw.chat_category,
    })
  }
  return normalized
}

export function mergeConversationTitles(
  items: Conversation[],
  titleOverrides: Record<string, string>,
): Conversation[] {
  return items.map((item) => {
    const override = titleOverrides[item.id]
    return override ? { ...item, title: override } : item
  })
}

export function isListedConversation(
  conversation: Conversation,
  conversationId: string | null,
  hasLocalMessages: boolean,
  streaming: boolean,
  loadingHistory: boolean,
): boolean {
  if (!isPlaceholderConversationTitle(conversation.title)) {
    return true
  }
  return (
    conversation.id === conversationId &&
    (hasLocalMessages || streaming || loadingHistory)
  )
}

/** 사이드바 제목 자리 Gemini 스타일 shimmer (첫 대화·제목 생성 대기만) */
export function shouldShowConversationTitleShimmer(
  conversation: Conversation,
  conversationId: string | null,
  displayTitle: string,
  hasTitleOverride: boolean,
  titleStreamingId: string | null,
): boolean {
  if (conversation.id !== conversationId) {
    return false
  }
  if (titleStreamingId === conversation.id) {
    return false
  }
  return displayTitle === PLACEHOLDER_CONVERSATION_TITLE && !hasTitleOverride
}
