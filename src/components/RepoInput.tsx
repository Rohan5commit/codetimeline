'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  { label: 'facebook/react', owner: 'facebook', repo: 'react' },
  { label: 'vercel/next.js', owner: 'vercel', repo: 'next.js' },
  { label: 'expressjs/express', owner: 'expressjs', repo: 'express' },
  { label: 'vuejs/vue', owner: 'vuejs', repo: 'vue' },
]

function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\/+$/, '')
  // Handle full URLs
  const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }
  // Handle owner/repo format
  const shortMatch = trimmed.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/)
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }
  return null
}

export function RepoInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = parseGitHubUrl(value)
    if (!parsed) {
      setError('Enter a valid GitHub URL or owner/repo')
      return
    }
    setLoading(true)
    router.push(`/timeline/${parsed.owner}/${parsed.repo}`)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <svg className="h-5 w-5 text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            placeholder="github.com/owner/repo or owner/repo"
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing…
              </>
            ) : (
              <>
                Generate Timeline
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 translate-x-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-transform duration-500 group-hover:translate-x-0" />
        </button>
      </form>

      {/* Example repos */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-zinc-600 uppercase tracking-wider">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => router.push(`/timeline/${ex.owner}/${ex.repo}`)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
