'use client'

import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { BiTitularOrigemMensalItem } from '@/api/endpoints/financeiro/bi-titular/types'
import { DataTable } from '@/components/ui/data-table'
import { MoedaTicker } from '@/components/ui/moeda-ticker'
import { cn } from '@/lib/utils'

interface OrigensMonthlyTableProps {
  rows: BiTitularOrigemMensalItem[]
}

function MoedaCell({ value, className }: { value: number; className?: string }) {
  return <MoedaTicker value={value} className={cn('tabular-nums', className)} />
}

export function OrigensMonthlyTable({ rows }: OrigensMonthlyTableProps) {
  const columns = useMemo<ColumnDef<BiTitularOrigemMensalItem>[]>(
    () => [
      {
        accessorKey: 'periodo',
        header: 'Período',
        meta: { mobilePrimary: true },
      },
      {
        accessorKey: 'valorDistribuicao',
        header: 'Distribuição',
        cell: ({ row }) => <MoedaCell value={row.original.valorDistribuicao} />,
        meta: { className: 'text-right' },
      },
      {
        accessorKey: 'valorRetido',
        header: 'Retido',
        cell: ({ row }) => <MoedaCell value={row.original.valorRetido} />,
        meta: { className: 'text-right' },
      },
      {
        accessorKey: 'valorAjuste',
        header: 'Ajustes',
        cell: ({ row }) => <MoedaCell value={row.original.valorAjuste} />,
        meta: { className: 'text-right' },
      },
      {
        accessorKey: 'valorTotal',
        header: 'Total',
        cell: ({ row }) => <MoedaCell value={row.original.valorTotal} className="font-medium" />,
        meta: { className: 'text-right' },
      },
    ],
    [],
  )

  const totals = rows.reduce(
    (acc, row) => ({
      valorDistribuicao: acc.valorDistribuicao + row.valorDistribuicao,
      valorRetido: acc.valorRetido + row.valorRetido,
      valorAjuste: acc.valorAjuste + row.valorAjuste,
      valorTotal: acc.valorTotal + row.valorTotal,
    }),
    { valorDistribuicao: 0, valorRetido: 0, valorAjuste: 0, valorTotal: 0 },
  )

  return (
    <div className="max-h-[350px] overflow-y-auto rounded-md border">
      <DataTable
        columns={columns}
        data={rows}
        containerClassName="border-0 shadow-none rounded-none"
      />

      {rows.length > 1 && (
        <div className="hidden border-t bg-muted/40 px-4 py-3 md:grid md:grid-cols-5 md:gap-4 md:text-sm md:font-semibold">
          <span>Total</span>
          <MoedaCell value={totals.valorDistribuicao} className="text-right font-semibold" />
          <MoedaCell value={totals.valorRetido} className="text-right font-semibold" />
          <MoedaCell value={totals.valorAjuste} className="text-right font-semibold" />
          <MoedaCell value={totals.valorTotal} className="text-right font-semibold" />
        </div>
      )}

      {rows.length > 1 && (
        <div className="border-t bg-muted/40 px-4 py-3 md:hidden">
          <p className="mb-2 text-sm font-semibold">Total</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Distribuição</dt>
              <dd>
                <MoedaCell value={totals.valorDistribuicao} className="font-medium" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Retido</dt>
              <dd>
                <MoedaCell value={totals.valorRetido} className="font-medium" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ajustes</dt>
              <dd>
                <MoedaCell value={totals.valorAjuste} className="font-medium" />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total</dt>
              <dd>
                <MoedaCell value={totals.valorTotal} className="font-semibold" />
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
