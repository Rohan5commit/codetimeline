import { ImageResponse } from 'next/og'

export async function GET() {
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
        {/* Glow orbs */}
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

        {/* Logo */}
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

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: '1.1',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          Code<span style={{ color: '#818cf8' }}>Timeline</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: '28px',
            lineHeight: '1.5',
            maxWidth: '800px',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          Turn any GitHub repo into a beautiful visual history
        </div>

        {/* Spacer */}
        <div style={{ display: 'flex', flexGrow: 1 }} />

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['AI Chapter Names', 'Scroll Animations', 'Language Evolution', 'Contributor Journey'].map((f) => (
            <div
              key={f}
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.35)',
                borderRadius: '999px',
                padding: '8px 20px',
                color: '#a5b4fc',
                fontSize: '16px',
                fontWeight: 600,
                display: 'flex',
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
