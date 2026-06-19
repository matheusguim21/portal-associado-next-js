// TODO: integrar com sipa-auth, sipa-documentacao, sipa-financeiro

export const mockUsuario = {
  id: 1,
  nome: 'Roberto Carlos',
  nomeExibicao: 'Roberto Carlos',
  usuario: 'roberto.carlos',
  codigoSoc: 12345,
  codigoEcad: 987654,
  email: 'roberto@example.com',
}

// ─── Dashboard ECAD ─────────────────────────────────────────────────────────

export const mockRecebimentoMensal = [
  { mes: '12/2025', valor: 287340.5 },
  { mes: '01/2026', valor: 412890.75 },
  { mes: '02/2026', valor: 163450.2 },
  { mes: '03/2026', valor: 108920.4 },
  { mes: '04/2026', valor: 321760.9 },
  { mes: '05/2026', valor: 95430.6 },
]

export const mockOrigemRecebimentos = [
  { name: 'DISTRIBUIÇÃO', value: 1035164, fill: '#e5bc8a' },
]

export const mockCategoriasEcad = [
  { name: 'AUTOR', value: 86, fill: '#e5bc8a' },
  { name: 'INTÉRPRETE', value: 14, fill: '#dddbd9' },
]

export const mockRubricasEcad = [
  { name: 'EXECUÇÃO PÚBLICA', value: 65, fill: '#e5bc8a' },
  { name: 'RADIODIFUSÃO', value: 20, fill: '#dddbd9' },
  { name: 'COMUNICAÇÃO AO PÚBLICO', value: 10, fill: '#e4e3e2' },
  { name: 'OUTROS', value: 5, fill: '#e7bc88' },
]

export const mockTopObras = [
  { name: 'DETALHES DA VIDA', value: 42350.8, fill: '#e5bc8a' },
  { name: 'CAVALO DE AÇO', value: 38920.5, fill: '#dddbd9' },
  { name: 'COMO É GRANDE O MEU AMOR', value: 31450.2, fill: '#e4e3e2' },
  { name: 'FÉ', value: 28780.9, fill: '#e7bc88' },
  { name: 'EMOÇÕES', value: 21340.4, fill: '#cea674' },
]

// ─── Obras Musicais ──────────────────────────────────────────────────────────

export type ObraMusical = {
  id: number
  codigoSoc: string
  codigoEcad: string
  titulo: string
  tipo: 'ORIGINAL' | 'DERIVADA'
  situacao: string
  iswc?: string
  nacional: boolean
  instrumental: boolean
}

export const mockObras: ObraMusical[] = [
  { id: 1, codigoSoc: 'SOC-001', codigoEcad: 'E-88001', titulo: 'DETALHES DA VIDA', tipo: 'ORIGINAL', situacao: 'ATIVO', iswc: 'T-001.234.567-0', nacional: true, instrumental: false },
  { id: 2, codigoSoc: 'SOC-002', codigoEcad: 'E-88002', titulo: 'CAVALO DE AÇO', tipo: 'ORIGINAL', situacao: 'ATIVO', iswc: 'T-001.234.568-1', nacional: true, instrumental: false },
  { id: 3, codigoSoc: 'SOC-003', codigoEcad: 'E-88003', titulo: 'COMO É GRANDE O MEU AMOR', tipo: 'ORIGINAL', situacao: 'ATIVO', nacional: true, instrumental: false },
  { id: 4, codigoSoc: 'SOC-004', codigoEcad: 'E-88004', titulo: 'FÉ', tipo: 'ORIGINAL', situacao: 'PENDENTE', nacional: true, instrumental: false },
  { id: 5, codigoSoc: 'SOC-005', codigoEcad: 'E-88005', titulo: 'EMOÇÕES', tipo: 'ORIGINAL', situacao: 'ATIVO', nacional: true, instrumental: false },
  { id: 6, codigoSoc: 'SOC-006', codigoEcad: '', titulo: 'JESUS CRISTO', tipo: 'ORIGINAL', situacao: 'PENDENTE', nacional: true, instrumental: false },
  { id: 7, codigoSoc: 'SOC-007', codigoEcad: 'E-88007', titulo: 'CIRANDEIRO', tipo: 'DERIVADA', situacao: 'ATIVO', nacional: true, instrumental: false },
  { id: 8, codigoSoc: 'SOC-008', codigoEcad: 'E-88008', titulo: 'NOSSA SENHORA', tipo: 'ORIGINAL', situacao: 'ATIVO', nacional: true, instrumental: false },
  { id: 9, codigoSoc: 'SOC-009', codigoEcad: '', titulo: 'SEREIA', tipo: 'ORIGINAL', situacao: 'BLOQUEADO', nacional: true, instrumental: false },
  { id: 10, codigoSoc: 'SOC-010', codigoEcad: 'E-88010', titulo: 'LUA BRANCA', tipo: 'ORIGINAL', situacao: 'ATIVO', nacional: true, instrumental: true },
]

// ─── Fonogramas ──────────────────────────────────────────────────────────────

export type Fonograma = {
  id: number
  codigoSoc: string
  titulo: string
  isrc: string
  tipo: string
  situacao: string
  gravadora?: string
}

export const mockFonogramas: Fonograma[] = [
  { id: 1, codigoSoc: 'F-001', titulo: 'DETALHES DA VIDA', isrc: 'BR-SOC-25-00001', tipo: 'ÁLBUM', situacao: 'ATIVO', gravadora: 'CBS RECORDS' },
  { id: 2, codigoSoc: 'F-002', titulo: 'CAVALO DE AÇO', isrc: 'BR-SOC-25-00002', tipo: 'SINGLE', situacao: 'ATIVO', gravadora: 'CBS RECORDS' },
  { id: 3, codigoSoc: 'F-003', titulo: 'FÉ', isrc: 'BR-SOC-25-00003', tipo: 'ÁLBUM', situacao: 'PENDENTE', gravadora: 'SONY MUSIC' },
  { id: 4, codigoSoc: 'F-004', titulo: 'EMOÇÕES', isrc: 'BR-SOC-25-00004', tipo: 'ÁLBUM', situacao: 'ATIVO', gravadora: 'SONY MUSIC' },
  { id: 5, codigoSoc: 'F-005', titulo: 'NOSSA SENHORA', isrc: 'BR-SOC-25-00005', tipo: 'SINGLE', situacao: 'ATIVO', gravadora: 'CBS RECORDS' },
]

// ─── Demonstrativos ECAD ─────────────────────────────────────────────────────

export type DemonstrativoEcad = {
  id: number
  periodo: string
  grupo: string
  arquivo: string
  tipo: string
}

export const mockDemonstrativosEcad: DemonstrativoEcad[] = [
  { id: 1, periodo: '05/2026', grupo: 'DISTRIBUIÇÃO', arquivo: 'DIST-2026-05-RC.PDF', tipo: 'PDF' },
  { id: 2, periodo: '04/2026', grupo: 'DISTRIBUIÇÃO', arquivo: 'DIST-2026-04-RC.PDF', tipo: 'PDF' },
  { id: 3, periodo: '03/2026', grupo: 'RADIODIFUSÃO', arquivo: 'RADIO-2026-03-RC.PDF', tipo: 'PDF' },
  { id: 4, periodo: '02/2026', grupo: 'DISTRIBUIÇÃO', arquivo: 'DIST-2026-02-RC.PDF', tipo: 'PDF' },
  { id: 5, periodo: '01/2026', grupo: 'DISTRIBUIÇÃO', arquivo: 'DIST-2026-01-RC.XLSX', tipo: 'XLSX' },
  { id: 6, periodo: '12/2025', grupo: 'EXECUÇÃO PÚBLICA', arquivo: 'EP-2025-12-RC.PDF', tipo: 'PDF' },
]

// ─── Pagamentos SOCINPRO ─────────────────────────────────────────────────────

export type PagamentoSoc = {
  id: number
  dataPagamento: string
  valorPagamento: number
  tipoPagamento: string
}

export const mockPagamentosSoc: PagamentoSoc[] = [
  { id: 1, dataPagamento: '15/05/2026', valorPagamento: 42350.8, tipoPagamento: 'TRANSFERÊNCIA BANCÁRIA' },
  { id: 2, dataPagamento: '15/04/2026', valorPagamento: 38920.5, tipoPagamento: 'TRANSFERÊNCIA BANCÁRIA' },
  { id: 3, dataPagamento: '15/03/2026', valorPagamento: 31450.2, tipoPagamento: 'TRANSFERÊNCIA BANCÁRIA' },
  { id: 4, dataPagamento: '15/02/2026', valorPagamento: 28780.9, tipoPagamento: 'TRANSFERÊNCIA BANCÁRIA' },
  { id: 5, dataPagamento: '15/01/2026', valorPagamento: 21340.4, tipoPagamento: 'TRANSFERÊNCIA BANCÁRIA' },
]

// ─── Retidos ─────────────────────────────────────────────────────────────────

export type Retido = {
  id: number
  titulo: string
  codigo: string
  rubrica: string
  situacao: string
  valor: number
  periodo: string
}

export const mockRetidos: Retido[] = [
  { id: 1, titulo: 'DETALHES DA VIDA', codigo: 'SOC-001', rubrica: 'EXECUÇÃO PÚBLICA', situacao: 'AGUARDANDO', valor: 1250.0, periodo: '01/2026' },
  { id: 2, titulo: 'FÉ', codigo: 'SOC-004', rubrica: 'RADIODIFUSÃO', situacao: 'EM DEPURAÇÃO', valor: 890.5, periodo: '01/2026' },
  { id: 3, titulo: 'EMOÇÕES', codigo: 'SOC-005', rubrica: 'EXECUÇÃO PÚBLICA', situacao: 'AGUARDANDO', valor: 340.2, periodo: '01/2026' },
]

// ─── Ocorrências ─────────────────────────────────────────────────────────────

export type Ocorrencia = {
  id: number
  tipo: string
  status: string
  data: string
  descricao: string
}

export const mockOcorrencias: Ocorrencia[] = [
  { id: 1, tipo: 'OBRA', status: 'PROCESSADO', data: '10/05/2026', descricao: 'Cadastro de obra "DETALHES DA VIDA" aprovado.' },
  { id: 2, tipo: 'FONOGRAMA', status: 'PENDENTE', data: '08/05/2026', descricao: 'Fonograma "FÉ" aguardando validação.' },
  { id: 3, tipo: 'OBRA', status: 'ERRO', data: '05/05/2026', descricao: 'Inconsistência nos titulares da obra "SEREIA".' },
  { id: 4, tipo: 'FINANCEIRO', status: 'PROCESSADO', data: '01/05/2026', descricao: 'Pagamento referente a 04/2026 realizado.' },
]

// ─── Utilitários ─────────────────────────────────────────────────────────────

export { formatarMoeda } from '@/lib/format'
