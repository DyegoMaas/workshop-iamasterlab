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
    const levelHeight = 90 // espaçamento entre níveis da torre
    const containerPadding = 40
    
    // Torre cresce de baixo para cima: primeiro bloco (index=0) embaixo, último (index=8) em cima
    return {
      x: 0, // centralizado horizontalmente
      y: index * levelHeight + containerPadding
    }
  }

  // Calcular altura total da torre
  const towerHeight = etapas.length * 90 + 80

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
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-50"></div>
        
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
                    height: '42px', // conecta ao próximo bloco
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
      </div>
      
      {/* Legenda */}
      <div className="absolute top-4 left-4 text-xs text-slate-300 space-y-1 bg-black/50 p-3 rounded-lg backdrop-blur-sm">
        <div className="text-sm font-bold mb-2 text-white">Torre de Desafios</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
          <span>Completo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded animate-pulse shadow-sm"></div>
          <span>Atual</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded shadow-sm"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded shadow-sm"></div>
          <span>Bloqueado</span>
        </div>
      </div>
    </div>
  )
} 