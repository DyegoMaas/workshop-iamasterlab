**Fase 1 – Análise de Requisitos**

**Achados / entregáveis**
1. Requisitos Funcionais Explícitos
   - Carregar `desafios.json` na inicialização e gerar visual da torre.
   - Renderizar torre em grid hexagonal (canvas/SVG) usando **two.js**.
   - Mostrar bloco/personagem do usuário ao lado do bloco (etapa) corrente na torre.
   - Botão "concluir desafio" anima o personagem para o próximo bloco acima e carrega detalhes do desafio/etapa.
   - Roteamento NextJS: `/desafio/:id` abre "Guia do desafio" com markdown via **react-markdown**.
   - Guia do desafio inclui descrição, lista de etapas, recursos adicionais.
   - Mock inicial usa `desafios.json` de exemplo + tutoriais fictícios (lorem ipsum).

2. Requisitos Funcionais Implícitos
   - Definir estado atual do progresso do usuário; provavelmente persistido (e.g., localStorage) para manter posição após refresh.
   - Conversão de campo `etapas` no JSON para quantidade de blocos/etapas por desafio.
   - Final Boss representado como estágio extra no topo da torre.
   - Ordem dos desafios: renderizar de baixo para cima (1 → N, onde N é o Final Boss).
   - Clique em bloco da torre deve também navegar para `/desafio/:id` correspondente.
   - Responsividade: torre deve ser scrollbar vertical em telas pequenas.

3. Requisitos Não-Funcionais
   - Performance: animações suaves, carga inicial rápida (JSON pequeno, assets otimizados).
   - Escalabilidade: fácil adicionar novos desafios via JSON sem alterar código.
   - Manutenibilidade: componentes React modulares (Tower, Stage, Step, Player, DetailView).
   - Acessibilidade: contraste adequado nas cores dos blocos; navegação via teclado.
   - Segurança básica: sanitizar markdown; evitar XSS.

4. Perguntas de Esclarecimento (respondidas)
   1. Persistir progresso no localStorage.
   2. Estrutura de `desafios.json` atualizada com array de `etapas` com campos id, titulo, descricao.
   3. Experiência single-player.
   4. Visual livre e simples por ora.
   5. Conteúdo somente em português.

**Confidence:** 80 %

**Próximos passos (já realizados)**
- Iniciar Fase 2: contexto do sistema.

---

**Fase atual**
Fase 2 – Contexto do Sistema

**Achados / entregáveis**
1. Estrutura de diretórios (proposta, já que codebase está vazia)
   - `public/` – assets estáticos (sprites simples do personagem, favicon etc.).
   - `data/desafios.json` – fonte de dados dinâmica carregada na inicialização.
   - `content/desafios/<id>/<etapa>.md` – markdown de cada etapa (renderizado em `/desafio/:id`).
   - `components/` – componentes React reutilizáveis (Tower, Stage, Step, Player, DetailView, MarkdownRenderer).
   - `lib/` – utilidades (carregar e persistir progresso, two.js helpers, storage helpers).
   - `pages/index.tsx` – página principal (torre + painel de detalhes).
   - `pages/desafio/[id].tsx` – rota dedicada caso opção full-page seja desejada (além do painel lateral).

2. Sistemas externos e pontos de integração
   - **Nenhum backend**: aplicação totalmente client-side, single-player.
   - Persistência de progresso via `localStorage`.

3. Limites e responsabilidades
   - Frontend NextJS encapsula UI, lógica de estado, animações, renderização da torre.
   - two.js cuida exclusivamente do desenho e animação gráfica da torre (canvas/SVG).
   - Markdown é sanitizado e renderizado via `react-markdown` no componente DetailView.

4. Diagrama de contexto (alto nível)
   - [NextJS Frontend]
     → lê `desafios.json` → gera torre (Two.js)
     → lê markdown etapa no clique → mostra DetailView
     → lê/escreve `localStorage` para progresso
   - Não há outros sistemas externos.

**Confidence:** 85 %

**Perguntas em aberto**
1. A descrição de cada etapa virá em arquivos `.md` separados (como sugerido) ou será armazenada inline dentro de `desafios.json`? (Impacta leitura dinâmica e build).
2. O "Final Boss" terá conteúdo markdown próprio? Caso sim, qual id usar para roteamento?
3. Há preferência por Server Components/Client Components no Next 13+ ou manter modelo tradicional (pages router)?

**Próximos passos**
- Aguardar resposta às perguntas acima.
- Avançar para Fase 3 assim que clareadas, propondo 2-3 padrões arquiteturais e escolha de melhor.

---

**Fase 3 – Design da Arquitetura**

1. Padrões Arquiteturais Propostos (escolha 1)

   **A. NextJS Pages Router (CSR predominante)**
   - Tudo renderizado client-side; páginas tradicionais em `pages/`.
   - Estado global via React Context + `useReducer`.
   - two.js inicializado no `useEffect` do componente Tower.

   *Vantagens*
   - Simples, curva de aprendizagem baixa.
   - Hot-reload rápido; bom para prototipagem.
   - Zero configuração de Server Components.

   *Desvantagens*
   - Não aproveita novidades (Streaming, layouts hierárquicos) do App Router.
   - Possível sobrecarga no bundle inicial se não modularizarmos two.js.

   *Adequação*: Excelente para single-player client-side sem SSR.

   **B. NextJS App Router (Client Components only)**
   - Estrutura `/app` com `layout.tsx` e `page.tsx`; todos componentes marcados `'use client'`.
   - Aproveita routing aninhado e loading UI.
   - Estado global via Zustand (arquivo `store.ts`).

   *Vantagens*
   - Futuro do Next; layouts aninhados simplificam DetailPane.
   - Segmentos de `loading.tsx` fornecem UX melhor em fetch de markdown.

   *Desvantagens*
   - Pode confundir time acostumado ao Pages Router.
   - Documentação ainda evoluindo; algumas libs têm fricção com App Router.

   *Adequação*: Muito boa se quisermos aderir ao roadmap do framework.

   **C. Pure React + Vite (sem Next)**
   - Aplicação SPA leve, bundler Vite, deploy via Netlify/Static.

   *Vantagens*
   - Build ultra-rápido, configuração mínima.
   - Não traz sobrecarga de features que não usaremos (SSR).

   *Desvantagens*
   - Perdemos roteamento opinado, imagens otimizadas e convenções do Next.
   - Requer escrevemos mais boilerplate (404, etc.).

   *Adequação*: Interessante se quisermos simplicidade máxima, mas desalinhado com requisito NextJS.

2. Recomendação

   Sugiro **Padrão B: NextJS App Router (Client Components only)** por ser futuro do framework e oferecer melhor organização, mantendo CSR. Mas estou aberto à sua escolha.

3. Componentes Centrais e Responsabilidades

   - `TowerCanvas` (client): renderiza torre via two.js; recebe lista de desafios + progresso.
   - `StageBlock` (client): bloco individual (etapa) com cor e onClick.
   - `PlayerAvatar` (client): sprite animado ao lado do bloco atual.
   - `ProgressContext` / `useProgressStore`: carrega/salva progresso no localStorage.
   - `DetailPane` (client): exibe markdown da etapa usando `react-markdown` + plugins.
   - `MarkdownRenderer` (client): wrapper com rehype-sanitize e suporte a imagens.

4. Interfaces/Contratos

   ```ts
   // lib/types.ts
   export interface Etapa { id: number; titulo: string; descricao: string; }
   export interface Desafio {
     id: number;
     nome: string;
     etapas: Etapa[];
     cor: string;
   }
   export interface Progresso { desafioId: number; etapaIndex: number; }
   ```

   Componentes recebem apenas dados imutáveis acima; mutações via ações do store:
   - `nextStep()`
   - `reset()`

5. Esquema de Dados

   - JSON de desafios carregado via `fetch('/data/desafios.json')`.
   - Markdown de cada etapa: caminho `content/desafios/{desafioId}/{etapaId}.md`.

6. Preocupações Transversais

   - **Persistência**: hook `useLocalStorage` para gravar `Progresso`.
   - **Segurança**: `rehype-sanitize` ao renderizar markdown; cabeçalhos CSP via Next config.
   - **Logging**: `@vercel/analytics` opcional ou console.debug no dev.
   - **Erros**: Error Boundary em volta do `DetailPane`.
   - **A11y**: tabindex nos blocos, textos alternativos em imagens do markdown.
   - **Performance**: lazy-load two.js (`dynamic import`) e markdown.

**Confidence:** 90 %

**Perguntas em aberto**
- Qual dos padrões (A, B ou C) prefere adotar? *Por favor escolha um para seguirmos.*

**Próximos passos**
- Após escolher o padrão, detalhar Fase 4 (especificação técnica) com tecnologias concretas, fases de implementação e riscos. 