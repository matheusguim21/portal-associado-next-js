import { createObraMusicalDefaultValues, type CreateObraMusicalFormData } from '@/schemas/create-obra-musical-schema'
import type {
  ObraMusicalApi,
  ObraMusicalElementoIAGApi,
  ObraMusicalReferenciaApi,
  ObraMusicalSubtituloApi,
} from '@/types/api/documentacao'

function simNaoToBoolean(value?: string | null): boolean {
  return value === 'S'
}

export function mapObraMusicalApiToFormData(
  obra: ObraMusicalApi,
  subtitulos: ObraMusicalSubtituloApi[] = [],
  referencias: ObraMusicalReferenciaApi[] = [],
  elementosIa: ObraMusicalElementoIAGApi[] = [],
): CreateObraMusicalFormData {
  return {
    ...createObraMusicalDefaultValues,
    titulo: obra.titulo ?? '',
    duracao: obra.duracao ?? '',
    nacional: simNaoToBoolean(obra.nacional),
    instrumental: simNaoToBoolean(obra.instrumental),
    dtCriacao: obra.dtCriacao ?? '',
    generoMusicalCodigo: obra.generoMusical?.codigo ?? '',
    idiomaSigla: obra.idioma?.sigla ?? '',
    composta: simNaoToBoolean(obra.composta),
    tipoObraComposta: obra.tipoObraComposta?.tipo ?? '',
    derivada: obra.derivada === 'S' ? 'S' : 'N',
    obraOriginalId: obra.obraMusicalOriginal?.id,
    obraOriginalTitulo: obra.obraMusicalOriginal?.titulo ?? '',
    obraOriginalCodigoEcad: obra.obraMusicalOriginal?.codigoEcad,
    usoIA: simNaoToBoolean(obra.usoIA),
    tpUsoIA: obra.tpUsoIA === 'T' || obra.tpUsoIA === 'P' ? obra.tpUsoIA : undefined,
    linkAudio: obra.linkAudio ?? '',
    titulares:
      obra.obraMusicalTitular?.map((titular) => ({
        titularId: titular.titular?.id,
        titularNome: titular.titular?.nome,
        codigoEcad: titular.titular?.codigoEcad,
        subcategoriaCodigo: titular.subCategoria?.codSubCategoria ?? '',
        percentual: titular.percentual ?? 0,
        dtInicio: titular.dtInicio ?? '',
      })) ?? [],
    subtitulos: subtitulos.map((item) => ({
      subtitulo: item.subtitulo ?? '',
      tipoTitulo: item.tipoTitulo?.codigo ?? '',
    })),
    referencias: referencias.map((item) => ({
      referencia: item.referencia ?? '',
      categoriaCodigo: item.categoria?.codigo ?? '',
    })),
    elementosIa: elementosIa.map((item) => ({
      elementoCodigo: item.elemento?.codigo != null ? String(item.elemento.codigo) : '',
      ferramentas: item.ferramentas ?? '',
      observacao: item.observacao ?? '',
    })),
  }
}
