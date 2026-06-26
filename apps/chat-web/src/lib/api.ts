export type Conversation = {
  id: string
  title: string
  created_at: string
}

export type SendMessageHandlers = {
  onDelta: (delta: string) => void
  onDone: (payload: { conversation_id: string; message_id: string }) => void
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN ?? 'dev-token'}`,
  }
}

export async function createConversation(title?: string): Promise<Conversation> {
  const response = await fetch('/api/v1/conversations', {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(title ? { title } : {}),
  })
  if (!response.ok) {
    throw new Error(`createConversation failed: ${response.status}`)
  }
  return response.json()
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
    throw new Error(`sendMessage failed: ${response.status}`)
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
