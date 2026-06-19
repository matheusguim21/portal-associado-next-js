export const ELEMENTOS_STALE_TIME = 5 * 60 * 1000

export const DIVERSOS_PATHS = {
  generos: '/sipa-documentacao/v1/diversos/generos',
  idiomas: '/sipa-documentacao/v1/diversos/idiomas',
  tiposObraComposta: '/sipa-documentacao/v1/diversos/tipos-obra-composta',
  tiposTitulo: '/sipa-documentacao/v1/diversos/tipos-titulo',
  categoriasReferencia: '/sipa-documentacao/v1/diversos/categorias-referencia',
  elementosObra: '/sipa-documentacao/v1/diversos/elementos-obra',
  elementosFonograma: '/sipa-documentacao/v1/diversos/elementos-fonograma',
  subcategoriasAutoral: '/sipa-documentacao/v1/diversos/subcategorias/A',
} as const

export const diversosKeys = {
  generos: ['diversos', 'generos'] as const,
  idiomas: ['diversos', 'idiomas'] as const,
  tiposObraComposta: ['diversos', 'tipos-obra-composta'] as const,
  tiposTitulo: ['diversos', 'tipos-titulo'] as const,
  categoriasReferencia: ['diversos', 'categorias-referencia'] as const,
  elementosObra: ['diversos', 'elementos-obra'] as const,
  elementosFonograma: ['diversos', 'elementos-fonograma'] as const,
  subcategoriasAutoral: ['diversos', 'subcategorias', 'A'] as const,
}

export const isrcHabilitadoKey = (titularId?: number) => ['isrc-habilitado', titularId] as const
