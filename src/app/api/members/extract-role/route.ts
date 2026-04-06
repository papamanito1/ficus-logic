import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  baseURL: 'https://openrouter.ai/api/v1',
})

const MODEL = process.env.SOMIKA_MODEL ?? 'google/gemini-2.5-flash'

const SYSTEM_PROMPT = `You extract structured job/career role information from raw pasted text.
The text may come from a career page, LinkedIn post, email, or any source.

Return ONLY a valid JSON object with these fields (use null for anything you cannot determine):

{
  "title": "Job title",
  "location": "City, Country or Remote",
  "department": "Department or team name",
  "employmentType": "Full-time | Part-time | Contract | Internship",
  "experience": "Experience requirement like '5+ Years'",
  "summary": "A clean 2-4 paragraph description of the role. Rewrite the raw text into professional, well-structured prose. Remove hashtags, emojis, and social media formatting. Keep it informative and polished.",
  "industry": "Industry or domain",
  "applyEmail": "Email to apply (if mentioned)",
  "note": "Any important note or mandatory requirement (if mentioned)",
  "hiringFor": "If hiring on behalf of a client, describe who — e.g. 'Ficus e Logic Pvt. Ltd. is hiring on behalf of a leading IT Consulting organization'. Otherwise null.",
  "tags": ["relevant", "keyword", "tags"],
  "externalUrl": "Any apply link or career page URL mentioned"
}

Rules:
- Department should default to "Ficus Logic" if not specified or if Ficus is the hiring company.
- For tags, extract 4-8 relevant keywords from the content (role, industry, location, skills).
- The summary should be professional and suitable for a corporate careers page — NOT a social media post.
- If the text mentions Ficus e-Logic or Ficus Logic as the hiring firm, set hiringFor appropriately.
- Return ONLY the JSON object, no markdown, no explanation.`

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || (token as { authKind?: string }).authKind !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { rawText?: string }
  const rawText = String(body.rawText ?? '').trim()
  if (!rawText) {
    return NextResponse.json({ error: 'Paste the role content first.' }, { status: 400 })
  }
  if (rawText.length > 15000) {
    return NextResponse.json({ error: 'Text is too long. Paste only the relevant role content.' }, { status: 400 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'AI is not configured (OPENROUTER_API_KEY missing).' }, { status: 500 })
  }

  try {
    const { text } = await generateText({
      model: openrouter(MODEL),
      system: SYSTEM_PROMPT,
      prompt: rawText,
      temperature: 0.2,
      maxTokens: 2048,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI could not extract role data. Try pasting clearer content.' }, { status: 422 })
    }

    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>

    const role = {
      title: typeof parsed.title === 'string' ? parsed.title : null,
      location: typeof parsed.location === 'string' ? parsed.location : null,
      department: typeof parsed.department === 'string' ? parsed.department : 'Ficus Logic',
      employmentType: typeof parsed.employmentType === 'string' ? parsed.employmentType : 'Full-time',
      experience: typeof parsed.experience === 'string' ? parsed.experience : null,
      summary: typeof parsed.summary === 'string' ? parsed.summary : null,
      industry: typeof parsed.industry === 'string' ? parsed.industry : null,
      applyEmail: typeof parsed.applyEmail === 'string' ? parsed.applyEmail : null,
      note: typeof parsed.note === 'string' ? parsed.note : null,
      hiringFor: typeof parsed.hiringFor === 'string' ? parsed.hiringFor : null,
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t): t is string => typeof t === 'string') : [],
      externalUrl: typeof parsed.externalUrl === 'string' ? parsed.externalUrl : null,
    }

    return NextResponse.json({ ok: true, role })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'AI extraction failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
