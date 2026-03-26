import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { SOMIKA_SYSTEM_PROMPT } from '@/lib/somika-prompt'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  baseURL: 'https://openrouter.ai/api/v1',
})

const MODEL = process.env.SOMIKA_MODEL ?? 'google/gemini-2.5-flash'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openrouter(MODEL),
    system: SOMIKA_SYSTEM_PROMPT,
    messages,
    temperature: 0.4,
    maxTokens: 4096,
  })

  return result.toDataStreamResponse()
}
