'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { type Desafio, type Etapa } from '@/lib/data'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DetailPaneProps {
  currentEtapa: { desafio: Desafio; etapa: Etapa } | null
}

interface Respostas {
  [perguntaId: string]: string
}

export default function DetailPane({ currentEtapa }: DetailPaneProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [respostas, setRespostas] = useState<Respostas>({})
  const [salvandoRespostas, setSalvandoRespostas] = useState(false)
  const [respostasSalvas, setRespostasSalvas] = useState(false)

  // Carregar respostas do localStorage quando a etapa mudar
  useEffect(() => {
    if (currentEtapa?.etapa.perguntas) {
      const chaveStorage = `respostas-${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
      const respostasSalvas = localStorage.getItem(chaveStorage)
      if (respostasSalvas) {
        try {
          setRespostas(JSON.parse(respostasSalvas))
        } catch (error) {
          console.error('Erro ao carregar respostas do localStorage:', error)
          setRespostas({})
        }
      } else {
        setRespostas({})
      }
    }
  }, [currentEtapa])

  // Salvar resposta no localStorage
  const salvarResposta = (perguntaId: string, resposta: string) => {
    if (!currentEtapa) return

    const novasRespostas = { ...respostas, [perguntaId]: resposta }
    setRespostas(novasRespostas)

    const chaveStorage = `respostas-${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
    localStorage.setItem(chaveStorage, JSON.stringify(novasRespostas))
  }

  // Salvar respostas manualmente (para o botão)
  const salvarRespostasManual = () => {
    if (!currentEtapa) return

    setSalvandoRespostas(true)
    
    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      const chaveStorage = `respostas-${currentEtapa.desafio.id}-${currentEtapa.etapa.id}`
      localStorage.setItem(chaveStorage, JSON.stringify(respostas))
      
      setSalvandoRespostas(false)
      setRespostasSalvas(true)
      
      // Remover feedback após 2 segundos
      setTimeout(() => {
        setRespostasSalvas(false)
      }, 2000)
    }, 300)
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
                      value={respostas[pergunta.id] || ''}
                      onChange={(e) => salvarResposta(pergunta.id, e.target.value)}
                    />
                  </div>
                ))}
            </div>
            
            {/* Botão de Salvar */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={salvarRespostasManual}
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