**Fase atual**
Fase 1 – Análise de Requisitos

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
   - Conversão de campo `etapa` no JSON para quantidade de blocos/etapas por desafio.
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

4. Perguntas de Esclarecimento
   1. O progresso do usuário deve ser persistido entre sessões (localStorage ou backend)?
   2. Campo `etapa` no JSON representa número de passos ou índice? Precisamos do nome de cada etapa? Há arquivo markdown separado por etapa?
   3. Haverá autenticação multi-usuário ou é experiência local/single-player?
   4. Há design visual específico para personagem/blocos (sprites) ou é livre?
   5. Devemos suportar internacionalização (pt/en) nos tutoriais?

**Confidence:** 80 %

**Próximos passos**
- Aguardar respostas às perguntas de esclarecimento.
- Iniciar Fase 2: coletar estrutura de diretórios (atualmente vazia), definir limites de sistema e pontos de integração. 