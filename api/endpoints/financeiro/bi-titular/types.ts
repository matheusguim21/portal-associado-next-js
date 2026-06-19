export type BiTitularChartItem = {
  label: string
  valor: number
}

export type BiTitularOrigemMensalItem = {
  periodo: string
  valorDistribuicao: number
  valorRetido: number
  valorAjuste: number
  valorTotal: number
}

export type BiTitularReportData = {
  periodo?: string
  origens: {
    chart: BiTitularChartItem[]
    mensal: BiTitularOrigemMensalItem[]
  }
  categorias: { descricao: string; valor: number }[]
  rubricas: { descricao: string; valor: number }[]
  topObras: { titulo: string; valorPago: number }[]
  repertorio: {
    totalObras: number
    totalFonogramas: number
    totalObrasCadastradas: number
    totalFonogramasCadastrados: number
  }
  totalGeral: number
}

export type BiTitularReportApiResponse = {
  periodo?: string
  origens: {
    chart: { label: string; valor: number | string }[]
    mensal: {
      periodo: string
      valorDistribuicao: number | string
      valorRetido: number | string
      valorAjuste: number | string
      valorTotal: number | string
    }[]
  }
  categorias: { descricao: string; valor: number | string }[]
  rubricas: { descricao: string; valor: number | string }[]
  topObras: { titulo: string; valorPago: number | string }[]
  repertorio: {
    totalObras: number | string
    totalFonogramas: number | string
    totalObrasCadastradas: number | string
    totalFonogramasCadastrados: number | string
  }
  totalGeral: number | string
}

export type ReportChartType = 'pie' | 'bar' | 'area'

export type ReportBarChartVariant = 'simple' | 'grouped'
