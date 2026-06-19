import type { BiTitularReportApiResponse, BiTitularReportData } from './types'

function toNumber(value: number | string | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'number' ? value : Number(value)
}

export function mapBiTitularReport(apiResponse: BiTitularReportApiResponse): BiTitularReportData {
  return {
    periodo: apiResponse.periodo,
    origens: {
      chart: apiResponse.origens.chart.map((item) => ({
        label: item.label,
        valor: toNumber(item.valor),
      })),
      mensal: apiResponse.origens.mensal.map((item) => ({
        periodo: item.periodo,
        valorDistribuicao: toNumber(item.valorDistribuicao),
        valorRetido: toNumber(item.valorRetido),
        valorAjuste: toNumber(item.valorAjuste),
        valorTotal: toNumber(item.valorTotal),
      })),
    },
    categorias: apiResponse.categorias.map((item) => ({
      descricao: item.descricao,
      valor: toNumber(item.valor),
    })),
    rubricas: apiResponse.rubricas.map((item) => ({
      descricao: item.descricao,
      valor: toNumber(item.valor),
    })),
    topObras: apiResponse.topObras.map((item) => ({
      titulo: item.titulo,
      valorPago: toNumber(item.valorPago),
    })),
    repertorio: {
      totalObras: toNumber(apiResponse.repertorio.totalObras),
      totalFonogramas: toNumber(apiResponse.repertorio.totalFonogramas),
      totalObrasCadastradas: toNumber(apiResponse.repertorio.totalObrasCadastradas),
      totalFonogramasCadastrados: toNumber(apiResponse.repertorio.totalFonogramasCadastrados),
    },
    totalGeral: toNumber(apiResponse.totalGeral),
  }
}
