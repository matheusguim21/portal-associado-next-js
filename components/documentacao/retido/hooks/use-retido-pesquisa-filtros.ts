'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  emptyFiltrosPorAba,
  filtroFromForm,
  formFiltroToInitialValues,
  tabFromParams,
  type RetidoSearchFormGetValuesRef,
} from '@/components/documentacao/retido/retido-filtro-utils'
import { useParamUpdater, useReplaceSearchParams } from '@/hooks/use-param-updater'
import type { RetidoPesquisaFiltroUrl } from '@/lib/retido-pesquisa'
import type { RetidoSearchFormValues } from '@/schemas/search-retido-schema'
import type { RetidoTab } from '@/types/api/documentacao/retido'

export function useRetidoPesquisaFiltros() {
  const searchParams = useSearchParams()
  const updateParam = useParamUpdater()
  const replaceSearchParams = useReplaceSearchParams()

  const [formFiltro, setFormFiltro] = useState<RetidoPesquisaFiltroUrl>({})
  const [appliedFiltroByTab, setAppliedFiltroByTab] =
    useState<Record<RetidoTab, RetidoPesquisaFiltroUrl>>(emptyFiltrosPorAba)
  const [searchRequestIdByTab, setSearchRequestIdByTab] = useState<
    Record<RetidoTab, number>
  >({ autoral: 0, conexo: 0, titular: 0 })

  const retidoFormGetValuesRef: RetidoSearchFormGetValuesRef = useRef(null)

  const tab = tabFromParams(searchParams.get('tab'))
  const appliedFiltro = appliedFiltroByTab[tab]
  const searchRequestId = searchRequestIdByTab[tab]

  const initialFormValues = useMemo(
    () => formFiltroToInitialValues(formFiltro),
    [formFiltro],
  )

  const handleSubmit = useCallback(
    (form: RetidoSearchFormValues) => {
      const filtro = filtroFromForm(form)
      setFormFiltro(filtro)
      setAppliedFiltroByTab((prev) => ({ ...prev, [tab]: filtro }))
      setSearchRequestIdByTab((prev) => ({ ...prev, [tab]: prev[tab] + 1 }))
      updateParam('page', '0', false)
    },
    [tab, updateParam],
  )

  const handleClear = useCallback(() => {
    setFormFiltro({})
    setAppliedFiltroByTab((prev) => ({ ...prev, [tab]: {} }))
    setSearchRequestIdByTab((prev) => ({ ...prev, [tab]: 0 }))
    const next = new URLSearchParams()
    next.set('tab', tab)
    next.set('page', '0')
    next.set('size', '10')
    next.delete('sort')
    replaceSearchParams(next)
  }, [tab, replaceSearchParams])

  const persistFormFromRef = useCallback(() => {
    const snap = retidoFormGetValuesRef.current?.()
    if (snap) setFormFiltro(filtroFromForm(snap))
  }, [])

  const handleTabChange = useCallback(
    (value: string) => {
      const next = tabFromParams(value)
      persistFormFromRef()
      const nextParams = new URLSearchParams()
      nextParams.set('tab', next)
      nextParams.set('page', '0')
      nextParams.set('size', searchParams.get('size') ?? '10')
      nextParams.delete('sort')
      replaceSearchParams(nextParams)
    },
    [persistFormFromRef, searchParams, replaceSearchParams],
  )

  const setSearchParams = useCallback(
    (params: URLSearchParams) => {
      replaceSearchParams(params)
    },
    [replaceSearchParams],
  )

  return {
    tab,
    appliedFiltro,
    searchRequestId,
    initialFormValues,
    retidoFormGetValuesRef,
    handleSubmit,
    handleClear,
    handleTabChange,
    setSearchParams,
    searchParams,
  }
}
