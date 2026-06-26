import { useCallback, useState } from 'react'
import { createConversation, sendMessageStream } from '../lib/api'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ensureConversation = useCallback(async () => {
    if (conversationId) {
      return conversationId
    }
    const conversation = await createConversation('MVP 채팅')
    setConversationId(conversation.id)
    return conversation.id
  }, [conversationId])

  const send = useCallback(async () => {
    const content = input.trim()
    if (!content || streaming) {
      return
    }

    setError(null)
    setStreaming(true)
    setInput('')

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }
    setMessages((prev) => [...prev, userMessage])

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const id = await ensureConversation()
      await sendMessageStream(id, content, {
        onDelta: (delta) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + delta }
                : message,
            ),
          )
        },
        onDone: () => {},
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '전송 실패')
    } finally {
      setStreaming(false)
    }
  }, [ensureConversation, input, streaming])

  return (
    <main className="chat">
      <header className="chat__header">
        <h1>Katsulabs Chatbot</h1>
        <p>KC-007 Phase 1 — 외부 RAG SSE</p>
      </header>

      <section className="chat__messages" aria-live="polite">
        {messages.length === 0 ? (
          <p className="chat__empty">메시지를 입력해 대화를 시작하세요.</p>
        ) : (
          messages.map((message) => (
            <article key={message.id} className={`chat__bubble chat__bubble--${message.role}`}>
              <strong>{message.role === 'user' ? '나' : '봇'}</strong>
              <p>{message.content || (streaming ? '…' : '')}</p>
            </article>
          ))
        )}
      </section>

      {error ? <p className="chat__error">{error}</p> : null}

      <form
        className="chat__composer"
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="메시지 입력"
          disabled={streaming}
        />
        <button type="submit" disabled={streaming || !input.trim()}>
          전송
        </button>
      </form>
    </main>
  )
}
