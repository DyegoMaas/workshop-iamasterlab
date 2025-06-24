'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { type Desafio, type Etapa } from '@/lib/data'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import useProgressStore from '@/lib/store'
import { useAuth } from '@/lib/useAuth'

interface DetailPaneProps {
  currentEtapa: { desafio: Desafio; etapa: Etapa } | null
}

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Componentes memoizados para ReactMarkdown - definidos fora do render
const instructorMarkdownComponents = {
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="text-xl font-bold mb-3" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="text-lg font-semibold mb-2 mt-4" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="text-base font-medium mb-2 mt-3" {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="mb-3 leading-relaxed" {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
  li: (props: React.ComponentProps<'li'>) => <li {...props} />,
  code: (props: React.ComponentProps<'code'>) => <code className="bg-amber-900/20 px-2 py-1 rounded text-amber-200 text-sm" {...props} />,
  pre: (props: React.ComponentProps<'pre'>) => <pre className="bg-amber-900/20 p-4 rounded-lg overflow-x-auto mb-3" {...props} />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => <blockquote className="border-l-4 border-amber-400 pl-4 italic text-amber-200 mb-3" {...props} />,
  a: (props: React.ComponentProps<'a'>) => <a className="text-amber-300 underline decoration-2 underline-offset-2 hover:text-amber-200 hover:decoration-amber-200 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  hr: (props: React.ComponentProps<'hr'>) => <hr className="border-amber-500/30 my-4" {...props} />
}

const mainMarkdownComponents = {
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="text-2xl font-bold mb-4" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="text-xl font-semibold mb-3 mt-6" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="text-lg font-medium mb-2 mt-4" {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
  li: (props: React.ComponentProps<'li'>) => <li {...props} />,
  code: (props: React.ComponentProps<'code'>) => <code className="bg-muted px-2 py-1 rounded text-primary text-sm" {...props} />,
  pre: (props: React.ComponentProps<'pre'>) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4" {...props} />,
  a: (props: React.ComponentProps<'a'>) => <a className="text-primary underline decoration-2 underline-offset-2 hover:text-primary/80 hover:decoration-primary/80 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  hr: (props: React.ComponentProps<'hr'>) => <hr className="border-border my-6" {...props} />
}

export default function DetailPane({ currentEtapa }: DetailPaneProps) {
  const { isInstructor } = useAuth()
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [instructorContent, setInstructorContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  // Memoizar o valor de isInstructor usando apenas a dependência necessária
  const isInstructorMemo = useMemo(() => isInstructor(), [isInstructor])
  
  // Estado local para as respostas (para evitar re-render a cada tecla)
  const [localResponses, setLocalResponses] = useState<Record<string, string>>({})
  
  // Calcular stepId de forma estável usando useMemo
  const stepId = useMemo(() => {
    if (!currentEtapa) return ''
    return `${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
  }, [currentEtapa])

  // Seletor otimizado - só re-renderiza se os itens checados desta etapa específica mudarem
  const currentStepCheckedItems = useProgressStore(
    useCallback(
      (state) => stepId ? state.checklistProgress[stepId] : undefined,
      [stepId]
    )
  )
  
  // Função de toggle - não causa re-render pois não está sendo subscrita
  const toggleChecklistItemStore = useProgressStore(state => state.toggleChecklistItem)

  // Funções auxiliares otimizadas
  const handleToggleChecklistItem = useCallback((itemId: string) => {
    if (stepId) toggleChecklistItemStore(stepId, itemId)
  }, [stepId, toggleChecklistItemStore])

  const isChecklistItemChecked = useCallback((itemId: string) => {
    return currentStepCheckedItems?.has(itemId) || false
  }, [currentStepCheckedItems])

  // Inicializar respostas locais quando a etapa muda
  useEffect(() => {
    if (stepId && currentEtapa?.etapa.perguntas) {
      const store = useProgressStore.getState()
      const initialResponses: Record<string, string> = {}
      currentEtapa.etapa.perguntas.forEach(pergunta => {
        initialResponses[pergunta.id] = store.getQuestionResponse(stepId, pergunta.id) || ''
      })
      setLocalResponses(initialResponses)
    } else {
      setLocalResponses({})
    }
  }, [stepId, currentEtapa?.etapa.perguntas])

  // Debounce das respostas locais para salvar no store
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedResponses = useDebounce(localResponses, 500)

  // Usar useRef para rastrear o último estado salvo e evitar salvamentos desnecessários
  const lastSavedResponses = useRef<Record<string, string>>({})

  // Efeito para salvar no store quando as respostas com debounce mudarem
  useEffect(() => {
    if (stepId && Object.keys(debouncedResponses).length > 0) {
      const store = useProgressStore.getState()
      
      Object.entries(debouncedResponses).forEach(([questionId, response]) => {
        const lastSaved = lastSavedResponses.current[questionId]
        if (lastSaved !== response) {
          const currentStored = store.getQuestionResponse(stepId, questionId)
          if (currentStored !== response) {
            store.saveQuestionResponse(stepId, questionId, response)
          }
          lastSavedResponses.current[questionId] = response
        }
      })
    }
  }, [stepId, debouncedResponses])

  const handleQuestionResponseChange = useCallback((questionId: string, response: string) => {
    setLocalResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }, [])



  useEffect(() => {
    if (!currentEtapa) {
      setMarkdownContent('')
      setInstructorContent('')
      return
    }

    // AbortController para cancelar requisições anteriores
    const abortController = new AbortController()

    const loadMarkdown = async () => {
      setLoading(true)
      try {
        // Tentar carregar conteúdo do instrutor primeiro - apenas se for instrutor
        // Usar valor memoizado para evitar problemas de dependência
        if (isInstructorMemo) {
          const instructorResponse = await fetch(
            `/content/desafios/${currentEtapa.desafio.id}/${currentEtapa.etapa.id}_instrutor.md`,
            { signal: abortController.signal }
          )
          
          // Verificar se a requisição foi cancelada
          if (abortController.signal.aborted) {
            return
          }
          
          if (instructorResponse.ok) {
            const instructorText = await instructorResponse.text()
            setInstructorContent(instructorText)
          } else {
            setInstructorContent('')
          }
        } else {
          setInstructorContent('')
        }

        // Tentar carregar markdown da etapa com signal para cancelamento
        const response = await fetch(
          `/content/desafios/${currentEtapa.desafio.id}/${currentEtapa.etapa.id}.md`,
          { signal: abortController.signal }
        )
        
        // Verificar se a requisição foi cancelada
        if (abortController.signal.aborted) {
          return
        }
        
        if (response.ok) {
          const content = await response.text()
          setMarkdownContent(content)
        } else {
          // Fallback: conteúdo padrão se arquivo não existir
          setMarkdownContent(generateDefaultContent(currentEtapa))
        }
      } catch (error) {
        // Ignorar erros de abort
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Erro ao carregar markdown:', error)
        setMarkdownContent(generateDefaultContent(currentEtapa))
        setInstructorContent('')
      } finally {
        // Só atualizar loading se não foi cancelado
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMarkdown()

    // Cleanup: cancelar requisição se o componente for desmontado ou currentEtapa mudar
    return () => {
      abortController.abort()
    }
  }, [currentEtapa, isInstructorMemo]) // Adicionado isInstructorMemo como dependência

  const generateDefaultContent = (etapa: { desafio: Desafio; etapa: Etapa }) => {
    return `# ${etapa.etapa.titulo}

## Desafio: ${etapa.desafio.titulo}

${etapa.etapa.descricao}

### Informações da Etapa

- **Tipo:** ${etapa.etapa.tipo === 'teoria' ? 'Teórica' : etapa.etapa.tipo === 'pratica' ? 'Prática' : etapa.etapa.tipo === 'projeto' ? 'Projeto' : etapa.etapa.tipo === 'discussao' ? 'Discussão' : etapa.etapa.tipo === 'atividade-guiada' ? 'Atividade Guiada' : 'Outro'}
- **Tempo Estimado:** ${etapa.etapa.tempoEstimado} minutos
- **Ordem:** ${etapa.etapa.ordem}

### Objetivos

Nesta etapa você irá:

1. Compreender os conceitos fundamentais
2. Aplicar o conhecimento na prática
3. Consolidar o aprendizado

### Próximos Passos

Complete esta etapa para avançar na torre de desafios!

---

*Conteúdo gerado automaticamente. Para personalizar, crie o arquivo markdown correspondente.*`
  }

  if (!currentEtapa) {
    return (
      <Card className="backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">🏰</div>
          <CardTitle className="text-xl mb-2">Bem-vindo à Torre!</CardTitle>
          <p className="text-muted-foreground">Selecione uma etapa para começar sua jornada no IA Master Lab.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="backdrop-blur-sm">
      {/* Header da etapa */}
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-2xl">
            {currentEtapa.desafio.titulo} - {currentEtapa.etapa.titulo}
          </CardTitle>         
        </div>
      </CardHeader>

      {/* Conteúdo markdown */}
      <CardContent>
        <div className="prose prose-invert prose-slate max-w-none">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <span className="ml-3 text-muted-foreground">Carregando conteúdo...</span>
            </div>
          ) : (
            <div className="text-foreground">
              {/* Bloco do Instrutor - se existir e usuário for instrutor */}
              {instructorContent && isInstructorMemo && (
                <div className="mb-8 p-6 border-2 border-amber-500/30 bg-amber-500/5 rounded-lg">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-400">Orientações do Instrutor</h3>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={instructorMarkdownComponents}
                  >
                    {instructorContent}
                  </ReactMarkdown>
                </div>
              )}

              {/* Conteúdo principal */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={mainMarkdownComponents}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </CardContent>

      {/* Checklist */}
      {currentEtapa.etapa.checklist && currentEtapa.etapa.checklist.length > 0 && (
        <>
          <hr className="border-border my-6" />
          <CardContent>
            <CardTitle className="text-xl mb-4">✅ Checklist</CardTitle>
            <div className="space-y-4">
              {currentEtapa.etapa.checklist
                .sort((a, b) => a.ordem - b.ordem)
                .map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`checklist-${item.id}`}
                      checked={isChecklistItemChecked(item.id)}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`checklist-${item.id}`}
                        className={`block text-sm font-medium cursor-pointer ${
                          isChecklistItemChecked(item.id) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.titulo}
                      </label>
                      {item.descricao && (
                        <p className={`text-sm mt-1 ${
                          isChecklistItemChecked(item.id) ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {item.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Progresso salvo automaticamente no store global */}
            <div className="flex justify-end mt-6">
              <p className="text-sm text-muted-foreground">
                ✓ Progresso salvo automaticamente
              </p>
            </div>
          </CardContent>
        </>
      )}

      {/* Questionário */}
      {currentEtapa.etapa.perguntas && currentEtapa.etapa.perguntas.length > 0 && (
        <>
          <hr className="border-border my-6" />
          <CardContent>
            <CardTitle className="text-xl mb-4">📋 Documente sua Jornada</CardTitle>
            <div className="space-y-6">
              {currentEtapa.etapa.perguntas
                .sort((a, b) => a.ordem - b.ordem)
                .map((pergunta) => (
                  <div key={pergunta.id} className="space-y-2">
                    <label className="block text-sm font-medium">
                      {pergunta.titulo}
                    </label>
                    {pergunta.descricao && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {pergunta.descricao}
                      </p>
                    )}
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-border rounded-md bg-background text-foreground resize-y"
                      placeholder="Digite sua resposta aqui..."
                      value={localResponses[pergunta.id] || ''}
                      onChange={(e) => handleQuestionResponseChange(pergunta.id, e.target.value)}
                    />
                  </div>
                ))}
            </div>
            
            {/* Progresso salvo automaticamente */}
            <div className="flex justify-end mt-6">
              <p className="text-sm text-muted-foreground">
                ✓ Progresso salvo automaticamente
              </p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
} 