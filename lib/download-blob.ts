export function downloadBlobResponse(
  blob: Blob,
  headers: Record<string, string>,
  fallbackFilename: string,
) {
  const contentDisposition = headers['content-disposition']
  const blobUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (filenameMatch?.[1]) {
      a.download = filenameMatch[1].replace(/['"]/g, '')
    } else {
      a.download = fallbackFilename
    }
  } else {
    a.download = fallbackFilename
  }
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(blobUrl)
}
