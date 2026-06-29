import {
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  Globe2,
  Loader2,
  LogOut,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Send,
  Square,
  Trash2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HYOBEE_LABELS, pickPlaceholder, pickWelcomeMessage } from '../hyobee/strings'
import {
  type Conversation,
  createConversation,
  deleteConversations,
  formatApiError,
  listConversations,
  listMessages,
  reconcileMessages,
  sendMessageStream,
} from '../lib/api'
import { searchModeLabel, searchTypeFromChatCategory, toApiChatCategory, type SearchType } from '../lib/chat-category'
import {
  applyUiTheme,
  getStoredUiTheme,
  uiThemeLabel,
  type UiTheme,
} from '../lib/ui-theme'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatPageProps = {
  onLogout?: () => void
}

function ConversationCategoryBadge({ chatCategory }: { chatCategory?: string }) {
  if (chatCategory === 'rnd_search') {
    return (
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[10px] font-semibold uppercase tracking-wide text-violet-800 ring-1 ring-violet-200"
        aria-label="journal"
      >
        journal
      </span>
    )
  }
  if (chatCategory === 'web_search') {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700 ring-1 ring-sky-200">
        <Globe2 className="size-4" aria-hidden="true" />
      </span>
    )
  }
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200">
      <Building2 className="size-4" aria-hidden="true" />
    </span>
  )
}

const SEARCH_MODE_OPTIONS: { type: SearchType; label: string; icon: LucideIcon }[] = [
  { type: 'internal', label: HYOBEE_LABELS.internalSearch, icon: Building2 },
  { type: 'journal', label: HYOBEE_LABELS.journalSearch, icon: BookOpen },
  { type: 'web', label: HYOBEE_LABELS.webSearch, icon: Globe2 },
]

const THEME_OPTIONS: { theme: UiTheme; label: string }[] = [
  { theme: 'light', label: HYOBEE_LABELS.themeLight },
  { theme: 'dark', label: HYOBEE_LABELS.themeDark },
  { theme: 'gray', label: HYOBEE_LABELS.themeGray },
]

const DEFAULT_USER_NAME = '사용자'
const KATSULABS_LOGO_SRC = '/katsulabs-logo.png'
const KATSULABS_LOGO_CLASS = 'rounded-[19%] ring-1 ring-border'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="응답 생성 중">
      <span className="typing-dot size-2 rounded-full bg-zinc-400" />
      <span className="typing-dot size-2 rounded-full bg-zinc-400" />
      <span className="typing-dot size-2 rounded-full bg-zinc-400" />
    </div>
  )
}

export function ChatPage({ onLogout }: ChatPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<SearchType>('internal')
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [uiTheme, setUiTheme] = useState<UiTheme>(() => getStoredUiTheme())
  const [welcomeMessage, setWelcomeMessage] = useState(() =>
    pickWelcomeMessage(DEFAULT_USER_NAME),
  )
  const [placeholder, setPlaceholder] = useState(() => pickPlaceholder('internal'))
  const chatMessageRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const searchMenuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const hasConversation = messages.length > 0 || streaming
  const showWelcomeLayout = !hasConversation && !loadingHistory
  const inputEmpty = input.trim().length === 0
  const apiChatCategory = toApiChatCategory(searchType)

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

  useEffect(() => {
    setPlaceholder(pickPlaceholder(searchType))
  }, [searchType])

  useEffect(() => {
    if (!searchMenuOpen && !themeMenuOpen) {
      return
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (searchMenuOpen && searchMenuRef.current && !searchMenuRef.current.contains(target)) {
        setSearchMenuOpen(false)
      }
      if (themeMenuOpen && themeMenuRef.current && !themeMenuRef.current.contains(target)) {
        setThemeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [searchMenuOpen, themeMenuOpen])

  const selectSearchType = useCallback((next: SearchType) => {
    setSearchType(next)
    setSearchMenuOpen(false)
    textareaRef.current?.focus()
  }, [])

  const selectUiTheme = useCallback((next: UiTheme) => {
    applyUiTheme(next)
    setUiTheme(next)
    setThemeMenuOpen(false)
  }, [])

  const activeSearchOption = useMemo(
    () => SEARCH_MODE_OPTIONS.find((option) => option.type === searchType) ?? SEARCH_MODE_OPTIONS[0],
    [searchType],
  )

  useEffect(() => {
    const container = chatMessageRef.current
    if (!container) {
      return
    }
    container.scrollTop = container.scrollHeight
  }, [messages, streaming])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [input])

  const refreshWelcome = useCallback(() => {
    setWelcomeMessage(pickWelcomeMessage(DEFAULT_USER_NAME))
  }, [])

  const selectConversation = useCallback(
    async (id: string) => {
      const item = conversations.find((conversation) => conversation.id === id)
      if (item?.chat_category) {
        setSearchType(searchTypeFromChatCategory(item.chat_category))
      }
      setConversationId(id)
      setDeleteMode(false)
      setSelectedIds(new Set())
      await loadHistory(id)
    },
    [conversations, loadHistory],
  )

  const startNewConversation = useCallback(async () => {
    setError(null)
    setDeleteMode(false)
    setSelectedIds(new Set())
    refreshWelcome()
    try {
      const conversation = await createConversation('새 대화')
      setConversations((prev) => [conversation, ...prev])
      setConversationId(conversation.id)
      setMessages([])
    } catch (err) {
      setError(formatApiError(err))
    }
  }, [refreshWelcome])

  const toggleDeleteMode = useCallback(() => {
    setDeleteMode((prev) => !prev)
    setSelectedIds(new Set())
  }, [])

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      if (!checked) {
        setSelectedIds(new Set())
        return
      }
      setSelectedIds(new Set(conversations.map((item) => item.id)))
    },
    [conversations],
  )

  const toggleSelectConversation = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const removeSelectedConversations = useCallback(async () => {
    if (selectedIds.size === 0) {
      return
    }
    setError(null)
    try {
      await deleteConversations([...selectedIds])
      setConversations((prev) => prev.filter((item) => !selectedIds.has(item.id)))
      if (conversationId && selectedIds.has(conversationId)) {
        setConversationId(null)
        setMessages([])
        refreshWelcome()
      }
      setSelectedIds(new Set())
      setDeleteMode(false)
    } catch (err) {
      setError(formatApiError(err))
    }
  }, [conversationId, refreshWelcome, selectedIds])

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
        const conversation = await createConversation('새 대화', apiChatCategory)
        id = conversation.id
        setConversationId(id)
        setConversations((prev) => [conversation, ...prev])
      }

      await sendMessageStream(
        id,
        content,
        {
          onDelta: (delta) => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + delta }
                  : message,
              ),
            )
          },
          onDone: (payload) => {
            setMessages((prev) =>
              prev.map((message) => {
                if (message.id !== assistantId) {
                  return message
                }
                const nextId = payload.message_id || assistantId
                const nextContent =
                  payload.content && payload.content.length > 0
                    ? payload.content
                    : message.content
                return { ...message, id: nextId, content: nextContent }
              }),
            )
            if (payload.title && id) {
              setConversations((prev) =>
                prev.map((conversation) =>
                  conversation.id === id
                    ? { ...conversation, title: payload.title! }
                    : conversation,
                ),
              )
            }
          },
        },
        apiChatCategory,
      )

      const history = await listMessages(id)
      setMessages((prev) => reconcileMessages(prev, history))
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setStreaming(false)
    }
  }, [apiChatCategory, conversationId, input, streaming])

  const allSelected =
    conversations.length > 0 && selectedIds.size === conversations.length

  const activeTitle = useMemo(() => {
    if (!conversationId) {
      return '새 대화'
    }
    return conversations.find((item) => item.id === conversationId)?.title ?? '대화'
  }, [conversationId, conversations])

  const composerInput = (
    <div className="mx-auto w-full max-w-3xl">
      {error ? (
        <div
          className="mb-3 flex items-start justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded p-0.5 hover:bg-destructive/10"
            aria-label="오류 닫기"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] border border-input bg-card shadow-sm ring-offset-background focus-within:border-ring/40 focus-within:ring-2 focus-within:ring-ring/20">
        <textarea
          ref={textareaRef}
          value={input}
          rows={1}
          disabled={streaming}
          placeholder={placeholder}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void send()
            }
          }}
          className="max-h-40 min-h-[52px] w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <div ref={searchMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setSearchMenuOpen((prev) => !prev)}
              className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              aria-haspopup="listbox"
              aria-expanded={searchMenuOpen}
              aria-label={`${HYOBEE_LABELS.searchMode}: ${activeSearchOption.label}`}
            >
              <activeSearchOption.icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{activeSearchOption.label}</span>
              <ChevronDown
                className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${searchMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {searchMenuOpen ? (
              <div
                role="listbox"
                aria-label={HYOBEE_LABELS.searchMode}
                className="absolute bottom-full left-0 z-20 mb-2 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg"
              >
                {SEARCH_MODE_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const selected = option.type === searchType
                  return (
                    <button
                      key={option.type}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectSearchType(option.type)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? 'bg-accent font-medium text-accent-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="flex-1">{option.label}</span>
                      {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            disabled={streaming ? false : inputEmpty}
            onClick={() => {
              if (streaming) {
                return
              }
              void send()
            }}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
            aria-label={streaming ? '응답 생성 중' : '메시지 전송'}
          >
            {streaming ? (
              <Square className="size-4 fill-current" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-out md:relative md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'md:w-72' : 'md:w-0 md:overflow-hidden md:border-r-0 md:opacity-0'
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="size-8 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
            <img
              src={KATSULABS_LOGO_SRC}
              alt=""
              className="size-full origin-center scale-[1.85] object-cover object-center"
              aria-hidden="true"
            />
          </div>
          <span className="truncate font-brand text-sm font-semibold tracking-tight">{HYOBEE_LABELS.brand}</span>
        </div>

        <div className="flex flex-col gap-1 p-3">
          <button
            type="button"
            onClick={() => void startNewConversation()}
            className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            <MessageSquarePlus className="size-4 shrink-0" aria-hidden="true" />
            {HYOBEE_LABELS.newConversation}
          </button>
          <button
            type="button"
            onClick={toggleDeleteMode}
            className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
              deleteMode
                ? 'bg-destructive/10 text-destructive'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Trash2 className="size-4 shrink-0" aria-hidden="true" />
            {HYOBEE_LABELS.deleteConversations}
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {HYOBEE_LABELS.recentConversations}
            </span>
            {deleteMode && conversations.length > 0 ? (
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => toggleSelectAll(event.target.checked)}
                    className="rounded border-input"
                  />
                  전체
                </label>
                <button
                  type="button"
                  onClick={() => void removeSelectedConversations()}
                  disabled={selectedIds.size === 0}
                  className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-40"
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                불러오는 중…
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">{HYOBEE_LABELS.emptyConversations}</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {conversations.map((conversation) => {
                  const isActive = conversation.id === conversationId
                  return (
                    <li key={conversation.id}>
                      <div className="flex items-center gap-1">
                        {deleteMode ? (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(conversation.id)}
                            onChange={(event) =>
                              toggleSelectConversation(conversation.id, event.target.checked)
                            }
                            className="ml-1 rounded border-input"
                            aria-label={`${conversation.title} 선택`}
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => void selectConversation(conversation.id)}
                          className={`flex min-w-0 flex-1 items-center gap-1 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? 'bg-accent font-medium text-accent-foreground'
                              : 'text-sidebar-foreground hover:bg-accent/60'
                          }`}
                        >
                          <ConversationCategoryBadge chatCategory={conversation.chat_category} />
                          <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {DEFAULT_USER_NAME.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{DEFAULT_USER_NAME}</p>
              <p className="truncate text-xs text-muted-foreground">Katsubot</p>
            </div>
            <div ref={themeMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setThemeMenuOpen((prev) => !prev)}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-haspopup="listbox"
                aria-expanded={themeMenuOpen}
                aria-label={`${HYOBEE_LABELS.themeSettings}: ${uiThemeLabel(uiTheme)}`}
                title={HYOBEE_LABELS.themeSettings}
              >
                <Palette className="size-4" aria-hidden="true" />
              </button>
              {themeMenuOpen ? (
                <div
                  role="listbox"
                  aria-label={HYOBEE_LABELS.themeSettings}
                  className="absolute bottom-full right-0 z-20 mb-2 min-w-[7.5rem] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg"
                >
                  {THEME_OPTIONS.map((option) => {
                    const selected = option.theme === uiTheme
                    return (
                      <button
                        key={option.theme}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => selectUiTheme(option.theme)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selected
                            ? 'bg-accent font-medium text-accent-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="flex-1">{option.label}</span>
                        {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label={HYOBEE_LABELS.logout}
              title={HYOBEE_LABELS.logout}
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-5" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="size-5" aria-hidden="true" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">{activeTitle}</h1>
          </div>
        </header>

        <main ref={chatMessageRef} className="min-h-0 flex-1 overflow-y-auto">
          {showWelcomeLayout ? (
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:py-16">
              <h2 className="bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-400 bg-clip-text text-center text-[1.75rem] font-medium leading-snug tracking-tight text-transparent sm:text-4xl">
                {welcomeMessage}
              </h2>
              <p className="mt-4 max-w-lg text-center text-sm text-muted-foreground">
                {searchModeLabel(searchType)} 모드로 질문해 보세요.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
              {loadingHistory && messages.length === 0 ? (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              ) : (
                messages.map((message) =>
                  message.role === 'user' ? (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex gap-3">
                      <img
                        src={KATSULABS_LOGO_SRC}
                        alt=""
                        className={`mt-0.5 size-7 shrink-0 ${KATSULABS_LOGO_CLASS}`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-foreground">
                        {message.content ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <TypingIndicator />
                        )}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          )}
        </main>

        <footer
          className={`shrink-0 bg-background px-4 pb-3 pt-2 ${
            showWelcomeLayout ? '' : 'border-t border-border'
          }`}
        >
          {composerInput}
          <p className="mx-auto mt-2 w-full max-w-3xl text-center text-xs text-muted-foreground">
            {HYOBEE_LABELS.aiDisclaimer}
          </p>
        </footer>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          aria-label="사이드바 닫기"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </div>
  )
}
