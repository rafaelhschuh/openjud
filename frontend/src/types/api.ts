// Frontend API Types - mirrors backend types

export interface OrgaoJulgador {
  codigo: number
  nome: string
  codigoMunicipioIBGE: number
}

export interface Movimento {
  codigo: number
  nome: string
  dataHora: string
  complementosTabelados: Array<{
    codigo: number
    descricao: string
    valor: number
    nome: string
  }>
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
  formato: {
    codigo: number
    nome: string
  }
  sistema: {
    codigo: number
    nome: string
  }
  classe: {
    codigo: number
    nome: string
  }
  assuntos: Array<{
    codigo: number
    nome: string
  }>
  orgaoJulgador: OrgaoJulgador
  movimentos: Movimento[]
  dataHoraUltimaAtualizacao: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
