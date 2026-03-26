export function extractCsvFromMarkdown(markdown: string): string | null {
  const markerMatch = markdown.match(
    /<!-- CANDIDATES_CSV_START -->([\s\S]*?)<!-- CANDIDATES_CSV_END -->/
  )

  const tableSource = markerMatch ? markerMatch[1] : markdown

  const lines = tableSource.split('\n').filter((l) => l.trim().startsWith('|'))
  if (lines.length < 3) return null

  const headerLine = lines[0]
  const headers = parseTableRow(headerLine)

  const candidateHeaders = ['name', 'title', 'company', 'location', 'skill', 'match', 'source']
  const lowerHeaders = headers.map((h) => h.toLowerCase())
  const looksLikeCandidates = candidateHeaders.some((kw) =>
    lowerHeaders.some((h) => h.includes(kw))
  )
  if (!looksLikeCandidates) return null

  const dataLines = lines.slice(2)
  const rows = dataLines.map(parseTableRow)

  const csvLines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.map(escapeCsvField).join(',')),
  ]

  return csvLines.join('\n')
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell) => cell !== '' && !cell.match(/^[-:]+$/))
}

function escapeCsvField(field: string): string {
  const cleaned = field.replace(/\*\*/g, '').trim()
  if (cleaned.includes(',') || cleaned.includes('"') || cleaned.includes('\n')) {
    return `"${cleaned.replace(/"/g, '""')}"`
  }
  return cleaned
}

export function downloadCsv(csv: string, filename = 'somika-candidates.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
