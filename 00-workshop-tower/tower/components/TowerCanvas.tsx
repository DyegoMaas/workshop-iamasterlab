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
      case 'completed': return 'bg-green-500 border-green-400'
      case 'current': return 'bg-blue-500 border-blue-400 animate-pulse'
      case 'available': return 'bg-yellow-500 border-yellow-400'
      case 'locked': return 'bg-gray-600 border-gray-500'
      default: return 'bg-gray-600 border-gray-500'
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

  // Organizar etapas em grid hexagonal (simulado)
  const getGridPosition = (index: number) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    const offset = row % 2 === 1 ? 1.5 : 0 // Offset para simular hexágono
    
    return {
      x: col * 120 + offset * 60,
      y: row * 100
    }
  }

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div 
        ref={canvasRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
        }}
      >
        <div className="relative">
          {etapas.map(({ desafio, etapa }, index) => {
            const position = getGridPosition(index)
            const status = getStepStatus(index, desafio, etapa)
            const colorClass = getStepColor(status)
            
            return (
              <div
                key={`${desafio.id}-${etapa.id}`}
                className={`absolute w-16 h-16 rounded-lg border-2 ${colorClass} 
                  flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-110 hover:shadow-lg
                  ${status === 'current' ? 'ring-4 ring-blue-300' : ''}
                `}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`${desafio.titulo} - ${etapa.titulo}`}
              >
                <div className="text-lg mb-1">
                  {getTypeIcon(etapa.tipo)}
                </div>
                <div className="text-xs text-white font-bold text-center leading-tight">
                  {index + 1}
                </div>
              </div>
            )
          })}
          
          {/* Avatar do jogador */}
          {currentStepIndex < etapas.length && (
            <div
              className="absolute w-8 h-8 bg-purple-500 rounded-full border-2 border-purple-300 
                flex items-center justify-center text-white font-bold transition-all duration-500
                animate-bounce"
              style={{
                left: `${getGridPosition(currentStepIndex).x + 35}px`,
                top: `${getGridPosition(currentStepIndex).y - 10}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              👤
            </div>
          )}
        </div>
      </div>
      
      {/* Legenda */}
      <div className="absolute bottom-2 left-2 text-xs text-slate-300 space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded animate-pulse"></div>
          <span>Atual</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span>Bloqueado</span>
        </div>
      </div>
    </div>
  )
} 