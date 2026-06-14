import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { fetchRepoInfo, fetchLanguages } from '@/lib/github'
import type { RepoInfo } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params

  if (!process.env.GITHUB_TOKEN) {
    console.warn('[og] GITHUB_TOKEN is not set — using unauthenticated GitHub API (60 req/hr limit)')
  }

  let info: RepoInfo | null = null
  let languages: Record<string, number> = {}

  try {
    info = await fetchRepoInfo(owner, repo)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('rate limit')) {
      return Response.json(
        { error: 'GitHub rate limit exceeded. Set GITHUB_TOKEN to increase the limit to 5,000 req/hr.' },
        { status: 429 }
      )
    }
    // Private / not-found repo: fall through and render placeholder card
  }

  try {
    languages = await fetchLanguages(owner, repo)
  } catch {
    // Non-critical — render without language pills
  }

  const stars = info?.stargazers_count ?? 0
  const forks = info?.forks_count ?? 0
  const description = (info?.description ?? '').slice(0, 110)

  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name)

  const LANG_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Shell: '#89e051',
    Dart: '#00B4AB',
    PHP: '#4F5D95',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #050508 0%, #0d0d1a 50%, #0a0a14 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow orbs — absolute positioned */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '200px',
            background: 'rgba(99,102,241,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '200px',
            background: 'rgba(139,92,246,0.12)',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '14px',
            }}
          >
            <div style={{ color: 'white', fontSize: '22px', display: 'flex' }}>CT</div>
          </div>
          <span style={{ color: '#6366f1', fontSize: '20px', fontWeight: 600, letterSpacing: '0.1em' }}>
            CODETIMELINE
          </span>
        </div>

        {/* Repo name */}
        <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 800, lineHeight: '1.1', marginBottom: '16px', display: 'flex' }}>
          {owner}/{repo}
        </div>

        {/* Description */}
        {description ? (
          <div
            style={{
              color: '#94a3b8',
              fontSize: '24px',
              lineHeight: '1.5',
              maxWidth: '800px',
              marginBottom: '32px',
              display: 'flex',
            }}
          >
            {description}
          </div>
        ) : (
          <div style={{ marginBottom: '32px', display: 'flex' }} />
        )}

        {/* Spacer */}
        <div style={{ display: 'flex', flexGrow: 1 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', marginBottom: topLangs.length > 0 ? '28px' : '0' }}>
          {[
            { label: 'Stars', value: stars.toLocaleString() },
            { label: 'Forks', value: forks.toLocaleString() },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                marginRight: i === 0 ? '16px' : '0',
              }}
            >
              <span style={{ color: '#6366f1', fontSize: '28px', fontWeight: 700 }}>{stat.value}</span>
              <span style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Language pills */}
        {topLangs.length > 0 && (
          <div style={{ display: 'flex' }}>
            {topLangs.map((lang, i) => {
              const color = LANG_COLORS[lang] ?? '#6366f1'
              return (
                <div
                  key={lang}
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: `1px solid rgba(99,102,241,0.35)`,
                    borderRadius: '999px',
                    padding: '6px 16px',
                    color,
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: i < topLangs.length - 1 ? '10px' : '0',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: color,
                      marginRight: '8px',
                    }}
                  />
                  {lang}
                </div>
              )
            })}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
