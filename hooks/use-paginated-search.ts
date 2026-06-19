'use client'

import { useCallback, useRef, useState } from 'react'
import type { PaginatedResponse } from '@/types/api/paginated-response'

type PaginatedSearchInitialState<TForm, TItem> = {
  filters: TForm
  results: TItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  sort?: string
}

type UsePaginatedSearchOptions<TForm, TApiFilter, TItem> = {
  mutate: (
    variables: TApiFilter,
    options?: {
      onSuccess?: (data: PaginatedResponse<TItem>) => void
      onSettled?: () => void
    },
  ) => void
  buildParams: (
    filters: TForm,
    pagination: { page: number; size: number; sort?: string },
  ) => TApiFilter
  defaultSize?: number
  initialState?: PaginatedSearchInitialState<TForm, TItem>
}

export function usePaginatedSearch<TForm, TApiFilter, TItem>({
  mutate,
  buildParams,
  defaultSize = 20,
  initialState,
}: UsePaginatedSearchOptions<TForm, TApiFilter, TItem>) {
  const [filters, setFilters] = useState<TForm | null>(initialState?.filters ?? null)
  const [page, setPage] = useState(initialState?.page ?? 0)
  const [size, setSize] = useState(initialState?.size ?? defaultSize)
  const [sort, setSort] = useState<string | undefined>(initialState?.sort)
  const [hasSearched, setHasSearched] = useState(Boolean(initialState))
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<TItem[]>(initialState?.results ?? [])
  const [totalElements, setTotalElements] = useState(initialState?.totalElements ?? 0)
  const [totalPages, setTotalPages] = useState(initialState?.totalPages ?? 0)
  const activeRequestRef = useRef(0)

  const execute = useCallback(
    (
      nextFilters: TForm,
      nextPage: number,
      nextSize: number,
      nextSort?: string,
    ) => {
      const params = buildParams(nextFilters, {
        page: nextPage,
        size: nextSize,
        sort: nextSort,
      })
      const requestId = ++activeRequestRef.current
      setIsSearching(true)
      mutate(params, {
        onSuccess: (data) => {
          if (requestId !== activeRequestRef.current) return
          setResults(data.content ?? [])
          setTotalElements(data.totalElements ?? 0)
          setTotalPages(data.totalPages ?? 0)
          setPage(data.number ?? nextPage)
        },
        onSettled: () => {
          if (requestId !== activeRequestRef.current) return
          setIsSearching(false)
        },
      })
    },
    [buildParams, mutate],
  )

  const applyFilters = useCallback(
    (nextFilters: TForm) => {
      setFilters(nextFilters)
      setHasSearched(true)
      setPage(0)
      execute(nextFilters, 0, size, sort)
    },
    [execute, size, sort],
  )

  const clear = useCallback(() => {
    setFilters(null)
    setHasSearched(false)
    setIsSearching(false)
    setResults([])
    setTotalElements(0)
    setTotalPages(0)
    setPage(0)
    setSort(undefined)
  }, [])

  const goToPage = useCallback(
    (nextPage: number) => {
      if (!filters) return
      setPage(nextPage)
      execute(filters, nextPage, size, sort)
    },
    [execute, filters, size, sort],
  )

  const changeSize = useCallback(
    (nextSize: number) => {
      if (!filters) {
        setSize(nextSize)
        return
      }
      setSize(nextSize)
      setPage(0)
      execute(filters, 0, nextSize, sort)
    },
    [execute, filters, sort],
  )

  const toggleSort = useCallback(
    (field: string) => {
      if (!filters) return
      const nextSort = !sort?.startsWith(field)
        ? `${field},asc`
        : sort.endsWith(',asc')
          ? `${field},desc`
          : undefined
      setSort(nextSort)
      setPage(0)
      execute(filters, 0, size, nextSort)
    },
    [execute, filters, size, sort],
  )

  return {
    filters,
    page,
    size,
    sort,
    hasSearched,
    isSearching,
    results,
    totalElements,
    totalPages,
    applyFilters,
    clear,
    goToPage,
    changeSize,
    toggleSort,
  }
}
