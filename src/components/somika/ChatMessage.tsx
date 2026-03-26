'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CsvDownload } from './CsvDownload'
import { SamBadge } from './SamBadge'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-8">
        <div
          className="max-w-[min(72%,28rem)] rounded-[22px] rounded-br-md px-5 py-3.5
                     bg-gradient-to-br from-neutral-900 to-neutral-950
                     text-white/90 shadow-md shadow-neutral-900/12 ring-1 ring-white/[0.08]"
        >
          <p className="whitespace-pre-wrap text-[14px] leading-[1.75] tracking-[-0.01em]">
            {content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3.5 mb-8">
      <div className="flex-none mt-1">
        <SamBadge size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl border border-neutral-200/70 bg-white/95 px-5 py-4 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.06)]
                     backdrop-blur-sm ring-1 ring-neutral-900/[0.02]"
        >
          <div
            className="prose prose-sm max-w-none
            prose-p:text-neutral-600 prose-p:text-[14px] prose-p:leading-[1.8] prose-p:tracking-[-0.01em]
            prose-strong:text-neutral-900 prose-strong:font-semibold
            prose-headings:text-neutral-900 prose-headings:tracking-tight prose-headings:font-semibold
            prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
            prose-code:text-neutral-700 prose-code:bg-neutral-100/90 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-[13px]
            prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200/80 prose-pre:rounded-xl prose-pre:text-[13px] prose-pre:shadow-sm
            prose-table:text-[13px] prose-table:border-separate prose-table:border-spacing-0 prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-neutral-200/80
            prose-th:bg-neutral-50/80 prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-neutral-800 prose-th:border-b prose-th:border-neutral-200
            prose-td:px-4 prose-td:py-2.5 prose-td:border-b prose-td:border-neutral-100 prose-td:text-neutral-600
            prose-li:text-neutral-600 prose-li:text-[14px] prose-li:leading-[1.8] prose-li:marker:text-neutral-300
            prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-2 prose-a:font-medium
            prose-blockquote:border-l-[3px] prose-blockquote:border-accent-200 prose-blockquote:bg-accent-50/40 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:text-neutral-600 prose-blockquote:not-italic
            prose-hr:border-neutral-100"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
        <CsvDownload content={content} />
      </div>
    </div>
  )
}
