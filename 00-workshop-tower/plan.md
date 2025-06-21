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