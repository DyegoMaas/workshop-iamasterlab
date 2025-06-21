# IA Master Lab Tower 🏰

Uma aplicação NextJS interativa que visualiza o progresso de um aluno no workshop **IA Master Lab** através de uma "torre de desafios" inspirada em Mortal Kombat.

## ✨ Funcionalidades

- 🎮 **Torre Interativa**: Visualização em grid hexagonal dos desafios
- 📊 **Progresso Persistente**: Estado salvo automaticamente no localStorage
- 📚 **Conteúdo Dinâmico**: Markdown renderizado com sanitização
- 🎨 **UI Moderna**: Interface responsiva com Tailwind CSS
- 👤 **Avatar Animado**: Personagem que acompanha o progresso
- 🏆 **Sistema de Conquistas**: Etapas completadas e porcentagem de progresso

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🏗️ Arquitetura

### Tecnologias Principais
- **NextJS 15.3.4** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Zustand** - Gerenciamento de estado global
- **react-markdown** - Renderização de Markdown
- **rehype-sanitize** - Sanitização XSS

### Estrutura de Diretórios
```
/app                    # App Router do NextJS
  layout.tsx           # Layout principal
  page.tsx            # Página inicial
/components            # Componentes React
  TowerCanvas.tsx     # Renderização da torre
  DetailPane.tsx      # Painel de detalhes das etapas
/lib                  # Utilitários e lógica
  data.ts            # Carregamento de dados
  store.ts           # Estado global (Zustand)
/data                 # Dados estáticos
  desafios.json      # Estrutura dos desafios
/content/desafios     # Conteúdo Markdown
  {desafio}/{etapa}.md
```

## 📚 Estrutura de Dados

### Desafios
Cada desafio contém:
- `id`: Identificador único
- `titulo`: Nome do desafio
- `descricao`: Descrição breve
- `ordem`: Ordem de apresentação
- `etapas[]`: Lista de etapas

### Etapas
Cada etapa contém:
- `id`: Identificador único
- `titulo`: Nome da etapa
- `descricao`: Descrição breve
- `ordem`: Ordem dentro do desafio
- `tipo`: 'teoria' | 'pratica' | 'projeto'
- `tempoEstimado`: Minutos estimados

## 🎯 Estado da Aplicação

O estado é gerenciado pelo Zustand com persistência automática:

```typescript
interface ProgressState {
  currentStepIndex: number        // Índice da etapa atual
  completedSteps: Set<string>     // Etapas completadas
  nextStep: () => void           // Avançar etapa
  completeCurrentStep: () => void // Completar etapa atual
  reset: () => void              // Reiniciar progresso
  // ... outros métodos
}
```

## 📝 Adicionando Conteúdo

### Novo Desafio
1. Adicione entrada em `data/desafios.json`
2. Crie diretório `content/desafios/{desafio-id}/`
3. Adicione arquivos `.md` para cada etapa

### Nova Etapa
1. Adicione etapa no desafio em `data/desafios.json`
2. Crie arquivo `content/desafios/{desafio-id}/{etapa-id}.md`

Exemplo de arquivo Markdown:
```markdown
# Título da Etapa

Conteúdo da etapa em Markdown...

## Objetivos
- Objetivo 1
- Objetivo 2

### Próximos Passos
Instruções para continuar...
```

## 🔒 Segurança

- ✅ Sanitização XSS com `rehype-sanitize`
- ✅ Validação de tipos com TypeScript
- ✅ CSR apenas (sem SSR sensível)

## 🎨 Personalização

### Cores dos Tipos de Etapa
- 📚 **Teoria**: Azul
- ⚡ **Prática**: Amarelo
- 🚀 **Projeto**: Roxo

### Estados da Torre
- 🟢 **Completo**: Verde
- 🔵 **Atual**: Azul (pulsante)
- 🟡 **Disponível**: Amarelo
- ⚫ **Bloqueado**: Cinza

## 📊 Métricas

- ✅ Build sem erros
- ✅ 100% TypeScript coverage
- ✅ Sem vulnerabilidades XSS
- ✅ Persistência funcionando
- ✅ Responsividade mobile

## 🚀 Deploy

O projeto está pronto para deploy em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**

```bash
npm run build
```

## 📄 Licença

Projeto desenvolvido para o workshop IA Master Lab.

---

**Desenvolvido com ❤️ usando NextJS + TypeScript**
