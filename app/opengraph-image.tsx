import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PillarBloom — Turn Your Expertise Into Content AND Income'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1B2A4A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Dot grid background effect */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Gold glow top-right */}
        <div style={{
          position: 'absolute',
          top: -80, right: -80,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(198, 160, 78, 0.12)',
          filter: 'blur(80px)',
        }} />

        {/* Brand name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '36px',
        }}>
          <div style={{
            color: '#C6A04E',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            ✦ PILLARBLOOM
          </div>
        </div>

        {/* Headline */}
        <div style={{
          color: 'white',
          fontSize: 68,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 960,
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <span>Turn Your Expertise Into</span>
          <span style={{ color: '#C6A04E', fontStyle: 'italic' }}>Content AND Income</span>
        </div>

        {/* Subtitle */}
        <div style={{
          color: 'rgba(255,255,255,0.60)',
          fontSize: 26,
          textAlign: 'center',
          maxWidth: 760,
          lineHeight: 1.4,
          marginBottom: '48px',
        }}>
          One paste. 30 days of posts. Sellable digital products. All in your voice.
        </div>

        {/* Two engine pills */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: '✨ Content Engine', sub: '8 output formats' },
            { label: '🎁 Product Engine', sub: '6 product types' },
          ].map((pill) => (
            <div
              key={pill.label}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '12px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>{pill.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{pill.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: '#C6A04E',
          color: 'white',
          fontSize: 20,
          fontWeight: 700,
          padding: '16px 40px',
          borderRadius: '40px',
          letterSpacing: '0.02em',
        }}>
          Free to start · pillarbloom.com
        </div>
      </div>
    ),
    { ...size }
  )
}
