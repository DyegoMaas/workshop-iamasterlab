import desafiosData from '@/data/desafios.json'

export interface Pergunta {
  id: string
  titulo: string
  descricao: string
  ordem: number
  tipo: 'texto' | 'multipla-escolha' | 'verdadeiro-falso'
}

export interface Etapa {
  id: string
  titulo: string
  descricao: string
  ordem: number
  tipo: 'teoria' | 'pratica' | 'projeto'
  tempoEstimado: number
  perguntas?: Pergunta[]
}

export interface Desafio {
  id: string
  titulo: string
  descricao: string
  ordem: number
  etapas: Etapa[]
}

export interface DesafiosData {
  desafios: Desafio[]
}

export function getDesafios(): Desafio[] {
  return (desafiosData as DesafiosData).desafios.sort((a, b) => a.ordem - b.ordem)
}

export function getDesafio(id: string): Desafio | undefined {
  return getDesafios().find(desafio => desafio.id === id)
}

export function getEtapa(desafioId: string, etapaId: string): Etapa | undefined {
  const desafio = getDesafio(desafioId)
  return desafio?.etapas.find(etapa => etapa.id === etapaId)
}

export function getAllEtapas(): Array<{ desafio: Desafio; etapa: Etapa }> {
  const result: Array<{ desafio: Desafio; etapa: Etapa }> = []
  
  getDesafios().forEach(desafio => {
    desafio.etapas
      .sort((a, b) => a.ordem - b.ordem)
      .forEach(etapa => {
        result.push({ desafio, etapa })
      })
  })
  
  return result
} 