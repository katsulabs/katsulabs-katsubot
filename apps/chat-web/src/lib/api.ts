import { getAuthToken } from './auth'

export type Conversation = {
  id: string
  title: string
  created_at: string
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
  onDone: (payload: { conversation_id: string; message_id: string }) => void
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

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getAuthToken()}`,
  }
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

async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init)
  if (!response.ok) {
    throw await parseApiError(response)
  }
  return response
}

export async function listConversations(): Promise<Conversation[]> {
  const response = await apiFetch('/api/v1/conversations', {
    headers: authHeaders(),
  })
  return response.json()
}

export async function createConversation(title?: string): Promise<Conversation> {
  const response = await apiFetch('/api/v1/conversations', {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(title ? { title } : {}),
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

export async function listMessages(conversationId: string): Promise<ChatMessage[]> {
  const response = await apiFetch(`/api/v1/conversations/${conversationId}/messages`, {
    headers: authHeaders(),
  })
  const page = (await response.json()) as MessagesPage
  return page.messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
  }))
}

export async function sendMessageStream(
  conversationId: string,
  content: string,
  handlers: SendMessageHandlers,
): Promise<void> {
  const response = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ content }),
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
    const payload = JSON.parse(data)
    if (event === 'delta' && payload.delta) {
      handlers.onDelta(payload.delta)
    } else if (event === 'done') {
      handlers.onDone(payload)
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
