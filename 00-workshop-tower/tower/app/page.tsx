'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
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

  // Seletores otimizados para evitar re-renders desnecessários
  const currentStepIndex = useProgressStore(state => state.currentStepIndex)
  const completedSteps = useProgressStore(state => state.completedSteps)
  const completeCurrentStep = useProgressStore(state => state.completeCurrentStep)
  const reset = useProgressStore(state => state.reset)
  const getCompletionPercentage = useProgressStore(state => state.getCompletionPercentage)
  const getTotalSteps = useProgressStore(state => state.getTotalSteps)
  const checklistProgress = useProgressStore(state => state.checklistProgress)

  const { isAuthenticated, isLoading: authLoading, teamName, authenticate } = useAuth()

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const allEtapas = useMemo(() => getAllEtapas(), [])

  const currentEtapa = useMemo(() => {
    const storeState = useProgressStore.getState()
    const currentStep = storeState.getCurrentStep()
    return currentStep ? allEtapas.find(
      item => item.desafio.id === currentStep.desafioId && item.etapa.id === currentStep.etapaId
    ) || null : null
  }, [allEtapas])

  // Preparar dados de progresso do checklist para o TowerCanvas - memorizado
  const checklistProgressData = useMemo(() => {
    const data: Record<string, { completed: number; total: number }> = {}
    allEtapas.forEach(({ desafio, etapa }) => {
      const stepId = `${desafio.id}-${etapa.id}`
      const stepChecklist = checklistProgress[stepId]
      if (etapa.checklist && etapa.checklist.length > 0) {
        data[stepId] = {
          completed: stepChecklist?.size || 0,
          total: etapa.checklist.length
        }
      }
    })
    return data
  }, [allEtapas, checklistProgress])

  const handleStepSelect = useCallback((index: number | null) => {
    setSelectedStepIndex(index)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedStepIndex(null)
    reset()
  }, [reset])

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
          onAuthenticated={(teamName: string) => authenticate(teamName)}
        />
      </>
    )
  }

  // Determinar qual etapa mostrar no DetailPane (selecionada tem prioridade sobre a atual)
  const displayEtapa = selectedStepIndex !== null && selectedStepIndex < allEtapas.length
    ? allEtapas[selectedStepIndex]
    : currentEtapa

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
              teamName={teamName}
              checklistProgress={checklistProgressData}
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
