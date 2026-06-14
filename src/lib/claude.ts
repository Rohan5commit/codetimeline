import Anthropic from '@anthropic-ai/sdk'
import type { Chapter } from './types'

const client = new Anthropic()

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

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You're analyzing the development history of the GitHub project "${repoName}".

For each of the ${chapters.length} time periods below, create:
1. A compelling chapter title (4–7 words, narrative and evocative — like "The MVP Sprint", "The Great Refactor", "Community Takes Over")
2. A 1–2 sentence description of what characterized this development phase

Return ONLY a valid JSON array with ${chapters.length} objects, each with "title" (string) and "description" (string). No markdown, no explanation — just the raw JSON array.

${chaptersText}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') return fallbackTitles(chapters)

  try {
    const raw = content.text.trim()
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
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
