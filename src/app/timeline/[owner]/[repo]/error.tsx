'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { isAppError } from '@/lib/errors'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TimelineError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isRateLimit = isAppError(error, 'RATE_LIMIT')
  const isNotFound = isAppError(error, 'NOT_FOUND')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6 text-center">
      <div className="mb-6 text-5xl">{isRateLimit ? '⏳' : isNotFound ? '🔍' : '⚠️'}</div>
      <h1 className="text-2xl font-bold text-white">
        {isRateLimit ? 'GitHub rate limit reached' : isNotFound ? 'Repository not found' : 'Something went wrong'}
      </h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500">
        {isRateLimit
          ? 'The GitHub API rate limit has been exceeded. Wait a minute and try again.'
          : isNotFound
          ? 'This repository doesn\'t exist or is private.'
          : 'An unexpected error occurred while loading the timeline. Please try again.'}
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}
