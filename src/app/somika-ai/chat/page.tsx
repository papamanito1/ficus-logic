'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/components/somika/ChatMessage'

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

export default function SomikaChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({ api: '/api/chat' })

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mounted, setMounted] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const isLoading = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) handleSubmit(e)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">

      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="flex-none border-b border-neutral-100 bg-white px-5 sm:px-8 py-3.5"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="flex-none opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image src="/images/logo.png" alt="Ficus Logic" width={100} height={34} className="h-7 w-auto" />
            </Link>
            <div className="w-px h-5 bg-neutral-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-950 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">S</span>
              </div>
              <span className="text-[13px] font-semibold text-neutral-900 tracking-tight">Somika</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <motion.span
                animate={isLoading ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                transition={isLoading ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } : {}}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isLoading ? 'bg-accent-400' : 'bg-brand-400'}`}
              />
              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                {isLoading ? 'Thinking...' : 'Ready'}
              </span>
            </div>
            <Link
              href="/somika-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors duration-300 hidden sm:inline"
            >
              About Somika
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Chat area ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-16"
              >
                <motion.div
                  initial="hidden"
                  animate={mounted ? 'visible' : 'hidden'}
                  variants={stagger}
                  className="text-center mb-16"
                >
                  <motion.div variants={fadeUp} className="mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-950">
                      <span className="text-2xl font-light text-white">S</span>
                    </div>
                  </motion.div>

                  <motion.h1
                    variants={fadeUp}
                    className="text-4xl sm:text-5xl font-light tracking-[-0.03em] text-neutral-900 leading-[1.1]"
                  >
                    What role are you
                    <br />
                    <span className="text-neutral-400">hiring for?</span>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="text-base text-neutral-400 font-light mt-6 max-w-sm mx-auto leading-relaxed"
                  >
                    Describe a position or paste a JD.
                    <br />
                    Somika handles the rest.
                  </motion.p>
                </motion.div>

                {/* Example cards */}
                <motion.div
                  initial="hidden"
                  animate={mounted ? 'visible' : 'hidden'}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } } }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl"
                >
                  {EXAMPLES.map((ex) => (
                    <motion.button
                      key={ex.label}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                      }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleInputChange({
                          target: { value: ex.text },
                        } as React.ChangeEvent<HTMLTextAreaElement>)
                      }
                      className="rounded-2xl border border-neutral-200 p-4 text-left cursor-pointer
                                 hover:border-neutral-300 hover:bg-neutral-50
                                 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors duration-300">
                          {ex.icon}
                        </span>
                        <span className="text-[13px] font-medium text-neutral-900">{ex.label}</span>
                      </div>
                      <p className="text-[12px] text-neutral-400 leading-relaxed">{ex.text}</p>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Capability pills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={mounted ? { opacity: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-wrap justify-center gap-2 mt-10"
                >
                  {['Role Blueprint', 'Boolean Queries', 'Sourcing Plan', 'CSV Export', 'Candidate Ranking'].map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-medium tracking-wider uppercase text-neutral-300 border border-neutral-200 rounded-full px-3 py-1"
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
                className="py-10 space-y-1"
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
                      className="flex items-start gap-3 mb-4 pt-2"
                    >
                      <div className="flex-none w-7 h-7 rounded-full bg-neutral-950 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">S</span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[0, 150, 300].map((delay) => (
                          <motion.span
                            key={delay}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: delay / 1000, ease: 'easeInOut' }}
                            className="w-1.5 h-1.5 rounded-full bg-neutral-300"
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
                      className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm"
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
        className="flex-none bg-white border-t border-neutral-100 px-5 sm:px-8 py-4"
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div
            className={`relative rounded-2xl border transition-all duration-400 ${
              inputFocused
                ? 'border-neutral-300 shadow-lg shadow-neutral-900/5'
                : 'border-neutral-200 shadow-none'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Describe the role or paste a job description..."
              rows={1}
              className="w-full resize-none rounded-2xl bg-transparent px-5 py-3.5 pr-14 text-[15px] text-neutral-900 placeholder:text-neutral-300 focus:outline-none"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={input.trim() && !isLoading ? { scale: 1.06 } : {}}
              whileTap={input.trim() && !isLoading ? { scale: 0.94 } : {}}
              className="absolute right-2.5 bottom-2.5 h-8 w-8 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[10px] text-neutral-300">
              Shift + Enter for new line
            </p>
            <p className="text-[10px] text-neutral-300">
              Powered by{' '}
              <Link href="/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 transition-colors">
                Ficus Logic
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
