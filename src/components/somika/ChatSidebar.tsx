'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { ChatSession } from '@/lib/chat-history'

interface ChatSidebarProps {
  open: boolean
  onToggle: () => void
  sessions: ChatSession[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}

function formatRelativeDate(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ChatSidebar({
  open,
  onToggle,
  sessions,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const { data: session, status } = useSession()
  const isAuth = status === 'authenticated'

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={onToggle}
        className="fixed top-3.5 left-3.5 z-[210] w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors shadow-sm"
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[201] bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed top-0 left-0 bottom-0 z-[202] w-[280px] bg-neutral-950 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <span className="text-[13px] font-semibold text-white tracking-tight">Somika AI</span>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* New Chat button */}
            <div className="px-3 pb-3">
              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-neutral-800 text-[13px] font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Chat
              </button>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto px-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
              {!isAuth ? (
                <div className="px-2 py-8 text-center">
                  <p className="text-[12px] text-neutral-500 mb-4 leading-relaxed">
                    Sign in to save your<br />chat history
                  </p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <p className="text-[12px] text-neutral-500">No conversations yet</p>
                </div>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="group relative">
                    <button
                      onClick={() => onSelectChat(s.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-colors ${
                        s.id === activeChatId
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                      }`}
                    >
                      <p className="truncate font-medium">{s.title}</p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{formatRelativeDate(s.updatedAt)}</p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(s.id)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-neutral-700 transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                        <path d="m7 21 5-5 5 5M7 3l5 5 5-5" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* User / Auth section */}
            <div className="flex-none border-t border-neutral-800 p-3">
              {isAuth && session?.user ? (
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-neutral-400">
                      {session.user.name?.[0] ?? '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-200 truncate">{session.user.name}</p>
                    <p className="text-[11px] text-neutral-600 truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
                    title="Sign out"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white text-neutral-900 text-[13px] font-medium hover:bg-neutral-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
