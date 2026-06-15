import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  MessageSquare,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Send,
  ChevronLeft,
  ChevronRight,
  Bot,
  User as UserIcon,
  Pencil,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getSessions,
  createSession,
  deleteSession,
  renameSession,
  getMessages,
  sendMessage,
} from '../../services/chatService'
import type { ChatSession, ChatMessage } from '../../types/chat'

const SUGGESTED = [
  'Can my PC run Elden Ring?',
  'What should I upgrade first?',
  'Recommend action RPGs for my system.',
  'How many FPS can I expect in Cyberpunk 2077?',
  'Compare my GPU with newer models.',
]

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return d.toLocaleDateString()
}

export default function ChatPage() {
  const { token } = useAuth()

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [aiAvailable, setAiAvailable] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // ----------------------------- data loaders ----------------------------

  const loadSessions = useCallback(async () => {
    if (!token) return
    try {
      const data = await getSessions(token)
      setSessions(data)
    } catch {
      /* silently ignore */
    }
  }, [token])

  const loadMessages = useCallback(
    async (sessionId: number) => {
      if (!token) return
      setLoadingMessages(true)
      try {
        const data = await getMessages(token, sessionId)
        setMessages(data)
      } catch {
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    },
    [token],
  )

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    if (activeSessionId !== null) {
      loadMessages(activeSessionId)
    }
  }, [activeSessionId, loadMessages])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // ----------------------------- session actions -------------------------

  const handleNewChat = async () => {
    if (!token) return
    try {
      const session = await createSession(token)
      setSessions((prev) => [session, ...prev])
      setActiveSessionId(session.id)
      setMessages([])
      setAiAvailable(true)
    } catch {
      /* ignore */
    }
  }

  const handleSelectSession = (id: number) => {
    if (id === activeSessionId) return
    setActiveSessionId(id)
    setAiAvailable(true)
  }

  const handleDeleteSession = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!token) return
    try {
      await deleteSession(token, id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeSessionId === id) {
        setActiveSessionId(null)
        setMessages([])
      }
    } catch {
      /* ignore */
    }
  }

  const startEdit = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation()
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const confirmEdit = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!token || !editTitle.trim()) return
    try {
      const updated = await renameSession(token, id, editTitle.trim())
      setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)))
    } catch {
      /* ignore */
    } finally {
      setEditingId(null)
    }
  }

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
  }

  // ----------------------------- send message ----------------------------

  const handleSend = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || !token || sending) return

    // Auto-create session if none selected
    let sessionId = activeSessionId
    if (sessionId === null) {
      try {
        const session = await createSession(token)
        setSessions((prev) => [session, ...prev])
        setActiveSessionId(session.id)
        sessionId = session.id
      } catch {
        return
      }
    }

    setInput('')
    setSending(true)

    // Optimistic user bubble
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      session_id: sessionId,
      role: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const result = await sendMessage(token, sessionId, trimmed)
      setAiAvailable(result.ai_available)

      // Replace optimistic + add assistant reply
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== tempUserMsg.id)
        return [...withoutOptimistic, result.user_message, result.assistant_message]
      })

      // Refresh sessions list (title may have been auto-set)
      await loadSessions()
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          session_id: sessionId!,
          role: 'assistant',
          content: '⚠️ Could not reach the server. Please check your connection and try again.',
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend(input)
    }
  }

  // ----------------------------- layout helpers --------------------------

  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 flex bg-gaming-bg p-4 md:p-6 pb-12 md:pb-16'
    : 'flex h-[calc(100vh-64px)] bg-gaming-bg p-4 md:p-6 pb-12 md:pb-16'

  // ============================================================ RENDER ==
  return (
    <div className={containerClass}>
      <div className="w-full max-w-[1200px] mx-auto flex">
      {/* ----------------------------------------------------------------
          LEFT SIDEBAR — session list
      ---------------------------------------------------------------- */}
      <aside
        className={`flex flex-col bg-gaming-card border-r border-white/10 transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-gaming-accent" />
            <span className="text-sm font-semibold text-white">Chats</span>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1 rounded-lg bg-gaming-accent/20 hover:bg-gaming-accent/40 text-gaming-accent px-2 py-1 text-xs font-medium transition"
            title="New chat"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gaming-secondary">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`group relative mx-2 mb-1 flex items-start gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all ${
                  activeSessionId === s.id
                    ? 'bg-gaming-accent/20 border border-gaming-accent/40'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-gaming-secondary" />
                <div className="flex-1 min-w-0">
                  {editingId === s.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void confirmEdit(e as any, s.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="flex-1 bg-gaming-surface rounded px-1 py-0.5 text-xs text-white outline-none border border-gaming-accent/40"
                      />
                      <button onClick={(e) => void confirmEdit(e, s.id)} className="text-status-excellent hover:opacity-80">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEdit} className="text-gaming-secondary hover:opacity-80">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-white truncate">{s.title}</p>
                      <p className="text-[10px] text-gaming-secondary mt-0.5">{formatDate(s.updated_at)}</p>
                    </>
                  )}
                </div>

                {/* Action buttons shown on hover */}
                {editingId !== s.id && (
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => startEdit(e, s)}
                      className="p-1 rounded hover:bg-white/10 text-gaming-secondary hover:text-white transition"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => void handleDeleteSession(e, s.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-gaming-secondary hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ----------------------------------------------------------------
          SIDEBAR TOGGLE BUTTON
      ---------------------------------------------------------------- */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-5 h-10 rounded-r-lg bg-gaming-card border border-white/10 border-l-0 text-gaming-secondary hover:text-white hover:bg-gaming-surface transition"
        style={{ left: sidebarOpen ? '18rem' : '0' }}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* ----------------------------------------------------------------
          MAIN CHAT AREA
      ---------------------------------------------------------------- */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-gaming-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gaming-accent/20">
              <Bot className="w-4 h-4 text-gaming-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">GameReady AI</p>
              <p className="text-xs text-gaming-secondary">Gaming compatibility assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!aiAvailable && (
              <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 text-xs text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                AI unavailable
              </div>
            )}
            <button
              onClick={() => setFullscreen((f) => !f)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gaming-secondary hover:text-white transition"
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
          {activeSessionId === null && messages.length === 0 ? (
            // Welcome / empty state
            <div className="flex flex-col items-center justify-center h-full gap-8 pb-10">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gaming-accent/20 mx-auto mb-4">
                  <Bot className="w-8 h-8 text-gaming-accent" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">GameReady AI</h2>
                <p className="text-gaming-secondary text-sm max-w-sm">
                  Ask me about game compatibility, FPS estimates, hardware upgrades, or game recommendations for your system.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => void handleSend(q)}
                    className="text-left rounded-xl border border-gaming-accent/20 bg-white/5 hover:bg-gaming-accent/10 hover:border-gaming-accent/40 px-4 py-3 text-sm text-gaming-secondary hover:text-white transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : loadingMessages ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gaming-accent/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 && activeSessionId !== null && (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <p className="text-gaming-secondary text-sm">Start the conversation below.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => void handleSend(q)}
                        className="rounded-full border border-gaming-accent/20 bg-white/5 hover:bg-gaming-accent/10 hover:border-gaming-accent/40 px-3 py-1.5 text-xs text-gaming-secondary hover:text-white transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {sending && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ----------------------------------------------------------------
            STICKY INPUT BAR
        ---------------------------------------------------------------- */}
        <div className="shrink-0 border-t border-white/10 bg-gaming-card px-4 md:px-8 py-4">
          {!aiAvailable && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-4 py-2.5 text-xs text-yellow-300">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                The AI chat is not available now. This may be due to an API connection issue or quota limit. Please try again later.
              </span>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSend(input)
            }}
            className="flex items-end gap-3"
          >
            <div className="flex-1 rounded-2xl border border-white/10 bg-gaming-surface focus-within:border-gaming-accent/50 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about compatibility, upgrades, or game recommendations..."
                disabled={sending}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-gaming-secondary outline-none max-h-40 overflow-y-auto leading-relaxed"
                style={{ minHeight: '48px' }}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gaming-accent hover:bg-gaming-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
              title="Send"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="mt-2 text-[10px] text-gaming-secondary text-center">
            Press <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono">Enter</kbd> to send · <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono">Shift+Enter</kbd> for newline
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

// ============================================================ SUB-COMPONENTS

function MessageBubble(props: { message: ChatMessage }) {
  const message = props.message
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-1 ${isUser ? 'bg-gaming-accent/30' : 'bg-gaming-surface border border-gaming-accent/30'}`}>
        {isUser ? <UserIcon className="w-4 h-4 text-gaming-accent" /> : <Bot className="w-4 h-4 text-gaming-accent" />}
      </div>

      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${isUser ? 'bg-gaming-accent text-white rounded-tr-sm' : 'bg-gaming-surface text-gaming-secondary border border-white/10 rounded-tl-sm'}`}>
        <p className="text-[10px] font-semibold mb-1 opacity-60 uppercase tracking-wide">{isUser ? 'You' : 'GameReady AI'}</p>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <p className="mt-1.5 text-[10px] opacity-40 text-right">{formatDate(message.created_at)}</p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gaming-surface border border-gaming-accent/30 shrink-0 mt-1">
        <Bot className="w-4 h-4 text-gaming-accent" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-gaming-surface border border-white/10 px-4 py-3">
        <p className="text-[10px] font-semibold mb-1.5 opacity-60 uppercase tracking-wide text-gaming-secondary">
          GameReady AI
        </p>
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-gaming-accent/60 animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
