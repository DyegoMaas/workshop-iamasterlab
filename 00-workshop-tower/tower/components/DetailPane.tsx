'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { type Desafio, type Etapa } from '@/lib/data'

interface DetailPaneProps {
  currentEtapa: { desafio: Desafio; etapa: Etapa } | null
}

export default function DetailPane({ currentEtapa }: DetailPaneProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentEtapa) {
      setMarkdownContent('')
      return
    }

    const loadMarkdown = async () => {
      setLoading(true)
      try {
        // Tentar carregar markdown da etapa
        const response = await fetch(`/content/desafios/${currentEtapa.desafio.id}/${currentEtapa.etapa.id}.md`)
        
        if (response.ok) {
          const content = await response.text()
          setMarkdownContent(content)
        } else {
          // Fallback: conteúdo padrão se arquivo não existir
          setMarkdownContent(generateDefaultContent(currentEtapa))
        }
      } catch (error) {
        console.error('Erro ao carregar markdown:', error)
        setMarkdownContent(generateDefaultContent(currentEtapa))
      } finally {
        setLoading(false)
      }
    }

    loadMarkdown()
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

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'teoria': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pratica': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'projeto': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  if (!currentEtapa) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
        <div className="text-center text-slate-400 py-12">
          <div className="text-6xl mb-4">🏰</div>
          <h3 className="text-xl font-semibold mb-2">Bem-vindo à Torre!</h3>
          <p>Selecione uma etapa para começar sua jornada no IA Master Lab.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
      {/* Header da etapa */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-white">
            {currentEtapa.etapa.titulo}
          </h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(currentEtapa.etapa.tipo)}`}>
            {getTypeIcon(currentEtapa.etapa.tipo)} {currentEtapa.etapa.tipo}
          </div>
        </div>
        
        <div className="text-slate-300 text-sm mb-2">
          <strong>Desafio:</strong> {currentEtapa.desafio.titulo}
        </div>
        
        <div className="flex items-center space-x-4 text-slate-400 text-sm">
          <span>⏱️ {currentEtapa.etapa.tempoEstimado} min</span>
          <span>📍 Etapa {currentEtapa.etapa.ordem}</span>
        </div>
      </div>

      {/* Conteúdo markdown */}
      <div className="prose prose-invert prose-slate max-w-none">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-slate-300">Carregando conteúdo...</span>
          </div>
        ) : (
          <div className="text-slate-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 mt-6">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>,
                p: ({ children }) => <p className="text-slate-200 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside text-slate-200 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-slate-200 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-slate-200">{children}</li>,
                code: ({ children }) => <code className="bg-slate-700 px-2 py-1 rounded text-blue-300 text-sm">{children}</code>,
                pre: ({ children }) => <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-300 mb-4">{children}</blockquote>,
                hr: () => <hr className="border-slate-600 my-6" />
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
} 