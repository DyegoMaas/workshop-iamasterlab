'use client'

import { useEffect, useState } from 'react'
import useProgressStore from '@/lib/store'
import { getAllEtapas } from '@/lib/data'
import TowerCanvas from '@/components/TowerCanvas'
import DetailPane from '@/components/DetailPane'
import AuthDialog from '@/components/AuthDialog'
import { useAuth } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  
  const { 
    currentStepIndex, 
    completedSteps,
    completeCurrentStep,
    reset,
    getCurrentStep,
    getCompletionPercentage,
    getTotalSteps
  } = useProgressStore()

  const { isAuthenticated, isLoading: authLoading, authenticate } = useAuth()

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Carregando torre...</div>
      </div>
    )
  }

  // Mostrar dialog de autenticação se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Aguardando autenticação...</div>
        </div>
        <AuthDialog 
          isOpen={!isAuthenticated}
          onAuthenticated={authenticate}
        />
      </>
    )
  }

  const allEtapas = getAllEtapas()
  const currentStep = getCurrentStep()
  const currentEtapa = currentStep ? allEtapas.find(
    item => item.desafio.id === currentStep.desafioId && item.etapa.id === currentStep.etapaId
  ) || null : null

  // Determinar qual etapa mostrar no DetailPane (selecionada tem prioridade sobre a atual)
  const displayEtapa = selectedStepIndex !== null && selectedStepIndex < allEtapas.length
    ? allEtapas[selectedStepIndex]
    : currentEtapa

  const handleStepSelect = (index: number | null) => {
    setSelectedStepIndex(index)
  }

  const handleReset = () => {
    setSelectedStepIndex(null)
    reset()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Torre Canvas */}
      <div className="order-2 lg:order-1">
        <Card className="backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Torre de Desafios</CardTitle>
              <div className="text-sm text-muted-foreground">
                {getCompletionPercentage()}% completo ({completedSteps.size}/{getTotalSteps()})
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <TowerCanvas 
              etapas={allEtapas}
              currentStepIndex={currentStepIndex}
              completedSteps={completedSteps}
              completeCurrentStep={completeCurrentStep}
              onStepSelect={handleStepSelect}
              selectedStepIndex={selectedStepIndex}
            />
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleReset}
              variant="destructive"
              size="lg"
            >
              Reiniciar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Detail Pane */}
      <div className="order-1 lg:order-2">
        <DetailPane 
          currentEtapa={displayEtapa}
        />
      </div>
    </div>
  )
}
