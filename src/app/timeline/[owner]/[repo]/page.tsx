import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  fetchRepoInfo,
  fetchAllCommits,
  fetchContributors,
  fetchReleases,
  fetchLanguages,
} from '@/lib/github'
import { processRepoData, mergeChapterTitles } from '@/lib/process'
import { identifyChapters } from '@/lib/claude'
import { TimelineClient } from '@/components/TimelineClient'

interface Props {
  params: Promise<{ owner: string; repo: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params
  const ogUrl = `/api/og/${owner}/${repo}`
  return {
    title: `${owner}/${repo} — CodeTimeline`,
    description: `Visual development timeline for ${owner}/${repo}`,
    openGraph: {
      title: `${owner}/${repo} on CodeTimeline`,
      description: `Explore the full history of ${owner}/${repo} as an animated visual timeline`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    },
  }
}

async function TimelineData({ owner, repo }: { owner: string; repo: string }) {
  const [repoInfo, rawCommits, rawContributors, rawReleases, languages] = await Promise.all([
    fetchRepoInfo(owner, repo),
    fetchAllCommits(owner, repo),
    fetchContributors(owner, repo),
    fetchReleases(owner, repo),
    fetchLanguages(owner, repo),
  ])

  const data = processRepoData(repoInfo, rawCommits, rawContributors, rawReleases, languages)

  let titledChapters = data.chapters
  if (process.env.ANTHROPIC_API_KEY && data.chapters.length > 0) {
    try {
      const titles = await identifyChapters(`${owner}/${repo}`, data.chapters)
      titledChapters = mergeChapterTitles(data.chapters, titles)
    } catch {
      // fall through with default titles
    }
  }

  return <TimelineClient data={{ ...data, chapters: titledChapters }} />
}

export default async function TimelinePage({ params }: Props) {
  const { owner, repo } = await params

  try {
    await fetchRepoInfo(owner, repo)
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#050508]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500" />
                <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-violet-500 [animation-direction:reverse]" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white">Analyzing repository history</p>
                <p className="mt-1 text-sm text-zinc-500">Fetching commits, contributors, and releases…</p>
              </div>
            </div>
          </div>
        }
      >
        <TimelineData owner={owner} repo={repo} />
      </Suspense>
    </main>
  )
}
