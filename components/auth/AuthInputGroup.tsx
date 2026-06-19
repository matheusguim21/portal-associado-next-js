import { cn } from '@/lib/utils'

interface AuthInputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
}

export function AuthInputGroup({ icon, className, ...props }: AuthInputGroupProps) {
  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-lg shadow-sm">
      <span className="flex min-w-[2.75rem] items-center justify-center border border-border border-r-0 bg-white/96 px-2.5 text-muted-foreground">
        {icon}
      </span>
      <input
        className={cn(
          'min-w-0 flex-1 rounded-r-lg border border-border border-l-0 bg-white/96 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:bg-white/72 disabled:text-muted-foreground',
          className,
        )}
        {...props}
      />
    </div>
  )
}
