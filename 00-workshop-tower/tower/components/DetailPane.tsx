'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { type Desafio, type Etapa } from '@/lib/data'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useProgressStore from '@/lib/store'

interface DetailPaneProps {
  currentEtapa: { desafio: Desafio; etapa: Etapa } | null
}

export default function DetailPane({ currentEtapa }: DetailPaneProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [salvandoRespostas, setSalvandoRespostas] = useState(false)
  const [respostasSalvas, setRespostasSalvas] = useState(false)
  
  // Usar o store global para checklist e respostas
  const { 
    checklistProgress, 
    toggleChecklistItem: toggleChecklistItemStore,
    saveQuestionResponse,
    getQuestionResponse,
    getQuestionResponsesForStep
  } = useProgressStore()

  // Funções auxiliares para usar o store global
  const getCurrentStepId = () => {
    if (!currentEtapa) return ''
    return `${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
  }

  const handleToggleChecklistItem = (itemId: string) => {
    const stepId = getCurrentStepId()
    if (stepId) toggleChecklistItemStore(stepId, itemId)
  }

  const isChecklistItemChecked = (itemId: string) => {
    const stepId = getCurrentStepId()
    return checklistProgress[stepId]?.has(itemId) || false
  }

  const handleSaveQuestionResponse = (questionId: string, response: string) => {
    const stepId = getCurrentStepId()
    if (stepId) saveQuestionResponse(stepId, questionId, response)
  }

  const getQuestionResponseValue = (questionId: string) => {
    const stepId = getCurrentStepId()
    return stepId ? getQuestionResponse(stepId, questionId) : ''
  }

  useEffect(() => {
    if (!currentEtapa) {
      setMarkdownContent('')
      return
    }

    // AbortController para cancelar requisições anteriores
    const abortController = new AbortController()

    const loadMarkdown = async () => {
      setLoading(true)
      try {
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
  }, [currentEtapa])

  const generateDefaultContent = (etapa: { desafio: Desafio; etapa: Etapa }) => {
    return `# ${etapa.etapa.titulo}

## Desafio: ${etapa.desafio.titulo}

${etapa.etapa.descricao}

### Informações da Etapa

- **Tipo:** ${etapa.etapa.tipo === 'teoria' ? 'Teórica' : etapa.etapa.tipo === 'pratica' ? 'Prática' : 'Projeto'}
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li>{children}</li>,
                  code: ({ children }) => <code className="bg-muted px-2 py-1 rounded text-primary text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
                  a: ({ href, children }) => <a href={href} className="text-primary underline decoration-2 underline-offset-2 hover:text-primary/80 hover:decoration-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                  hr: () => <hr className="border-border my-6" />
                }}
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
                      value={getQuestionResponseValue(pergunta.id) || ''}
                      onChange={(e) => handleSaveQuestionResponse(pergunta.id, e.target.value)}
                    />
                  </div>
                ))}
            </div>
            
            {/* Botão de Salvar */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => {
                  setSalvandoRespostas(true)
                  setTimeout(() => {
                    setSalvandoRespostas(false)
                    setRespostasSalvas(true)
                    setTimeout(() => {
                      setRespostasSalvas(false)
                    }, 2000)
                  }, 300)
                }}
                disabled={salvandoRespostas}
                className="min-w-[120px]"
              >
                {salvandoRespostas ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Salvando...
                  </>
                ) : respostasSalvas ? (
                  <>
                    <span className="mr-2">✓</span>
                    Salvo!
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
} 