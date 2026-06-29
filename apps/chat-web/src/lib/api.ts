import { clearAuthToken, getAuthToken } from './auth'

export type Conversation = {
  id: string
  title: string
  created_at: string
  chat_category?: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type MessagesPage = {
  messages: ChatMessage[]
  has_more: boolean
  next_cursor: number | null
}

export type SendMessageHandlers = {
  onDelta: (delta: string) => void
  onDone: (payload: { conversation_id: string; message_id: string; content?: string }) => void
}

export function normalizeDonePayload(payload: Record<string, unknown>): {
  conversation_id: string
  message_id: string
  content?: string
} {
  const messageId = payload.message_id ?? payload.messageId
  const conversationId = payload.conversation_id ?? payload.conversationId
  const content = payload.content
  return {
    conversation_id: conversationId != null ? String(conversationId) : '',
    message_id: messageId != null ? String(messageId) : '',
    content: typeof content === 'string' && content.length > 0 ? content : undefined,
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function requireAuthToken(): string {
  const token = getAuthToken()
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', '로그인이 필요합니다.')
  }
  return token
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${requireAuthToken()}`,
  }
}

let unauthorizedHandler: (() => void) | null = null

/** 401 시 로그인 화면으로 돌리기 위해 App에서 등록한다. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { code?: string; message?: string }
    return new ApiError(
      response.status,
      body.code ?? 'UNKNOWN',
      body.message ?? `요청 실패 (${response.status})`,
    )
  } catch {
    return new ApiError(response.status, 'UNKNOWN', `요청 실패 (${response.status})`)
  }
}

async function fetchWithAuth(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    headers: withAuthHeaders(init?.headers),
  })
  if (response.status === 401 && getAuthToken()) {
    clearAuthToken()
    unauthorizedHandler?.()
  }
  return response
}

async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetchWithAuth(input, init)
  if (!response.ok) {
    throw await parseApiError(response)
  }
  return response
}

function withAuthHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers)
  if (!merged.has('Authorization')) {
    merged.set('Authorization', `Bearer ${requireAuthToken()}`)
  }
  return merged
}

export async function listConversations(): Promise<Conversation[]> {
  const response = await apiFetch('/api/v1/conversations', {
    headers: authHeaders(),
  })
  return response.json()
}

export async function createConversation(title?: string, chatCategory?: string): Promise<Conversation> {
  const payload: { title?: string; chat_category?: string } = {}
  if (title) {
    payload.title = title
  }
  if (chatCategory) {
    payload.chat_category = chatCategory
  }
  const response = await apiFetch('/api/v1/conversations', {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function deleteConversations(conversationIds: string[]): Promise<void> {
  await apiFetch('/api/v1/conversations', {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  })
}

type RawMessage = {
  id?: string
  message_id?: string | number
  role?: string
  content?: string
}

type MessagesPagePayload = MessagesPage & {
  content?: RawMessage[]
}

function normalizeRole(role: string | undefined): ChatMessage['role'] {
  return role?.trim().toLowerCase() === 'user' ? 'user' : 'assistant'
}

function normalizeMessage(message: RawMessage): ChatMessage {
  const id = message.id ?? (message.message_id != null ? String(message.message_id) : '')
  return {
    id,
    role: normalizeRole(message.role),
    content: message.content ?? '',
  }
}

export async function listMessages(conversationId: string, size = 50): Promise<ChatMessage[]> {
  const response = await apiFetch(
    `/api/v1/conversations/${conversationId}/messages?size=${size}`,
    {
      headers: authHeaders(),
    },
  )
  const page = (await response.json()) as MessagesPagePayload
  const raw = page.messages ?? page.content ?? []
  return raw.map(normalizeMessage).filter((message) => message.id.length > 0)
}

/** SSE 직후 listMessages가 빈 assistant를 줄 때 스트리밍 본문을 보존한다. */
export function reconcileMessages(local: ChatMessage[], server: ChatMessage[]): ChatMessage[] {
  if (server.length === 0) {
    return local
  }
  const lastLocalAssistant = [...local]
    .reverse()
    .find((message) => message.role === 'assistant' && message.content.trim().length > 0)
  return server.map((message, index, all) => {
    if (
      message.role === 'assistant' &&
      !message.content.trim() &&
      index === all.length - 1 &&
      lastLocalAssistant
    ) {
      return { ...message, content: lastLocalAssistant.content }
    }
    return message
  })
}

export async function sendMessageStream(
  conversationId: string,
  content: string,
  handlers: SendMessageHandlers,
  chatCategory?: string,
): Promise<void> {
  const payload: { content: string; chat_category?: string } = { content }
  if (chatCategory) {
    payload.chat_category = chatCategory
  }
  const response = await fetchWithAuth(`/api/v1/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    throw await parseApiError(response)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    buffer = consumeSseBuffer(buffer, handlers)
  }
  consumeSseBuffer(buffer, handlers, true)
}

export function consumeSseBuffer(
  buffer: string,
  handlers: SendMessageHandlers,
  flush = false,
): string {
  const blocks = buffer.split('\n\n')
  const remainder = flush ? '' : blocks.pop() ?? ''

  for (const block of blocks) {
    if (!block.trim()) {
      continue
    }
    let event = 'message'
    let data = ''
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice('event:'.length).trim()
      } else if (line.startsWith('data:')) {
        data = line.slice('data:'.length).trim()
      }
    }
    if (!data) {
      continue
    }
    const payload = JSON.parse(data) as Record<string, unknown>
    if (event === 'delta' && typeof payload.delta === 'string' && payload.delta) {
      handlers.onDelta(payload.delta)
      continue
    }
    if (event === 'done' || payload.status === 'done') {
      handlers.onDone(normalizeDonePayload(payload))
      continue
    }
    if (payload.status === 'response_completed') {
      const completedText =
        typeof payload.message === 'string' && payload.message
          ? payload.message
          : typeof payload.text === 'string' && payload.text
            ? payload.text
            : null
      if (completedText) {
        handlers.onDelta(completedText)
      }
      handlers.onDone(normalizeDonePayload(payload))
    }
  }

  return remainder
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return `${error.message} — 로그인·토큰을 확인하세요.`
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다'
}
