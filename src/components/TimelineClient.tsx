'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LanguageDonut } from './LanguageDonut'
import { CommitSparkline } from './CommitSparkline'
import { ShareButton } from './ShareButton'
import type { RepoData, Chapter, Contributor } from '@/lib/types'

interface Props {
  data: RepoData
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function getAgeStat(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)
  if (days < 365) return `${days}d`
  const years = (days / 365).toFixed(1)
  return `${years}y`
}

function StatCard({ label, value, accent = '#6366f1' }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="text-2xl font-bold" style={{ color: accent }}>{value}</span>
      <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
    </div>
  )
}

function ContributorAvatars({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) return null
  const shown = contributors.slice(0, 8)
  const rest = contributors.length - shown.length
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500">New:</span>
      <div className="flex -space-x-2">
        {shown.map((c) => (
          <a
            key={c.login}
            href={`https://github.com/${c.login}`}
            target="_blank"
            rel="noopener noreferrer"
            title={c.login}
            className="contributor-avatar relative z-10 block h-7 w-7 overflow-hidden rounded-full border-2 border-[#0d0d1a] ring-1 ring-white/10 transition-transform duration-200 hover:z-20 hover:scale-125"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.avatar_url}
              alt={c.login}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(c.login)}&background=6366f1&color=fff&size=56`
              }}
            />
          </a>
        ))}
      </div>
      {rest > 0 && (
        <span className="text-xs text-zinc-500">+{rest} more</span>
      )}
    </div>
  )
}

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const CHAPTER_COLORS = [
    { accent: '#6366f1', glow: 'rgba(99,102,241,0.15)' },
    { accent: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
    { accent: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
    { accent: '#10b981', glow: 'rgba(16,185,129,0.15)' },
    { accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
    { accent: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
    { accent: '#ec4899', glow: 'rgba(236,72,153,0.15)' },
    { accent: '#14b8a6', glow: 'rgba(20,184,166,0.15)' },
  ]
  const { accent, glow } = CHAPTER_COLORS[index % CHAPTER_COLORS.length]

  return (
    <div
      className="chapter-card relative ml-8 md:ml-16 rounded-2xl border border-white/[0.08] bg-[#0d0d1a] p-6 md:p-8 opacity-0 translate-y-8"
      style={{ boxShadow: `0 0 40px ${glow}` }}
    >
      {/* Timeline node */}
      <div
        className="absolute -left-[2.75rem] md:-left-[3.75rem] top-8 h-4 w-4 rounded-full border-2 border-current ring-4"
        style={{ color: accent, borderColor: accent, boxShadow: `0 0 12px ${accent}`, background: '#050508' }}
      />

      {/* Chapter label */}
      <div className="mb-3 flex items-center gap-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
          style={{ color: accent, background: `${accent}22`, border: `1px solid ${accent}44` }}
        >
          Chapter {index + 1}
        </span>
        <span className="text-xs text-zinc-600">
          {formatDate(chapter.startDate)} – {formatDate(chapter.endDate)}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">{chapter.title}</h2>

      {/* Description */}
      {chapter.description && (
        <p className="mb-6 text-sm leading-relaxed text-zinc-400 md:text-base">{chapter.description}</p>
      )}

      {/* Stats row */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span className="text-xs font-medium text-zinc-300">{chapter.commitCount} commits</span>
        </div>
        {chapter.releases.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs font-medium text-zinc-300">
              {chapter.releases.map((r) => r.name || r.tag_name).slice(0, 3).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Contributors */}
      {chapter.newContributors.length > 0 && (
        <div className="mb-6">
          <ContributorAvatars contributors={chapter.newContributors} />
        </div>
      )}

      {/* Language donut */}
      {Object.keys(chapter.languages).length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-600">Languages</p>
          <LanguageDonut languages={chapter.languages} size={120} />
        </div>
      )}

      {/* Top commits */}
      {chapter.commits.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-600">Key commits</p>
          <div className="flex flex-col gap-1.5">
            {chapter.commits.slice(0, 5).map((c) => (
              <div key={c.sha} className="flex items-start gap-2">
                {c.author && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.author.avatar_url}
                    alt={c.author.login}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author!.login)}&background=3f3f46&color=fff&size=32`
                    }}
                  />
                )}
                <span className="truncate text-xs text-zinc-500 leading-5">{c.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TimelineClient({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { stats, chapters, commitFrequency } = data

  useEffect(() => {
    let ctx: any

    async function init() {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!containerRef.current) return

      ctx = gsap.context(() => {
        // Animate timeline line drawing
        gsap.fromTo(
          '.timeline-line',
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.timeline-line',
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1,
            },
          }
        )

        // Animate each chapter card
        gsap.utils.toArray<HTMLElement>('.chapter-card').forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })

        // Animate contributor avatars staggered
        gsap.utils.toArray<HTMLElement>('.contributor-avatar').forEach((av, i) => {
          gsap.fromTo(
            av,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              delay: i * 0.05,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: av,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })

        // Animate stat cards
        gsap.utils.toArray<HTMLElement>('.stat-card-animate').forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
              },
            }
          )
        })
      }, containerRef)
    }

    init()
    return () => ctx?.revert()
  }, [])

  const ageStr = getAgeStat(stats.createdAt)

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508]">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#050508] px-6 pb-12 pt-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -top-32 right-1/4 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Nav */}
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
            <div className="flex items-center gap-3">
              <ShareButton owner={stats.owner} repo={stats.repo} />
              <a
                href={`https://github.com/${stats.fullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Repo identity */}
          <div className="flex items-start gap-4">
            {stats.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stats.avatarUrl}
                alt={stats.owner}
                className="h-14 w-14 rounded-2xl border border-white/10"
              />
            )}
            <div>
              <p className="text-sm text-zinc-500">{stats.owner}</p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{stats.repo}</h1>
              {stats.description && (
                <p className="mt-1 text-base text-zinc-400">{stats.description}</p>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Commits', value: stats.totalCommits.toLocaleString(), accent: '#6366f1' },
              { label: 'Contributors', value: stats.totalContributors.toLocaleString(), accent: '#8b5cf6' },
              { label: 'Age', value: ageStr, accent: '#06b6d4' },
              { label: 'Stars', value: stats.stargazersCount.toLocaleString(), accent: '#f59e0b' },
            ].map((s) => (
              <div key={s.label} className="stat-card-animate">
                <StatCard label={s.label} value={s.value} accent={s.accent} />
              </div>
            ))}
          </div>

          {/* Commit sparkline */}
          {commitFrequency.length > 2 && (
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-600">Commit activity</p>
              <CommitSparkline data={commitFrequency} width={700} height={56} />
            </div>
          )}
        </div>
      </div>

      {/* Chapters timeline */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white">Development Timeline</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {chapters.length} chapters · AI-identified milestones
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="timeline-line absolute left-3 top-0 h-full w-0.5 origin-top bg-gradient-to-b from-indigo-500/80 via-violet-500/50 to-transparent md:left-5" />

          <div className="flex flex-col gap-12">
            {chapters.map((chapter, i) => (
              <ChapterCard key={chapter.index} chapter={chapter} index={i} />
            ))}
          </div>
        </div>

        {/* End cap */}
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <div className="h-8 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/10">
            <div className="h-2 w-2 rounded-full bg-indigo-400" />
          </div>
          <p className="mt-2 text-sm text-zinc-600">
            {stats.totalCommits.toLocaleString()} commits across {chapters.length} chapters
          </p>
          <p className="text-xs text-zinc-700">
            Last push: {formatDate(stats.pushedAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
