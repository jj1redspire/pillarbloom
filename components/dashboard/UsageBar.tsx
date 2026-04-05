interface UsageBarProps {
  label: string
  used: number
  limit: number
  isUnlimited?: boolean
}

export default function UsageBar({ label, used, limit, isUnlimited }: UsageBarProps) {
  const pct = isUnlimited ? 0 : Math.min(100, (used / Math.max(limit, 1)) * 100)
  const nearLimit = !isUnlimited && pct >= 80
  const atLimit = !isUnlimited && used >= limit

  return (
    <div className="px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#6B7280]">{label}</span>
        <span className={`text-xs font-medium ${atLimit ? 'text-red-500' : nearLimit ? 'text-amber-500' : 'text-[#6B7280]'}`}>
          {isUnlimited ? '∞' : `${used} / ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1 bg-[#e8eaed] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              atLimit ? 'bg-red-400' : nearLimit ? 'bg-amber-400' : 'bg-[#C6A04E]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}
