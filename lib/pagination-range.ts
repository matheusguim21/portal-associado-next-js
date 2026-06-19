export function generatePageRange(
  pageIndex: number,
  pageCount: number,
): (number | 'ellipsis')[] {
  if (pageCount <= 1) return [0]
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i)
  }

  const pages: (number | 'ellipsis')[] = [0]
  const start = Math.max(1, pageIndex - 1)
  const end = Math.min(pageCount - 2, pageIndex + 1)

  if (start > 1) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < pageCount - 2) pages.push('ellipsis')
  pages.push(pageCount - 1)

  return pages
}
