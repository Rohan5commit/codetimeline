import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { fetchRepoInfo, fetchLanguages } from '@/lib/github'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params

  let info: any = { full_name: `${owner}/${repo}`, description: '', stargazers_count: 0, forks_count: 0 }
  let languages: Record<string, number> = {}

  try {
    ;[info, languages] = await Promise.all([
      fetchRepoInfo(owner, repo),
      fetchLanguages(owner, repo),
    ])
  } catch {
    // use defaults
  }

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
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ⏱
          </div>
          <span style={{ color: '#6366f1', fontSize: '20px', fontWeight: 600, letterSpacing: '0.1em' }}>
            CODETIMELINE
          </span>
        </div>

        {/* Repo name */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            {owner}/{repo}
          </div>
          {info.description && (
            <div
              style={{
                color: '#94a3b8',
                fontSize: '24px',
                lineHeight: 1.5,
                maxWidth: '800px',
                marginBottom: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
              }}
            >
              {info.description.slice(0, 120)}
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '32px', marginTop: 'auto' }}>
            {[
              { label: 'Stars', value: info.stargazers_count?.toLocaleString() ?? '0' },
              { label: 'Forks', value: info.forks_count?.toLocaleString() ?? '0' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span style={{ color: '#6366f1', fontSize: '28px', fontWeight: 700 }}>{stat.value}</span>
                <span style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language pills */}
        {topLangs.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            {topLangs.map((lang) => (
              <div
                key={lang}
                style={{
                  background: `${LANG_COLORS[lang] ?? '#6366f1'}22`,
                  border: `1px solid ${LANG_COLORS[lang] ?? '#6366f1'}66`,
                  borderRadius: '999px',
                  padding: '6px 16px',
                  color: LANG_COLORS[lang] ?? '#6366f1',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: LANG_COLORS[lang] ?? '#6366f1',
                  }}
                />
                {lang}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
