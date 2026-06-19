import { cn } from '@/lib/utils'

export function RetidoCellText({
  value,
  className,
  nowrap,
}: {
  value: unknown
  className?: string
  nowrap?: boolean
}) {
  const text = value != null && String(value).trim() !== '' ? String(value) : '—'
  return (
    <span
      className={cn(
        'block min-w-0 leading-snug',
        nowrap ? 'truncate whitespace-nowrap' : 'wrap-break-word whitespace-normal',
        className,
      )}
      title={nowrap && text !== '—' ? text : undefined}
    >
      {text}
    </span>
  )
}
