import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

type SearchFormSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
  showSeparator?: boolean
}

export function SearchFormSection({
  title,
  children,
  className,
  showSeparator = true,
}: SearchFormSectionProps) {
  return (
    <div className={cn('w-full space-y-3', className)}>
      {showSeparator && <Separator />}
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}
