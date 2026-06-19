'use client'

import { generatePageRange } from '@/lib/pagination-range'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { SelectField } from '@/components/ui/select-field'

type SearchResultsToolbarProps = {
  page: number
  size: number
  totalElements: number
  totalPages: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 por página' },
  { value: '20', label: '20 por página' },
  { value: '50', label: '50 por página' },
]

export function SearchResultsToolbar({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
}: SearchResultsToolbarProps) {
  if (totalElements === 0) return null

  const from = page * size + 1
  const to = Math.min((page + 1) * size, totalElements)
  const items = generatePageRange(page, totalPages)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Exibindo {from}–{to} de {totalElements} resultados
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SelectField
          value={String(size)}
          onValueChange={(v) => onSizeChange(Number(v ?? size))}
          options={PAGE_SIZE_OPTIONS}
          allowEmpty={false}
          className="min-w-[140px]"
        />

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Anterior"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(Math.max(0, page - 1))
                  }}
                  aria-disabled={page === 0}
                  className={page === 0 ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>

              {items.map((item, idx) =>
                item === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      onClick={(e) => {
                        e.preventDefault()
                        onPageChange(item)
                      }}
                    >
                      {item + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Próxima"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(Math.min(page + 1, totalPages - 1))
                  }}
                  aria-disabled={page + 1 >= totalPages}
                  className={
                    page + 1 >= totalPages ? 'pointer-events-none opacity-50' : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
