'use client'

import { useEffect, useState } from 'react'
import useProgressStore from '@/lib/store'
import { getAllEtapas } from '@/lib/data'
import TowerCanvas from '@/components/TowerCanvas'
import DetailPane from '@/components/DetailPane'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { 
    currentStepIndex, 
    completedSteps,
    completeCurrentStep,
    reset,
    getCurrentStep,
    getCompletionPercentage,
    getTotalSteps
  } = useProgressStore()

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Carregando torre...</div>
      </div>
    )
  }

  const allEtapas = getAllEtapas()
  const currentStep = getCurrentStep()
  const currentEtapa = currentStep ? allEtapas.find(
    item => item.desafio.id === currentStep.desafioId && item.etapa.id === currentStep.etapaId
  ) || null : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Torre Canvas */}
      <div className="order-2 lg:order-1">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Torre de Desafios</h2>
            <div className="text-sm text-slate-300">
              {getCompletionPercentage()}% completo ({completedSteps.size}/{getTotalSteps()})
            </div>
          </div>
          
          <TowerCanvas 
            etapas={allEtapas}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
          />
          
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              onClick={completeCurrentStep}
              disabled={!currentEtapa}
              size="lg"
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Completar Etapa
            </Button>
            <Button
              onClick={reset}
              variant="destructive"
              size="lg"
            >
              Reiniciar
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Pane */}
      <div className="order-1 lg:order-2">
        <DetailPane 
          currentEtapa={currentEtapa}
        />
      </div>
    </div>
  )
}
