# Plano de Implementação – IA Master Lab Tower

## Objetivo

Criar uma aplicação NextJS que visualiza o progresso de um aluno no workshop **IA Master Lab** através de uma "torre de desafios" interativa. A torre, inspirada em Mortal Kombat, mostrará cada desafio e suas etapas como blocos. O aluno poderá avançar na torre, visualizar o conteúdo de cada etapa (em Markdown) e ter seu progresso salvo localmente.

## 1. Arquitetura Adotada
- **NextJS 13+ App Router** (Client Components only).
- Aplicação **CSR** (nenhuma necessidade de SSR).
- Renderização gráfica da torre via **two.js** (SVG/Canvas), importado dinamicamente.
- Estado global em **Zustand** com persistência automática em `localStorage`.
- Conteúdo dinâmico:
  - Estrutura JSON `data/desafios.json` para metadados dos desafios e etapas.
  - Arquivos Markdown `content/desafios/{desafioId}/{etapaId}.md` para o guia de cada etapa.
- Sanitização de Markdown com **rehype-sanitize**.
- Estilização usando **Tailwind CSS**.

## 2. Tecnologias Principais
| Propósito               | Tecnologia             |
| ----------------------- | ---------------------- |
| Framework / Router      | NextJS 13+ App Router  |
| Linguagem               | TypeScript             |
| Canvas/SVG              | two.js                 |
| Estado global           | Zustand (com persist)  |
| Markdown Renderer       | react-markdown + remark-gfm + rehype-sanitize |
| CSS Utility             | Tailwind CSS           |
| Qualidade de Código     | ESLint + Prettier      |
| Testes                  | Jest + React Testing Library |

## 3. Estrutura de Diretórios
```
/app
  layout.tsx
  page.tsx
/components
  TowerCanvas.tsx
  StageBlock.tsx
  PlayerAvatar.tsx
  DetailPane.tsx
/content/desafios/{id}/{etapa}.md
/data/desafios.json
/lib
  data.ts
  store.ts
  markdown.ts
/public
  (sprites, imagens)
```

## 4. Componentes Principais
- **TowerCanvas**: desenha torre em via two.js; recebe lista de desafios & progresso.
- **StageBlock**: bloco individual colorido, clicável.
- **PlayerAvatar**: sprite animado posicionado ao lado do bloco atual.
- **useProgressStore**: Zustand store (`progresso`, `nextStep`, `reset`).
- **DetailPane**: carrega e renderiza markdown da etapa atual.

## 5. Roadmap de Implementação
1. Bootstrap do projeto (`create-next-app`) + dependências.
2. Data layer (`data/desafios.json`, `lib/data.ts`).
3. State layer persistente (`lib/store.ts`).
4. UI Skeleton (`/app/layout.tsx`, `/app/page.tsx`).
5. Renderização da torre (`TowerCanvas`).
6. Interatividade & animações (PlayerAvatar, nextStep).
7. DetailPane com Markdown.
8. Styling & responsividade.
9. Testes, lint, hardening.
10. Deploy.

## 6. Critérios de Sucesso
- Progresso persiste após refresh.
- 100 % testes unitários passando.
- Sem vulnerabilidades XSS no render de markdown.
- Animação de conclusão ≤ 500 ms e carregamento correto do conteúdo.

## 7. Confiança
**93 %** – Pronto para execução. 