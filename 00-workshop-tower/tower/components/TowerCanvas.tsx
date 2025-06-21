'use client'

import { useRef } from 'react'
import { type Desafio, type Etapa } from '@/lib/data'

interface TowerCanvasProps {
  etapas: Array<{ desafio: Desafio; etapa: Etapa }>
  currentStepIndex: number
  completedSteps: Set<string>
}

export default function TowerCanvas({ etapas, currentStepIndex, completedSteps }: TowerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const getStepStatus = (index: number, desafio: Desafio, etapa: Etapa) => {
    const stepId = `${desafio.id}-${etapa.id}`
    
    if (completedSteps.has(stepId)) return 'completed'
    if (index === currentStepIndex) return 'current'
    if (index < currentStepIndex) return 'available'
    return 'locked'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
      case 'current': return 'bg-blue-500 border-blue-400 animate-pulse shadow-lg shadow-blue-500/50'
      case 'available': return 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50'
      case 'locked': return 'bg-gray-600 border-gray-500 shadow-lg shadow-gray-500/30'
      default: return 'bg-gray-600 border-gray-500 shadow-lg shadow-gray-500/30'
    }
  }

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'teoria': return '📚'
      case 'pratica': return '⚡'
      case 'projeto': return '🚀'
      default: return '📖'
    }
  }

  // Posicionamento vertical tipo torre - de baixo para cima
  const getGridPosition = (index: number) => {
    const levelHeight = 120 // espaçamento entre níveis da torre (aumentado para evitar sobreposição)
    const containerPadding = 40
    
    // Torre cresce de baixo para cima: primeiro bloco (index=0) embaixo, último (index=8) em cima
    return {
      x: -100, // movido para a esquerda
      y: index * levelHeight + containerPadding
    }
  }

  // Calcular altura total da torre
  const towerHeight = etapas.length * 120 + 80

  // Calcular altura do líquido baseado no progresso (etapas completadas)
  const completedCount = completedSteps.size
  const liquidHeight = Math.max(0, (completedCount / etapas.length) * towerHeight)

  return (
    <div className="relative w-full overflow-y-auto" style={{ height: `${Math.min(towerHeight, 600)}px` }}>
      <div 
        ref={canvasRef}
        className="relative flex flex-col items-center justify-end min-h-full"
        style={{ 
          height: `${towerHeight}px`,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)'
        }}
      >
        {/* Linha de base da torre */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-50 z-10"></div>
        
        {/* Líquido verde animado */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out overflow-hidden"
          style={{ 
            height: `${liquidHeight}px`,
            background: 'linear-gradient(to top, rgba(34, 197, 94, 0.8) 0%, rgba(74, 222, 128, 0.6) 50%, rgba(134, 239, 172, 0.4) 100%)',
            zIndex: 1
          }}
        >
          {/* Ondas na superfície */}
          <div 
            className="absolute top-0 left-0 w-full h-8 overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, rgba(134, 239, 172, 0.8) 0%, transparent 100%)'
            }}
          >
            {/* Onda 1 */}
            <div
              className="absolute top-0 animate-pulse"
              style={{
                width: '200%',
                height: '20px',
                background: 'rgba(74, 222, 128, 0.6)',
                borderRadius: '0 0 50% 50%',
                left: '-50%',
                animation: 'wave1 4s ease-in-out infinite',
                animationName: 'wave1'
              }}
            ></div>
            {/* Onda 2 */}
            <div
              className="absolute top-1"
              style={{
                width: '180%',
                height: '15px',
                background: 'rgba(134, 239, 172, 0.5)',
                borderRadius: '0 0 50% 50%',
                left: '-40%',
                animation: 'wave2 3s ease-in-out infinite reverse',
                animationName: 'wave2'
              }}
            ></div>
          </div>
          
          {/* Bolhas ocasionais */}
          {liquidHeight > 50 && (
            <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-green-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
          )}
          {liquidHeight > 100 && (
            <div className="absolute bottom-8 right-1/3 w-1 h-1 bg-green-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          )}
          {liquidHeight > 150 && (
            <div className="absolute bottom-12 left-1/2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
          )}
        </div>
        
        {etapas.map(({ desafio, etapa }, index) => {
          const position = getGridPosition(index)
          const status = getStepStatus(index, desafio, etapa)
          const colorClass = getStepColor(status)
          
          return (
            <div key={`${desafio.id}-${etapa.id}`} className="absolute">
              {/* Bloco da torre */}
              <div
                className={`w-24 h-24 rounded-xl border-4 ${colorClass} 
                  flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-110 hover:shadow-2xl
                  ${status === 'current' ? 'ring-4 ring-blue-300 ring-opacity-60' : ''}
                  backdrop-blur-sm relative z-10
                `}
                style={{
                  left: `${position.x}px`,
                  bottom: `${position.y}px`,
                  transform: 'translateX(-50%)'
                }}
                title={`${desafio.titulo} - ${etapa.titulo}`}
              >
                <div className="text-2xl mb-1">
                  {getTypeIcon(etapa.tipo)}
                </div>
                <div className="text-sm text-white font-bold text-center leading-tight">
                  {index + 1}
                </div>
              </div>
              
              {/* Conectores entre níveis */}
              {index < etapas.length - 1 && (
                <div
                  className="absolute w-1 bg-gradient-to-t from-gray-400 to-gray-600 opacity-60 z-0"
                  style={{
                    left: `${position.x}px`,
                    bottom: `${position.y + 96}px`, // Conecta ao bloco de cima
                    height: '24px', // conecta ao próximo bloco (ajustado para novo espaçamento)
                    transform: 'translateX(-50%)'
                  }}
                ></div>
              )}
            </div>
          )
        })}
        
        {/* Avatar do jogador */}
        {currentStepIndex < etapas.length && (
          <div
            className="absolute w-10 h-10 bg-purple-500 rounded-full border-4 border-purple-300 
              flex items-center justify-center text-white font-bold transition-all duration-500
              animate-bounce shadow-lg shadow-purple-500/50 z-10"
            style={{
              left: `${getGridPosition(currentStepIndex).x + 50}px`,
              bottom: `${getGridPosition(currentStepIndex).y + 28}px`,
              transform: 'translateX(-50%)'
            }}
          >
            👤
          </div>
        )}

        {/* Informações da etapa atual */}
        {currentStepIndex < etapas.length && (
          <div
            className="absolute bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-blue-400/50 
              shadow-lg shadow-blue-500/30 min-w-[300px] max-w-[400px] z-20"
            style={{
              left: `${getGridPosition(currentStepIndex).x + 360}px`,
              bottom: `${getGridPosition(currentStepIndex).y - 5}px`
            }}
          >
            <div className="text-blue-400 text-sm font-semibold mb-1">
              {etapas[currentStepIndex].desafio.titulo}
            </div>
            <div className="text-white text-lg font-bold mb-2">
              {etapas[currentStepIndex].etapa.titulo}
            </div>
            <div className="text-gray-300 text-sm leading-relaxed">
              {etapas[currentStepIndex].etapa.descricao}
            </div>
            
            {/* Seta apontando para o bloco */}
            <div 
              className="absolute w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] 
                border-t-transparent border-b-transparent border-r-black/80"
              style={{
                left: '-12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
} 