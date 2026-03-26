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
      className="mt-4 group flex w-full sm:w-auto items-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-4 py-2.5
                 shadow-sm transition-all duration-300 hover:border-accent-200/80 hover:bg-accent-50/30 hover:shadow-md"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100/90 transition-colors group-hover:bg-accent-100/60">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-600 group-hover:text-accent-600"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div className="text-left">
        <p className="text-[13px] font-medium tracking-tight text-neutral-800">Download CSV</p>
        <p className="text-[11px] text-neutral-500">
          {rowCount} row{rowCount !== 1 ? 's' : ''} · spreadsheet-ready
        </p>
      </div>
    </button>
  )
}
