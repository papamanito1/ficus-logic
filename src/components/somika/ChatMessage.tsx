'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CsvDownload } from './CsvDownload'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-7">
        <div className="max-w-[72%] rounded-[20px] rounded-br-sm bg-neutral-950 px-5 py-3.5">
          <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-white/90">
            {content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3.5 mb-7">
      <div className="flex-none mt-0.5 w-7 h-7 rounded-full bg-neutral-950 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">S</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose prose-sm max-w-none
          prose-p:text-neutral-600 prose-p:text-[14px] prose-p:leading-[1.8]
          prose-strong:text-neutral-900 prose-strong:font-semibold
          prose-headings:text-neutral-900 prose-headings:tracking-tight prose-headings:font-semibold
          prose-h2:text-lg prose-h2:mt-7 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-code:text-neutral-700 prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal prose-code:text-[13px]
          prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-2xl prose-pre:text-[13px]
          prose-table:text-[13px] prose-table:border-separate prose-table:border-spacing-0 prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-neutral-200
          prose-th:bg-neutral-50 prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-neutral-800 prose-th:border-b prose-th:border-neutral-200
          prose-td:px-4 prose-td:py-2.5 prose-td:border-b prose-td:border-neutral-100 prose-td:text-neutral-600
          prose-li:text-neutral-600 prose-li:text-[14px] prose-li:leading-[1.8] prose-li:marker:text-neutral-300
          prose-a:text-neutral-900 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-neutral-300 hover:prose-a:decoration-neutral-900 prose-a:font-medium
          prose-blockquote:border-l-2 prose-blockquote:border-neutral-200 prose-blockquote:bg-neutral-50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:text-neutral-500 prose-blockquote:not-italic
          prose-hr:border-neutral-100
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <CsvDownload content={content} />
      </div>
    </div>
  )
}
