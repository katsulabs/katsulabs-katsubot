import { useCallback, useEffect, useState } from 'react'
import {
  type Conversation,
  createConversation,
  deleteConversations,
  formatApiError,
  listConversations,
  listMessages,
  sendMessageStream,
} from '../lib/api'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConversations = useCallback(async () => {
    setLoadingList(true)
    setError(null)
    try {
      const items = await listConversations()
      setConversations(items)
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoadingList(false)
    }
  }, [])

  const loadHistory = useCallback(async (id: string) => {
    setLoadingHistory(true)
    setError(null)
    try {
      const history = await listMessages(id)
      setMessages(history)
    } catch (err) {
      setMessages([])
      setError(formatApiError(err))
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  const selectConversation = useCallback(
    async (id: string) => {
      setConversationId(id)
      await loadHistory(id)
    },
    [loadHistory],
  )

  const startNewConversation = useCallback(async () => {
    setError(null)
    try {
      const conversation = await createConversation('새 대화')
      setConversations((prev) => [conversation, ...prev])
      setConversationId(conversation.id)
      setMessages([])
    } catch (err) {
      setError(formatApiError(err))
    }
  }, [])

  const removeConversation = useCallback(
    async (id: string) => {
      setError(null)
      try {
        await deleteConversations([id])
        setConversations((prev) => prev.filter((item) => item.id !== id))
        if (conversationId === id) {
          setConversationId(null)
          setMessages([])
        }
      } catch (err) {
        setError(formatApiError(err))
      }
    },
    [conversationId],
  )

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
      let id = conversationId
      if (!id) {
        const conversation = await createConversation('새 대화')
        id = conversation.id
        setConversationId(id)
        setConversations((prev) => [conversation, ...prev])
      }

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
        onDone: () => {
          void loadHistory(id!)
        },
      })
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setStreaming(false)
    }
  }, [conversationId, input, loadHistory, streaming])

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar" aria-label="대화 목록">
        <div className="chat-sidebar__header">
          <h2>대화</h2>
          <button type="button" onClick={() => void startNewConversation()}>
            새 대화
          </button>
        </div>

        {loadingList ? <p className="chat-sidebar__hint">목록 불러오는 중…</p> : null}

        <ul className="chat-sidebar__list">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                className={
                  conversation.id === conversationId
                    ? 'chat-sidebar__item chat-sidebar__item--active'
                    : 'chat-sidebar__item'
                }
                onClick={() => void selectConversation(conversation.id)}
              >
                {conversation.title}
              </button>
              <button
                type="button"
                className="chat-sidebar__delete"
                aria-label={`${conversation.title} 삭제`}
                onClick={() => void removeConversation(conversation.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat">
        <header className="chat__header">
          <h1>Katsulabs Chatbot</h1>
          <p>KC-007 Phase 2 — 대화 목록·히스토리</p>
        </header>

        <section className="chat__messages" aria-live="polite">
          {loadingHistory ? (
            <p className="chat__empty">히스토리 불러오는 중…</p>
          ) : messages.length === 0 ? (
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

        {error ? (
          <div className="chat__error-box">
            <p className="chat__error">{error}</p>
            <button type="button" onClick={() => void loadConversations()}>
              다시 시도
            </button>
          </div>
        ) : null}

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
    </div>
  )
}
