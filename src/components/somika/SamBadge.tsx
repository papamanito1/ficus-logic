import { cn } from '@/lib/utils'

export function SamBadge({
  size = 'sm',
  className,
}: {
  size?: 'sm' | 'lg'
  className?: string
}) {
  if (size === 'lg') {
    return (
      <div
        className={cn(
          'inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950',
          'shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/10',
          className,
        )}
      >
        <span className="text-[1.65rem] font-light tracking-tight text-white">S</span>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950',
        'shadow-sm ring-1 ring-black/[0.06]',
        className,
      )}
    >
      <span className="text-[10px] font-semibold tracking-tight text-white">S</span>
    </div>
  )
}
