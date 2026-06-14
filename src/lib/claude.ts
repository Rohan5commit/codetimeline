import type { Chapter } from './types'
import { requireEnv } from './env'

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'
// Best free reasoning model on NIM's catalog
const MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct'

async function nimChat(prompt: string): Promise<string> {
  const apiKey = requireEnv('NVIDIA_API_KEY')

  const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`NVIDIA NIM error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function identifyChapters(
  repoName: string,
  chapters: Chapter[]
): Promise<{ title: string; description: string }[]> {
  if (chapters.length === 0) return []

  const chaptersText = chapters
    .map((c, i) => {
      const start = new Date(c.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const end = new Date(c.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const topCommits = c.commits
        .slice(0, 20)
        .map((cm) => `- ${cm.message}`)
        .join('\n')
      const releaseNames = c.releases.map((r) => r.name || r.tag_name).join(', ')
      const newContribs = c.newContributors.map((x) => x.login).join(', ')

      return `Chapter ${i + 1} (${start} → ${end}, ${c.commitCount} commits${releaseNames ? `, releases: ${releaseNames}` : ''}${newContribs ? `, new contributors: ${newContribs}` : ''}):
${topCommits}`
    })
    .join('\n\n---\n\n')

  const prompt = `You're analyzing the development history of the GitHub project "${repoName}".

For each of the ${chapters.length} time periods below, create:
1. A compelling chapter title (4–7 words, narrative and evocative — like "The MVP Sprint", "The Great Refactor", "Community Takes Over")
2. A 1–2 sentence description of what characterized this development phase

Return ONLY a valid JSON array with ${chapters.length} objects, each with "title" (string) and "description" (string). No markdown, no explanation — just the raw JSON array.

${chaptersText}`

  try {
    const raw = await nimChat(prompt)
    const cleaned = raw.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return fallbackTitles(chapters)
  } catch {
    return fallbackTitles(chapters)
  }
}

function fallbackTitles(chapters: Chapter[]): { title: string; description: string }[] {
  return chapters.map((c, i) => ({
    title: `Chapter ${i + 1}: ${new Date(c.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    description: `${c.commitCount} commits were made during this phase of development.`,
  }))
}
