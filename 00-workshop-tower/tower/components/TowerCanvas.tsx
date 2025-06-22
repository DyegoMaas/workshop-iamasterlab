'use client'

import { useRef, useState, useEffect } from 'react'
import { type Desafio, type Etapa } from '@/lib/data'

interface TowerCanvasProps {
  etapas: Array<{ desafio: Desafio; etapa: Etapa }>
  currentStepIndex: number
  completedSteps: Set<string>
  completeCurrentStep: () => void
  onStepSelect?: (index: number | null) => void
  selectedStepIndex?: number | null
}

export default function TowerCanvas({ 
  etapas, 
  currentStepIndex, 
  completedSteps, 
  completeCurrentStep,
  onStepSelect,
  selectedStepIndex
}: TowerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null)
  const [lightningFlash, setLightningFlash] = useState(false)
  const [lightningPosition, setLightningPosition] = useState({ x: 50, rotation: -10 })

  // Scroll automático para a etapa atual
  useEffect(() => {
    if (canvasRef.current && currentStepIndex < etapas.length) {
      const container = canvasRef.current.parentElement // o div com overflow-y-auto
      if (container) {
        const levelHeight = 100 // ajustado para novos blocos
        const containerPadding = 40
        
        // Calcular posição da etapa atual (mesma lógica do getGridPosition)
        const currentStepPosition = currentStepIndex * levelHeight + containerPadding
        
        // Altura total da torre
        const towerHeight = etapas.length * 100 + 80 // ajustado
        
        // Altura da viewport
        const viewportHeight = Math.min(towerHeight, 600)
        
        // Calcular scroll position para centralizar a etapa atual
        // Como usamos bottom positioning, precisamos inverter o cálculo
        const scrollPosition = towerHeight - currentStepPosition - (viewportHeight / 2)
        
        // Garantir que não ultrapasse os limites
        const maxScroll = towerHeight - viewportHeight
        const finalScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll))
        
        container.scrollTo({
          top: finalScrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }, [currentStepIndex, etapas.length])

  // Efeito de raio com timing aleatório
  useEffect(() => {
    // Para o efeito de raio no último nível ou se a torre estiver vazia
    if (etapas.length === 0 || currentStepIndex >= etapas.length - 1) {
      setLightningFlash(false) // Garante que qualquer raio ativo seja desligado
      return // Impede a criação de novos raios
    }

    // Calcular percentual de conclusão
    const completionPercentage = completedSteps.size / etapas.length
    
    // Multiplicador de intervalo baseado no progresso (1x a 4x)
    // 0% completo = 1x (mais frequente)
    // 100% completo = 4x (menos frequente)
    const frequencyMultiplier = 1 + (completionPercentage * 3)
    
    const triggerLightning = () => {
      // Gerar posição e rotação aleatórias
      setLightningPosition({
        x: 10 + Math.random() * 80, // 10% a 90% da largura
        rotation: -15 + Math.random() * 30 // -15° a +15°
      })
      
      setLightningFlash(true)
      
      // Duração do flash (100-200ms)
      const flashDuration = 100 + Math.random() * 100
      setTimeout(() => setLightningFlash(false), flashDuration)
      
      // Próximo raio após 2-8 segundos * multiplicador de frequência
      const baseInterval = 2000 + Math.random() * 6000
      const adjustedInterval = baseInterval * frequencyMultiplier
      setTimeout(triggerLightning, adjustedInterval)
    }

    // Primeiro raio após 1-3 segundos * multiplicador de frequência
    const baseInitialDelay = 1000 + Math.random() * 2000
    const adjustedInitialDelay = baseInitialDelay * frequencyMultiplier
    const timeoutId = setTimeout(triggerLightning, adjustedInitialDelay)

    return () => clearTimeout(timeoutId)
  }, [completedSteps.size, etapas.length, currentStepIndex]) // Reagir às mudanças no progresso e na etapa atual

  const getStepStatus = (index: number, desafio: Desafio, etapa: Etapa) => {
    const stepId = `${desafio.id}-${etapa.id}`
    
    if (completedSteps.has(stepId)) return 'completed'
    if (index === currentStepIndex) return 'current'
    if (index < currentStepIndex) return 'available'
    return 'locked'
  }

  const getStepColor = (status: string, isSelected: boolean = false) => {
    if (isSelected) return 'bg-purple-500 border-purple-400 ring-4 ring-purple-300 ring-opacity-60 shadow-lg shadow-purple-500/50'
    
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
      case 'current': return 'bg-blue-500 border-blue-400 animate-pulse shadow-lg shadow-blue-500/50'
      case 'available': return 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50'
      case 'locked': return 'bg-gray-600 border-gray-500 shadow-lg shadow-gray-500/30'
      default: return 'bg-gray-600 border-gray-500 shadow-lg shadow-gray-500/30'
    }
  }



  // Função para determinar o estilo do conector baseado se as etapas são do mesmo desafio
  const getConnectorStyle = (currentIndex: number) => {
    if (currentIndex >= etapas.length - 1) return ''
    
    const currentDesafioId = etapas[currentIndex].desafio.id
    const nextDesafioId = etapas[currentIndex + 1].desafio.id
    
    // Se são do mesmo desafio, usar conector mais forte
    if (currentDesafioId === nextDesafioId) {
      return 'w-3 bg-gradient-to-t from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50 opacity-90'
    }
    
    // Se são de desafios diferentes, usar conector padrão (mais sutil)
    return 'w-1 bg-gradient-to-t from-gray-400 to-gray-600 opacity-60'
  }

  // Posicionamento vertical tipo torre - de baixo para cima
  const getGridPosition = (index: number) => {
    const levelHeight = 100 // espaçamento reduzido entre níveis
    const containerPadding = 40
    
    // Torre cresce de baixo para cima: primeiro bloco (index=0) embaixo, último (index=8) em cima
    return {
      x: 0, // centralizado horizontalmente
      y: index * levelHeight + containerPadding
    }
  }

  // Calcular altura total da torre
  const towerHeight = etapas.length * 100 + 80 // ajustado para novos blocos

  // Calcular altura do líquido baseado no progresso (etapas completadas)
  const completedCount = completedSteps.size
  const liquidHeight = Math.max(0, (completedCount / etapas.length) * towerHeight)

  // Calcular percentual de conclusão para efeitos visuais
  const completionPercentage = completedSteps.size / etapas.length
  
  // Gerar gotas de chuva - quantidade diminui com o progresso
  // Começar com 50 gotas e diminuir até 10 gotas quando completo
  const maxRainDrops = 50
  const minRainDrops = 10
  const rainDropCount = Math.round(maxRainDrops - (completionPercentage * (maxRainDrops - minRainDrops)))
  
  // Cores do fundo baseadas no progresso
  const getSkyBackground = (isLightning = false) => {
    if (isLightning) {
      // Fundo com raio - transição de tempestade para céu claro com flash
      if (completionPercentage < 0.3) {
        return 'linear-gradient(to top, rgba(200, 220, 255, 0.3) 0%, rgba(150, 200, 255, 0.2) 50%, rgba(100, 150, 255, 0.1) 100%)'
      } else if (completionPercentage < 0.7) {
        return 'linear-gradient(to top, rgba(220, 240, 255, 0.4) 0%, rgba(180, 220, 255, 0.3) 50%, rgba(140, 180, 255, 0.2) 100%)'
      } else {
        return 'linear-gradient(to top, rgba(240, 250, 255, 0.6) 0%, rgba(200, 230, 255, 0.4) 50%, rgba(160, 200, 255, 0.3) 100%)'
      }
    } else {
      // Fundo normal - transição de tempestade escura para céu azul bonito
      if (completionPercentage < 0.3) {
        // Início: tempestade escura
        return 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)'
      } else if (completionPercentage < 0.7) {
        // Meio: transição para céu
        return 'linear-gradient(to top, rgba(30, 58, 138, 0.6) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)'
      } else {
        // Final: céu azul bonito
        return 'linear-gradient(to top, rgba(56, 189, 248, 0.4) 0%, rgba(125, 211, 252, 0.3) 50%, rgba(186, 230, 253, 0.2) 100%)'
      }
    }
  }
  
  const rainDrops = Array.from({ length: rainDropCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // posição horizontal em %
    delay: Math.random() * 3, // delay inicial em segundos
    duration: 1 + Math.random() * 2, // duração da animação
    opacity: 0.1 + Math.random() * 0.3, // opacidade variável
    length: 20 + Math.random() * 30 // comprimento da gota
  }))

  return (
    <div className="relative w-full overflow-y-auto" style={{ height: `${Math.min(towerHeight, 600)}px` }}>
      <div 
        ref={canvasRef}
        className="relative flex flex-col items-center justify-end min-h-full transition-all duration-100"
        style={{ 
          height: `${towerHeight}px`,
          background: getSkyBackground(lightningFlash)
        }}
      >
        {/* Efeito de raio */}
        {lightningFlash && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '0px',
              left: `${lightningPosition.x}%`,
              width: '3px',
              height: '100%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(200, 230, 255, 0.7) 30%, rgba(150, 200, 255, 0.5) 60%, transparent 100%)',
              boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.8), 0 0 30px 10px rgba(150, 200, 255, 0.4)',
              transform: `translateX(-50%) rotate(${lightningPosition.rotation}deg)`,
              zIndex: -1,
              animation: 'lightningShake 0.15s ease-in-out'
            }}
          />
        )}

        {/* Efeito de chuva ao fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute bg-blue-200/20 rounded-full"
              style={{
                left: `${drop.x}%`,
                width: '2px',
                height: `${drop.length}px`,
                opacity: drop.opacity,
                animationName: 'rainFall',
                animationDuration: `${drop.duration}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `${drop.delay}s`,
                background: 'linear-gradient(to bottom, rgba(147, 197, 253, 0.3) 0%, transparent 100%)',
                transform: 'translateY(-100vh)'
              }}
            />
          ))}
        </div>

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
          const isSelected = selectedStepIndex === index
          const colorClass = getStepColor(status, isSelected)
          const isClickable = status === 'completed' || status === 'current'
          
          const handleStepClick = () => {
            if (status === 'completed' && onStepSelect) {
              onStepSelect(index)
            } else if (status === 'current' && onStepSelect) {
              // Se clicar na etapa atual, desselecionar (voltar ao atual)
              onStepSelect(null)
            }
          }
          
          return (
            <div key={`${desafio.id}-${etapa.id}`} className="absolute">
              {/* Bloco da torre - agora retangular com conteúdo */}
              <div
                className={`w-80 h-20 rounded-xl border-4 ${colorClass} 
                  flex items-center justify-start 
                  transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  ${status === 'current' ? 'ring-4 ring-blue-300 ring-opacity-60' : ''}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  backdrop-blur-sm relative z-10
                `}
                style={{
                  left: `${position.x + 150}px`,
                  bottom: `${position.y}px`,
                  transform: 'translateX(-50%)'
                }}
                title={`${desafio.titulo} - ${etapa.titulo}`}
                onMouseEnter={() => setHoveredStepIndex(index)}
                onMouseLeave={() => setHoveredStepIndex(null)}
                onClick={handleStepClick}
              >
                <div className="text-left p-3 w-full">
                  <div className="text-xs text-white/70 mb-1 font-medium">
                    {desafio.titulo}
                  </div>
                  <div className="text-sm text-white font-bold mb-1 leading-tight">
                    {etapa.titulo}
                  </div>
                  <div className="text-xs text-white/80 leading-tight line-clamp-1">
                    {etapa.descricao}
                  </div>
                </div>
              </div>
              
              {/* Conectores entre níveis */}
              {index < etapas.length - 1 && (
                <div
                  className={`absolute ${getConnectorStyle(index)} z-0`}
                  style={{
                    left: `${position.x + 150}px`,
                    bottom: `${position.y + 80}px`, // Conecta ao bloco de cima (altura do bloco = 80px)
                    height: '20px', // conecta ao próximo bloco
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
              left: `${getGridPosition(currentStepIndex).x + 110}px`, // Ajustado para ficar à direita do bloco
              bottom: `${getGridPosition(currentStepIndex).y + 15}px`,
              transform: 'translateX(-50%)'
            }}
          >
            👤
          </div>
        )}

        {/* Botão de continuar - apenas para a etapa atual */}
        {currentStepIndex < etapas.length && (
          <button
            onClick={completeCurrentStep}
            className="absolute bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg 
              transition-colors duration-200 shadow-lg hover:shadow-green-500/30
              disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold z-20 whitespace-nowrap"
            style={{
              left: `${getGridPosition(currentStepIndex).x + 560}px`, // Posicionado à direita do avatar
              bottom: `${getGridPosition(currentStepIndex).y + 20}px`,
              transform: 'translateX(-50%)'
            }}
            title="Concluir Etapa"
          >
            ✓ Concluir
          </button>
        )}
      </div>
    </div>
  )
} 