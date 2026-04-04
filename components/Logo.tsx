type LogoVariant = 'dark' | 'light'

interface LogoProps {
  variant?: LogoVariant
  className?: string
  width?: number
}

export default function Logo({ variant = 'dark', className = '', width = 200 }: LogoProps) {
  const navy = variant === 'light' ? '#ffffff' : '#1B2A4A'
  const gold = '#C6A04E'
  const goldAccent = variant === 'light' ? 'rgba(198,160,78,0.5)' : 'rgba(198,160,78,0.4)'

  return (
    <svg
      viewBox="0 0 520 70"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width * (70 / 520)}
      className={className}
      aria-label="PillarBloom"
    >
      {/* P letterform */}
      <path
        d="M16,62 L16,10 L16,4 L52,4 Q72,4 72,24 Q72,44 54,44 L36,44"
        fill="none"
        stroke={navy}
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Gold diamond bloom mark */}
      <rect x="48" y="20" width="8" height="8" fill={gold} transform="rotate(45, 52, 24)" />
      {/* Accent lines */}
      <line x1="42" y1="14" x2="62" y2="14" stroke={gold} strokeWidth="1" opacity="0.4" />
      <line x1="44" y1="34" x2="60" y2="34" stroke={gold} strokeWidth="1" opacity="0.4" />
      {/* Wordmark */}
      <text
        x="100"
        y="42"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="500"
        fill={navy}
        letterSpacing="6"
      >
        PILLARBLOOM
      </text>
    </svg>
  )
}

// Mark-only version for favicon and compact uses
export function LogoMark({ variant = 'dark', size = 40 }: { variant?: LogoVariant; size?: number }) {
  const navy = variant === 'light' ? '#ffffff' : '#1B2A4A'
  const gold = '#C6A04E'

  return (
    <svg
      viewBox="0 0 80 70"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (70 / 80)}
      aria-label="PillarBloom mark"
    >
      <path
        d="M16,62 L16,10 L16,4 L52,4 Q72,4 72,24 Q72,44 54,44 L36,44"
        fill="none"
        stroke={navy}
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <rect x="48" y="20" width="8" height="8" fill={gold} transform="rotate(45, 52, 24)" />
      <line x1="42" y1="14" x2="62" y2="14" stroke={gold} strokeWidth="1" opacity="0.4" />
      <line x1="44" y1="34" x2="60" y2="34" stroke={gold} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
