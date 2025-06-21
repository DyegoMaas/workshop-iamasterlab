'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getAllEtapas } from './data'

export interface ProgressState {
  // Progresso atual - índice da etapa atual na lista de todas as etapas
  currentStepIndex: number
  
  // Etapas completadas (por ID único: desafioId-etapaId)
  completedSteps: Set<string>
  
  // Ações
  nextStep: () => void
  completeCurrentStep: () => void
  reset: () => void
  goToStep: (index: number) => void
  
  // Getters
  getCurrentStep: () => { desafioId: string; etapaId: string } | null
  isStepCompleted: (desafioId: string, etapaId: string) => boolean
  getTotalSteps: () => number
  getCompletionPercentage: () => number
}

const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      completedSteps: new Set<string>(),
      
      nextStep: () => {
        const allEtapas = getAllEtapas()
        const currentIndex = get().currentStepIndex
        
        if (currentIndex < allEtapas.length - 1) {
          set({ currentStepIndex: currentIndex + 1 })
        }
      },
      
      completeCurrentStep: () => {
        const allEtapas = getAllEtapas()
        const currentIndex = get().currentStepIndex
        const currentEtapa = allEtapas[currentIndex]
        
        if (currentEtapa) {
          const stepId = `${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
          const newCompleted = new Set(get().completedSteps)
          newCompleted.add(stepId)
          
          set({ 
            completedSteps: newCompleted,
            currentStepIndex: Math.min(currentIndex + 1, allEtapas.length - 1)
          })
        }
      },
      
      reset: () => {
        set({
          currentStepIndex: 0,
          completedSteps: new Set<string>()
        })
      },
      
      goToStep: (index: number) => {
        const allEtapas = getAllEtapas()
        if (index >= 0 && index < allEtapas.length) {
          set({ currentStepIndex: index })
        }
      },
      
      getCurrentStep: () => {
        const allEtapas = getAllEtapas()
        const currentIndex = get().currentStepIndex
        const currentEtapa = allEtapas[currentIndex]
        
        if (currentEtapa) {
          return {
            desafioId: currentEtapa.desafio.id,
            etapaId: currentEtapa.etapa.id
          }
        }
        return null
      },
      
      isStepCompleted: (desafioId: string, etapaId: string) => {
        const stepId = `${desafioId}-${etapaId}`
        return get().completedSteps.has(stepId)
      },
      
      getTotalSteps: () => {
        return getAllEtapas().length
      },
      
      getCompletionPercentage: () => {
        const total = getAllEtapas().length
        const completed = get().completedSteps.size
        return total > 0 ? Math.round((completed / total) * 100) : 0
      }
    }),
    {
      name: 'tower-progress',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        completedSteps: Array.from(state.completedSteps)
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as unknown as { completedSteps: string[] }).completedSteps)) {
          state.completedSteps = new Set((state as unknown as { completedSteps: string[] }).completedSteps)
        }
      }
    }
  )
)

export default useProgressStore 