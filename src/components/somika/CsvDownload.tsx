'use client'

import { useMemo } from 'react'
import { extractCsvFromMarkdown, downloadCsv } from '@/lib/csv'

interface CsvDownloadProps {
  content: string
}

export function CsvDownload({ content }: CsvDownloadProps) {
  const csv = useMemo(() => extractCsvFromMarkdown(content), [content])

  if (!csv) return null

  const rowCount = csv.split('\n').length - 1

  return (
    <button
      onClick={() => downloadCsv(csv)}
      className="mt-4 group flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-200 hover:border-brand-300 hover:bg-brand-100 transition-all duration-300 px-4 py-2.5"
    >
      <div className="w-8 h-8 rounded-lg bg-brand-100 group-hover:bg-brand-200 flex items-center justify-center transition-colors">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-600"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div className="text-left">
        <p className="text-[13px] font-medium text-brand-700">Download CSV</p>
        <p className="text-[11px] text-brand-500">
          {rowCount} candidate{rowCount !== 1 ? 's' : ''} ready
        </p>
      </div>
    </button>
  )
}
