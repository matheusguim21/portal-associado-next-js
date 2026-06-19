import { cn } from '@/lib/utils'

/** Use on inputs/selects inside filter panels for visible borders on gray backgrounds. */
export const FILTER_FIELD_CLASS =
  'border-zinc-200/80 bg-card shadow-sm hover:border-zinc-500/90 focus-visible:border-ring dark:border-white/25 dark:hover:border-white/35'

const filterPanelFieldStyles = [
  '[&_[data-slot=input]]:border-zinc-400/80',
  '[&_[data-slot=input]]:bg-card',
  '[&_[data-slot=input]]:shadow-sm',
  '[&_[data-slot=input]:hover]:border-zinc-500/90',
  '[&_[data-slot=input]:focus-visible]:border-ring',
  '[&_[data-slot=select-trigger]]:border-zinc-400/80',
  '[&_[data-slot=select-trigger]]:bg-card',
  '[&_[data-slot=select-trigger]]:shadow-sm',
  '[&_[data-slot=select-trigger]:hover]:border-zinc-500/90',
  '[&_[data-slot=select-trigger]:focus-visible]:border-ring',
  'dark:[&_[data-slot=input]]:border-white/25',
  'dark:[&_[data-slot=input]:hover]:border-white/35',
  'dark:[&_[data-slot=select-trigger]]:border-white/25',
  'dark:[&_[data-slot=select-trigger]:hover]:border-white/35',
]

type TableFiltersCardProps = React.ComponentProps<'div'> & {
  layout?: 'inline' | 'stacked'
}

export function TableFiltersCard({
  className,
  children,
  layout = 'inline',
  ...props
}: TableFiltersCardProps) {
  return (
    <div
      className={cn(
        'flex bg-blue-50 dark:bg-zinc-900/70 border border-primary/30 rounded-md p-4',
        layout === 'stacked'
          ? 'flex-col gap-3 md:gap-4'
          : 'flex-col flex-wrap sm:flex-row sm:items-end gap-2 md:gap-4',
        filterPanelFieldStyles,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TableFiltersLabel({
  className,
  children,
  ...props
}: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('text-sm font-medium text-foreground/85', className)}
      {...props}
    >
      {children}
    </label>
  )
}
