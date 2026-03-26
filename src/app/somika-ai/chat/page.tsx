'use client'

import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'
import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/components/somika/ChatMessage'
import ChatSidebar from '@/components/somika/ChatSidebar'
import { SamBadge } from '@/components/somika/SamBadge'
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession,
  createChatId,
  deriveTitle,
  type ChatSession,
  type ChatMessage as StoredMessage,
} from '@/lib/chat-history'

function getTextContent(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text!)
    .join('')
}

const ease = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const EXAMPLES = [
  {
    label: 'Engineering',
    text: 'Senior React Developer, Bangalore — 5+ years, TypeScript, Node.js',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'Data & AI',
    text: 'Data Scientist, Hyderabad — ML, Python, 3+ years',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
  },
  {
    label: 'Product',
    text: 'Product Manager, Mumbai — SaaS B2B, 5+ years',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
]

export default function SamChatPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [chatId, setChatId] = useState(() => createChatId())
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, setMessages, status, error } =
    useChat({ api: '/api/chat', id: chatId })

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isLoading = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

  // Load sessions from localStorage when user is authenticated
  useEffect(() => {
    if (userId) {
      setSessions(getChatSessions(userId))
    }
  }, [userId])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  // Auto-save chat to localStorage when messages change
  useEffect(() => {
    if (!userId || messages.length === 0) return
    if (status === 'streaming') return

    const stored: StoredMessage[] = messages.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.parts
        ? getTextContent(m.parts as Array<{ type: string; text?: string }>)
        : '',
    }))

    const chatSession: ChatSession = {
      id: chatId,
      title: deriveTitle(stored),
      messages: stored,
      createdAt: sessions.find((s) => s.id === chatId)?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }

    saveChatSession(userId, chatSession)
    setSessions(getChatSessions(userId))
  }, [messages, status, userId, chatId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewChat = useCallback(() => {
    const newId = createChatId()
    setChatId(newId)
    setMessages([])
    setSidebarOpen(false)
  }, [setMessages])

  const handleSelectChat = useCallback((id: string) => {
    if (!userId) return
    const found = getChatSessions(userId).find((s) => s.id === id)
    if (found) {
      setChatId(id)
      setMessages(
        found.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          parts: [{ type: 'text' as const, text: m.content }],
          createdAt: new Date(),
        }))
      )
    }
    setSidebarOpen(false)
  }, [userId, setMessages])

  const handleDeleteChat = useCallback((id: string) => {
    if (!userId) return
    deleteChatSession(userId, id)
    setSessions(getChatSessions(userId))
    if (id === chatId) {
      handleNewChat()
    }
  }, [userId, chatId, handleNewChat])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) handleSubmit(e)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex bg-[#F7F7F5]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(27,117,188,0.06),transparent)]"
        aria-hidden
      />
      {/* Sidebar */}
      <ChatSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        activeChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main chat area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* ── Top bar ── */}
        <motion.header
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex-none border-b border-neutral-200/60 bg-white/75 px-5 py-4 backdrop-blur-xl sm:px-10"
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between pl-11 sm:pl-12">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none opacity-[0.85] transition-opacity duration-300 hover:opacity-100"
              >
                <Image src="/images/logo.png" alt="Ficus Logic" width={100} height={34} className="h-7 w-auto" />
              </Link>
              <div className="hidden h-5 w-px bg-neutral-200/90 sm:block" />
              <div className="flex items-center gap-2.5">
                <SamBadge size="sm" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold tracking-tight text-neutral-900">SAM</span>
                  <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400 sm:block">
                    Recruitment intelligence
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={isLoading ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
                  transition={isLoading ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } : {}}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${isLoading ? 'bg-accent-500' : 'bg-brand-500'}`}
                />
                <span className="hidden text-[11px] font-medium text-neutral-500 sm:inline">
                  {isLoading ? 'Composing…' : 'Ready'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleNewChat}
                className="hidden items-center gap-2 rounded-full border border-neutral-200/90 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:bg-white hover:text-neutral-900 sm:inline-flex"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New chat
              </button>
            </div>
          </div>
        </motion.header>

        {/* ── Chat area ── */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="mx-auto max-w-2xl px-5 py-2 sm:px-8">
            <AnimatePresence mode="wait">
              {!hasMessages ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-14 sm:py-20"
                >
                  <motion.div
                    initial="hidden"
                    animate={mounted ? 'visible' : 'hidden'}
                    variants={stagger}
                    className="mb-14 text-center"
                  >
                    <motion.div variants={fadeUp} className="mb-10">
                      <SamBadge size="lg" />
                    </motion.div>

                    <motion.p
                      variants={fadeUp}
                      className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400"
                    >
                      Ficus Logic
                    </motion.p>

                    <motion.h1
                      variants={fadeUp}
                      className="text-4xl font-light tracking-[-0.035em] text-neutral-900 sm:text-5xl sm:leading-[1.08]"
                    >
                      What role are you
                      <br />
                      <span className="text-neutral-400">hiring for?</span>
                    </motion.h1>

                    <motion.p
                      variants={fadeUp}
                      className="mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-neutral-500"
                    >
                      Describe a mandate or paste a job description.
                      <span className="text-neutral-400"> SAM structures the search.</span>
                    </motion.p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: 1 } : {}}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mb-4 w-full max-w-xl text-left text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400"
                  >
                    Suggested briefs
                  </motion.p>
                  <motion.div
                    initial="hidden"
                    animate={mounted ? 'visible' : 'hidden'}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.45 } } }}
                    className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
                  >
                    {EXAMPLES.map((ex) => (
                      <motion.button
                        key={ex.label}
                        type="button"
                        variants={{
                          hidden: { opacity: 0, y: 14 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                        }}
                        whileHover={{ y: -3, transition: { duration: 0.25 } }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                          handleInputChange({
                            target: { value: ex.text },
                          } as React.ChangeEvent<HTMLTextAreaElement>)
                        }
                        className="group cursor-pointer rounded-2xl border border-neutral-200/80 bg-white p-4 text-left shadow-sm
                                   transition-all duration-500 hover:border-neutral-300/90 hover:shadow-md"
                      >
                        <div className="mb-2.5 flex items-center gap-2">
                          <span className="text-neutral-400 transition-colors duration-300 group-hover:text-accent-600">
                            {ex.icon}
                          </span>
                          <span className="text-[12px] font-semibold tracking-tight text-neutral-900">{ex.label}</span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-neutral-500">{ex.text}</p>
                      </motion.button>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={mounted ? { opacity: 1 } : {}}
                    transition={{ delay: 0.85, duration: 0.6 }}
                    className="mt-10 flex flex-wrap justify-center gap-2"
                  >
                    {['Role blueprint', 'Boolean strings', 'Sourcing waves', 'CSV export'].map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-neutral-200/60 bg-white/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400 backdrop-blur-sm"
                      >
                        {f}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1 py-8 sm:py-10"
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease, delay: i === messages.length - 1 ? 0.05 : 0 }}
                    >
                      <ChatMessage
                        role={msg.role as 'user' | 'assistant'}
                        content={
                          msg.parts
                            ? getTextContent(msg.parts as Array<{ type: string; text?: string }>)
                            : ''
                        }
                      />
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mb-4 flex items-start gap-3.5 pt-2"
                      >
                        <div className="mt-1">
                          <SamBadge size="sm" />
                        </div>
                        <div className="mt-3 flex gap-1.5">
                          {[0, 150, 300].map((delay) => (
                            <motion.span
                              key={delay}
                              animate={{ opacity: [0.25, 1, 0.25] }}
                              transition={{ repeat: Infinity, duration: 1, delay: delay / 1000, ease: 'easeInOut' }}
                              className="h-1.5 w-1.5 rounded-full bg-neutral-300"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-red-100/80 bg-red-50/80 p-4 text-sm text-red-600 backdrop-blur-sm"
                      >
                        {error.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Input bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease }}
          className="flex-none border-t border-neutral-200/50 bg-gradient-to-t from-white via-white to-white/80 px-5 py-5 backdrop-blur-md sm:px-10 sm:py-6"
        >
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div
              className={`relative rounded-2xl border bg-white transition-all duration-500 ${
                inputFocused
                  ? 'border-accent-200/90 shadow-[0_12px_40px_-12px_rgba(27,117,188,0.18)] ring-2 ring-accent-500/10'
                  : 'border-neutral-200/80 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]'
              }`}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Describe the role, location, or paste a full job description…"
                rows={1}
                className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 pr-[3.25rem] text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={input.trim() && !isLoading ? { scale: 1.04 } : {}}
                whileTap={input.trim() && !isLoading ? { scale: 0.96 } : {}}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-white shadow-md shadow-accent-600/25 transition-colors duration-300 hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[11px] font-medium tracking-wide text-neutral-400">
                <kbd className="rounded border border-neutral-200/80 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-500">
                  Shift
                </kbd>
                <span className="mx-1 text-neutral-300">+</span>
                <kbd className="rounded border border-neutral-200/80 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-500">
                  Enter
                </kbd>
                <span className="ml-2">new line</span>
              </p>
              <p className="text-[11px] font-medium text-neutral-400">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 transition-colors hover:text-accent-600"
                >
                  Ficus Logic
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
