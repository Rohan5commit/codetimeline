'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  owner: string
  repo: string
}

export function ShareButton({ owner, repo }: Props) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : `https://codetimeline.vercel.app/timeline/${owner}/${repo}`
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
      setTimeout(() => { if (mountedRef.current) setStatus('idle') }, 2000)
    } catch {
      setStatus('error')
      setTimeout(() => { if (mountedRef.current) setStatus('idle') }, 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
    >
      {status === 'idle' && (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </>
      )}
      {status === 'copied' && (
        <>
          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">Copied!</span>
        </>
      )}
      {status === 'error' && (
        <span className="text-red-400">Failed</span>
      )}
    </button>
  )
}
