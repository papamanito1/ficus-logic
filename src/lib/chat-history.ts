export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'sam-chat-history'

function getStorageKey(userId: string) {
  return `${STORAGE_KEY}:${userId}`
}

export function getChatSessions(userId: string): ChatSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    if (!raw) return []
    const sessions: ChatSession[] = JSON.parse(raw)
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  }
}

export function saveChatSession(userId: string, session: ChatSession): void {
  if (typeof window === 'undefined') return
  const sessions = getChatSessions(userId)
  const idx = sessions.findIndex((s) => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.unshift(session)
  }
  localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions))
}

export function deleteChatSession(userId: string, sessionId: string): void {
  if (typeof window === 'undefined') return
  const sessions = getChatSessions(userId).filter((s) => s.id !== sessionId)
  localStorage.setItem(getStorageKey(userId), JSON.stringify(sessions))
}

export function createChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function deriveTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === 'user')
  if (!first) return 'New Chat'
  const text = first.content.trim()
  return text.length > 50 ? text.slice(0, 50) + '...' : text
}
