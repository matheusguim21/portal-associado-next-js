import { Badge } from '@/components/ui/badge'
import { defaultBadgeClass } from '@/lib/badge-colors'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  colorKey?: string | null
  getColorClass?: (key: string) => string
  className?: string
}

export function StatusBadge({
  label,
  colorKey,
  getColorClass,
  className,
}: StatusBadgeProps) {
  const colorClass =
    colorKey && getColorClass ? getColorClass(colorKey) : defaultBadgeClass

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', colorClass, className)}
    >
      {label}
    </Badge>
  )
}
