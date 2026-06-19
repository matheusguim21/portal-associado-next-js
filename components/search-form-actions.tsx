import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type SearchFormActionsProps = {
  onSearch: () => void
  onClear: () => void
  searching?: boolean
  className?: string
}

export function SearchFormActions({
  onSearch,
  onClear,
  searching,
  className,
}: SearchFormActionsProps) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end', className)}>
      <Button type="button" className="w-full sm:w-auto" onClick={onSearch} disabled={searching}>
        {searching ? 'Pesquisando...' : 'Pesquisar'}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={onClear}
        disabled={searching}
      >
        Limpar
      </Button>
    </div>
  )
}
