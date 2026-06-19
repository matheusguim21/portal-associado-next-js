import { cn } from '@/lib/utils'

type FinanceFiltersBarProps = {
  className?: string
  children: React.ReactNode
}

export function FinanceFiltersBar({ className, children }: FinanceFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-md p-4 text-white',
        className,
      )}
      style={{ backgroundColor: 'var(--finance-filter-bg)' }}
    >
      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-end">{children}</div>
    </div>
  )
}

export function FinanceFiltersLabel({
  className,
  children,
  ...props
}: React.ComponentProps<'label'>) {
  return (
    <label className={cn('text-sm font-medium text-white/90', className)} {...props}>
      {children}
    </label>
  )
}
