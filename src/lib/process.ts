import type {
  GitHubCommit,
  Contributor,
  Release,
  LanguageData,
  Chapter,
  RepoStats,
  CommitFrequencyPoint,
  RepoData,
} from './types'

function normalizeCommit(raw: any): GitHubCommit {
  return {
    sha: raw.sha,
    message: raw.commit?.message?.split('\n')[0] ?? '',
    date: raw.commit?.author?.date ?? raw.commit?.committer?.date ?? '',
    author: raw.author
      ? { login: raw.author.login, avatar_url: raw.author.avatar_url }
      : null,
  }
}

function groupCommitsIntoChapters(
  commits: GitHubCommit[],
  releases: Release[]
): { startDate: string; endDate: string; commits: GitHubCommit[]; releases: Release[] }[] {
  if (commits.length === 0) return []

  const sorted = [...commits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const earliest = new Date(sorted[0].date)
  const latest = new Date(sorted[sorted.length - 1].date)

  // Use release dates as chapter boundaries if there are enough
  const sortedReleases = [...releases]
    .filter((r) => r.published_at)
    .sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())

  let boundaries: Date[]

  if (sortedReleases.length >= 3) {
    // Use release dates as boundaries
    boundaries = [earliest, ...sortedReleases.map((r) => new Date(r.published_at)), latest]
  } else {
    // Split into 5–8 roughly equal time chunks
    const totalMs = latest.getTime() - earliest.getTime()
    const numChapters = Math.min(8, Math.max(3, Math.floor(commits.length / 30)))
    const chunkMs = totalMs / numChapters
    boundaries = Array.from({ length: numChapters + 1 }, (_, i) =>
      new Date(earliest.getTime() + i * chunkMs)
    )
  }

  // Cap at 8 chapters
  if (boundaries.length > 9) {
    const step = Math.floor((boundaries.length - 2) / 7)
    const filtered = [boundaries[0]]
    for (let i = step; i < boundaries.length - 1; i += step) filtered.push(boundaries[i])
    filtered.push(boundaries[boundaries.length - 1])
    boundaries = filtered.slice(0, 9)
  }

  const chapters: { startDate: string; endDate: string; commits: GitHubCommit[]; releases: Release[] }[] = []

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]
    const end = boundaries[i + 1]

    const chapterCommits = sorted.filter((c) => {
      const d = new Date(c.date)
      return d >= start && d < end
    })

    const chapterReleases = sortedReleases.filter((r) => {
      const d = new Date(r.published_at)
      return d >= start && d <= end
    })

    if (chapterCommits.length === 0 && chapterReleases.length === 0) continue

    chapters.push({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      commits: chapterCommits,
      releases: chapterReleases,
    })
  }

  return chapters
}

function buildCommitFrequency(commits: GitHubCommit[]): CommitFrequencyPoint[] {
  const byWeek: Record<string, number> = {}
  for (const c of commits) {
    if (!c.date) continue
    const d = new Date(c.date)
    // Round to start of week (Monday)
    const day = d.getDay()
    const diff = (day + 6) % 7
    d.setDate(d.getDate() - diff)
    const key = d.toISOString().split('T')[0]
    byWeek[key] = (byWeek[key] ?? 0) + 1
  }
  return Object.entries(byWeek)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function getContributorFirstCommit(login: string, commits: GitHubCommit[]): string | undefined {
  const sorted = commits
    .filter((c) => c.author?.login === login)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return sorted[0]?.date
}

export function processRepoData(
  repoInfo: any,
  rawCommits: any[],
  rawContributors: any[],
  rawReleases: any[],
  languages: Record<string, number>
): RepoData {
  const commits = rawCommits.map(normalizeCommit)
  const releases: Release[] = rawReleases.map((r) => ({
    tag_name: r.tag_name,
    name: r.name || r.tag_name,
    published_at: r.published_at,
  }))

  const contributors: Contributor[] = rawContributors.map((c) => ({
    login: c.login,
    avatar_url: c.avatar_url,
    contributions: c.contributions,
    firstCommitDate: getContributorFirstCommit(c.login, commits),
  }))

  const primaryLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown'

  const stats: RepoStats = {
    owner: repoInfo.owner?.login ?? '',
    repo: repoInfo.name ?? '',
    fullName: repoInfo.full_name ?? '',
    description: repoInfo.description ?? '',
    totalCommits: commits.length,
    totalContributors: contributors.length,
    createdAt: repoInfo.created_at ?? '',
    pushedAt: repoInfo.pushed_at ?? '',
    stargazersCount: repoInfo.stargazers_count ?? 0,
    forksCount: repoInfo.forks_count ?? 0,
    primaryLanguage,
    languages,
    avatarUrl: repoInfo.owner?.avatar_url ?? '',
  }

  const rawChapters = groupCommitsIntoChapters(commits, releases)
  const lastChapterIndex = rawChapters.length - 1

  // Track which contributors are new in each chapter
  const seenContributors = new Set<string>()
  const chapters: Chapter[] = rawChapters.map((c, i) => {
    const chapterLogins = new Set(
      c.commits.flatMap((commit) => (commit.author ? [commit.author.login] : []))
    )
    const newContributors = contributors.filter(
      (contrib) => chapterLogins.has(contrib.login) && !seenContributors.has(contrib.login)
    )
    newContributors.forEach((c) => seenContributors.add(c.login))

    return {
      index: i,
      title: `Chapter ${i + 1}`,
      description: '',
      startDate: c.startDate,
      endDate: c.endDate,
      commits: c.commits,
      newContributors,
      releases: c.releases,
      commitCount: c.commits.length,
      // Only assign languages to the last chapter — the GitHub API returns
      // the repo's current language snapshot, not historical per-chapter data.
      languages: i === lastChapterIndex ? languages : {},
    }
  })

  const commitFrequency = buildCommitFrequency(commits)

  return { stats, chapters, allContributors: contributors, commitFrequency }
}

export function mergeChapterTitles(
  chapters: Chapter[],
  titles: { title: string; description: string }[]
): Chapter[] {
  return chapters.map((c, i) => ({
    ...c,
    title: titles[i]?.title ?? c.title,
    description: titles[i]?.description ?? c.description,
  }))
}
