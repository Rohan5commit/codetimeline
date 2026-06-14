export interface RepoInfo {
  full_name: string
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  pushed_at: string
  language: string | null
  owner: {
    login: string
    avatar_url: string
  }
}

export interface GitHubCommit {
  sha: string
  message: string
  date: string
  author: {
    login: string
    avatar_url: string
  } | null
}

export interface Contributor {
  login: string
  avatar_url: string
  contributions: number
  firstCommitDate?: string
}

export interface Release {
  tag_name: string
  name: string
  published_at: string
  body: string
}

export interface LanguageData {
  [lang: string]: number
}

export interface Chapter {
  index: number
  title: string
  description: string
  startDate: string
  endDate: string
  commits: GitHubCommit[]
  newContributors: Contributor[]
  releases: Release[]
  commitCount: number
  languages: LanguageData
}

export interface RepoStats {
  owner: string
  repo: string
  fullName: string
  description: string
  totalCommits: number
  totalContributors: number
  createdAt: string
  pushedAt: string
  stargazersCount: number
  forksCount: number
  primaryLanguage: string
  languages: LanguageData
  avatarUrl: string
}

export interface CommitFrequencyPoint {
  date: string
  count: number
}

export interface RepoData {
  stats: RepoStats
  chapters: Chapter[]
  allContributors: Contributor[]
  commitFrequency: CommitFrequencyPoint[]
}
