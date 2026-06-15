import type { RepoInfo } from './types'
import { AppError, isAppError } from './errors'

const BASE = 'https://api.github.com'

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'CodeTimeline/1.0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function ghFetch(url: string) {
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  })
  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (remaining === '0') throw new AppError('RATE_LIMIT', 'GitHub rate limit exceeded. Please try again later.')
    throw new AppError('FORBIDDEN', 'GitHub API access forbidden (403).')
  }
  if (res.status === 404) throw new AppError('NOT_FOUND', 'Repository not found or is private.')
  if (!res.ok) throw new AppError('UNKNOWN', `GitHub API error: ${res.status}`)
  return res.json()
}

export async function fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  return ghFetch(`${BASE}/repos/${owner}/${repo}`)
}

export async function fetchAllCommits(owner: string, repo: string): Promise<any[]> {
  const commits: any[] = []
  let page = 1
  while (commits.length < 500) {
    let data: any[]
    try {
      data = await ghFetch(
        `${BASE}/repos/${owner}/${repo}/commits?per_page=100&page=${page}`
      )
    } catch (err) {
      // If we hit rate limit mid-fetch, return what we have so far
      if (isAppError(err, 'RATE_LIMIT') && commits.length > 0) return commits
      throw err
    }
    if (!Array.isArray(data) || data.length === 0) break
    commits.push(...data)
    if (data.length < 100) break
    page++
  }
  return commits
}

export async function fetchContributors(owner: string, repo: string): Promise<any[]> {
  try {
    const data = await ghFetch(
      `${BASE}/repos/${owner}/${repo}/contributors?per_page=100&anon=false`
    )
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function fetchReleases(owner: string, repo: string): Promise<any[]> {
  try {
    const data = await ghFetch(
      `${BASE}/repos/${owner}/${repo}/releases?per_page=100`
    )
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function fetchLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    return await ghFetch(`${BASE}/repos/${owner}/${repo}/languages`)
  } catch {
    return {}
  }
}
