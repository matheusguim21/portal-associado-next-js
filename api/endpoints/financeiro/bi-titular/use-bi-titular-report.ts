import { useMemo } from 'react'
import { useApiQuery } from '@/lib/api/use-api-query'
import { mapBiTitularReport } from './map-bi-titular-report'
import type { BiTitularReportApiResponse, BiTitularReportData } from './types'

export function useGetBiTitularReport(titularId?: number, ano?: number) {
  const query = useApiQuery<BiTitularReportApiResponse>(
    ['bi-titular-report', titularId, ano],
    {
      method: 'GET',
      url: '/sipa-financeiro/v1/statistica/bi-titular-report-app',
      params: { titularId, ano },
    },
    { enabled: Boolean(titularId && ano) },
  )

  const data = useMemo<BiTitularReportData | undefined>(
    () => (query.data ? mapBiTitularReport(query.data) : undefined),
    [query.data],
  )

  return { ...query, data }
}
