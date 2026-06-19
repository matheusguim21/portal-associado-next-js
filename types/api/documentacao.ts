export type SituacaoCadastral = {
  sigla?: string
  descricao?: string
  codigo?: string
}

export type TitularBasicoApi = {
  id?: number
  nome?: string
  codigoEcad?: number
}

export type SubcategoriaBasicoApi = {
  codSubCategoria?: string
  descricao?: string
}

export type ObraMusicalTitularApi = {
  linkSoc?: number
  percentual?: number
  titular?: TitularBasicoApi
  dtInicio?: string
  dtFim?: string
  subCategoria?: SubcategoriaBasicoApi
}

export type GeneroMusicalApi = {
  codigo?: string
  descricao?: string
}

export type IdiomaApi = {
  sigla?: string
  idioma?: string
}

export type TipoObraCompostaApi = {
  tipo?: string
  descricao?: string
}

export type ObraMusicalSubtituloApi = {
  id?: number
  subtitulo?: string
  tipoTitulo?: { codigo?: string; descricao?: string }
}

export type ObraMusicalReferenciaApi = {
  id?: number
  referencia?: string
  categoria?: { codigo?: string; descricao?: string }
}

export type ObraMusicalBasicoApi = {
  id?: number
  titulo?: string
  codigoEcad?: number
}

export type PaisApi = {
  sigla?: string
  nome?: string
}

export type ObraMusicalApi = {
  id: number
  codigoEcad?: number
  iswc?: string
  titulo: string
  derivada?: string
  dtRegistro?: string
  dtCriacao?: string
  duracao?: string
  situacaoCadastral?: SituacaoCadastral
  nacional?: string
  instrumental?: string
  composta?: string
  usoIA?: string
  tpUsoIA?: 'T' | 'P'
  linkAudio?: string
  status?: ArquivoRepertorioStatus
  generoMusical?: GeneroMusicalApi
  idioma?: IdiomaApi
  tipoObraComposta?: TipoObraCompostaApi
  obraMusicalOriginal?: ObraMusicalBasicoApi
  obraMusicalTitular?: ObraMusicalTitularApi[]
}

export type ArquivoRepertorioStatus =
  | 'SALVO'
  | 'GRAVADO'
  | 'ENVIADO'
  | 'PROCESSADO'
  | 'ERRO'
  | 'CAD_TITULAR'
  | 'PENDENTE'
  | 'LEITURA'

export type ObraMusicalFiltro = {
  pesquisa?: string
  titulo?: string
  id?: number
  codigoEcad?: number
  nacional?: 'S' | 'N'
  derivada?: 'N' | 'S'
  titularId?: number
  titularNome?: string
  titularPseudonimo?: string
  status?: ArquivoRepertorioStatus
  page?: number
  size?: number
  sort?: string
}

export type FonogramaApi = {
  id: number
  codigoEcad?: number
  titulo?: string
  isrc?: string
  gra?: string
  obraMusical?: ObraMusicalBasicoApi
  poutPourrit?: { id?: number; titulo?: string; codEcad?: number }
  dtLancamento?: string
  dtGravacaoOriginal?: string
  dtEmissao?: string
  nacional?: string
  pais?: PaisApi
  situacaoCadastral?: SituacaoCadastral
  status?: string
}

export type FonogramaFiltro = {
  tipoObmPop?: 'OBRA_MUSICAL' | 'POUT_POURRIT'
  pesquisa?: string
  titulo?: string
  isrc?: string
  id?: number
  codigoEcad?: number
  gra?: string
  situacaoCadastral?: string
  dtEmissao?: string
  status?: ArquivoRepertorioStatus
  nacional?: 'S' | 'N'
  titularId?: number
  titularNome?: string
  titularPseudonimo?: string
  page?: number
  size?: number
  sort?: string
}

export type TitularFiltro = {
  pesquisa?: string
  id?: number
  nome?: string
  email?: string
  pseudonimo?: string
  cpfCnpj?: string
  celular?: string
  codigoEcad?: number
  codigoCae?: number
  codigoIpi?: string
  codigoIpn?: number
  situacaoCadastro?: 'A' | 'I'
  nacional?: 'S' | 'N'
  page?: number
  size?: number
  sort?: string
}

export type TitularApi = {
  id: number
  nome: string
  codigoEcad?: number
  cpfCnpj?: string
  email?: string
}

export type DemonstrativoEcadApi = {
  id?: number
  periodo?: string
  grupo?: string
  nomeArquivo?: string
}

export type DemonstrativoSocApi = {
  pagamentoId?: number
  periodo?: string
  valor?: number
  dataPagamento?: string
}

export type SocSaldoApi = {
  saldo: number
  irrf: number
}

export type EstatisticaCategoriaApi = {
  codigo: string
  descricao: string
  valor: number
}

export type EstatisticaRubricaApi = {
  statisticaRubricaAgrupamento: {
    codigo: number
    descricao: string
  }
  valor: number
}

export type EstatisticaOrigemApi = {
  origemAgrupamento: {
    codigo: number
    descricao: string
  }
  valor: number
}

export type EstatisticaOrigemMensalApi = {
  periodo: string
  valorDistribuicao: number
  valorRetido: number
  valorAjuste: number
  valorTotal: number
}

export type EstatisticaTopObraApi = {
  codigoEcad: number
  titulo: string
  valorPago: number
}

export type ColetivoApi = {
  id: number
  codEcad?: number
  nome: string
}

export type PoutPourritApi = {
  id: number
  titulo?: string
  codEcad?: number
  iswc?: string
}

export type ArquivoRepertorioApi = {
  id: number
  nomeArquivo?: string
  status?: string
  tipo?: string
  dataGeracao?: string
}

export type SocMutuoResumoApi = {
  valorLiberado?: number
  saldoMutuo?: number
}

export type SocImpostoResumoApi = {
  anosDisponiveis: number[]
  anoSugerido?: number
}

export type IsrcHabilitadoApi = {
  habilitado: boolean
}

export type SimNaoApi = 'S' | 'N'

export type TitularIdInput = {
  id: number
}

export type SubcategoriaInput = {
  codSubCategoria: string
}

export type ObraMusicalTitularInput = {
  titular: TitularIdInput
  subcategoria: SubcategoriaInput
  percentual?: number
  linkSoc?: number
  dtInicio?: string
}

export type ObraMusicalSubtituloInput = {
  subtitulo: string
  tipoTitulo: { codigo: string }
}

export type ObraMusicalReferenciaInput = {
  referencia: string
  categoria: { codigo: string }
}

export type ObraMusicalElementoIAGInput = {
  elemento: { codigo: number }
  ferramentas?: string
  observacao?: string
}

export type TipoTituloApi = {
  codigo?: string
  descricao?: string
}

export type CategoriaReferenciaApi = {
  codigo?: string
  descricao?: string
}

export type ElementoApi = {
  codigo?: number
  nome?: string
}

export type ObraMusicalElementoIAGApi = {
  id?: number
  elemento?: ElementoApi
  ferramentas?: string
  observacao?: string
}

export type ObraMusicalCreateInput = {
  titulo: string
  nacional: SimNaoApi
  instrumental: SimNaoApi
  duracao?: string
  dtCriacao?: string
  derivada?: 'N' | 'S'
  composta?: SimNaoApi
  usoIA?: SimNaoApi
  tpUsoIA?: 'T' | 'P'
  linkAudio?: string
  generoMusical?: { codigo: string }
  idioma?: { sigla: string }
  tipoObraComposta?: { tipo: string }
  obraMusicalOriginal?: { id: number }
  obraMusicalTitular?: ObraMusicalTitularInput[]
  obraMusicalSubtitulo?: ObraMusicalSubtituloInput[]
  obraMusicalReferencia?: ObraMusicalReferenciaInput[]
  obraMusicalElementoIAG?: ObraMusicalElementoIAGInput[]
}

export type FonogramaTitularInput = {
  titular: TitularIdInput
  subcategoria: SubcategoriaInput
  percentual?: number
  percentualAutomatico?: SimNaoApi
  interpretePrincipal?: SimNaoApi
}

export type FonogramaCreateInput = {
  isrc?: string
  instrumental: SimNaoApi
  nacional: SimNaoApi
  duracao?: string
  gra?: number
  rotulo: SimNaoApi
  bloqueado: SimNaoApi
  publicacaoSimultanea: SimNaoApi
  dominioPublico: SimNaoApi
  rotMusicoAcompanhante: SimNaoApi
  fonogramaPendenteFicha: SimNaoApi
  status: ArquivoRepertorioStatus
  temAgregadora: SimNaoApi
  usoIA: SimNaoApi
  obraMusical?: { id: number }
  poutPourrit?: { id: number }
  fonogramaTitular?: FonogramaTitularInput[]
}

export type IsrcOnlineCodigoApi = {
  isrc: string
}
