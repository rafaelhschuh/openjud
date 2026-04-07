// DataJud API Response Types

export interface Tribunal {
  codigo: string
  nome: string
}

export interface ClasseProcessual {
  codigo: number
  nome: string
}

export interface AssuntoProcessual {
  codigo: number
  nome: string
}

export interface OrgaoJulgador {
  codigo: number
  nome: string
  codigoMunicipioIBGE: number
}

export interface Formato {
  codigo: number
  nome: string
}

export interface Sistema {
  codigo: number
  nome: string
}

export interface Classe {
  codigo: number
  nome: string
}

export interface Assunto {
  codigo: number
  nome: string
}

export interface ComplementoTabelado {
  codigo: number
  descricao: string
  valor: number
  nome: string
}

export interface Movimento {
  codigo: number
  nome: string
  dataHora: string
  complementosTabelados: ComplementoTabelado[]
  orgaoJulgador?: {
    codigoOrgao: number
    nomeOrgao: string
  }
}

export interface Processo {
  id: string
  tribunal: string
  numeroProcesso: string
  dataAjuizamento: string
  grau: string
  nivelSigilo: number
  formato: Formato
  sistema: Sistema
  classe: Classe
  assuntos: Assunto[]
  orgaoJulgador: OrgaoJulgador
  movimentos: Movimento[]
  dataHoraUltimaAtualizacao: string
  '@timestamp'?: string
}

export interface SearchParams {
  numeroProcesso?: string
  tribunal?: string
  classe?: string
  assunto?: string
  orgaoJulgador?: string
  dataAjuizamentoFrom?: string
  dataAjuizamentoTo?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SearchResponse {
  hits: {
    total: { value: number }
    hits: Array<{
      _source: Processo
    }>
  }
}
