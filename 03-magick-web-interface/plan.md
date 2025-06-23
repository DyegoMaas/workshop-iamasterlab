Fase 1 – Análise de Requisitos
============================

1. **Fase atual**
   Fase 1 – Análise de Requisitos

2. **Achados / entregáveis**
   - **Requisitos funcionais explícitos**
     1. Pesquisar e compreender o funcionamento dos comandos principais do ImageMagick (magick, convert, identify, mogrify, composite, montage, compare, etc.).
     2. Planejar a construção de um *wrapper* (interface web) utilizando React (frontend) e Node (backend) que permita ao usuário executar operações do ImageMagick via interface gráfica.
   - **Requisitos funcionais implícitos**
     1. Suporte a upload de imagens e download do resultado.
     2. Exposição das opções mais comuns (resize, crop, rotate, format conversion, compressão, filtros, composição de camadas, texto, etc.).
     3. Possibilidade de cadeia de operações (pipeline) antes de gerar o resultado.
     4. Visualização prévia/preview das transformações antes de confirmar.
   - **Requisitos não-funcionais**
     1. Segurança: sanitização de parâmetros para evitar command injection.
     2. Performance: processamento de imagens de forma assíncrona, uso eficiente de CPU/memória, limite de tamanho de arquivos.
     3. Escalabilidade: possibilidade de executar múltiplas requisições simultâneas (fila/worker).
     4. Manutenibilidade: código modular, testes automatizados.
     5. Compatibilidade: suportar ambientes Windows/Linux, browsers modernos.
     6. Observabilidade: logging de operações, rastreamento de erros.

3. **Confidence:** 60 %

4. **Perguntas em aberto**
   1. Quais operações do ImageMagick devem ser priorizadas na primeira versão? Há um *scope* mínimo?
   2. O sistema será multi-usuário com autenticação/autorização ou uso livre?
   3. Onde os arquivos de imagem serão armazenados (em disco local temporário, S3, banco, etc.)?
   4. Há requisitos de integração com outros sistemas (ex.: CDN, APIs externas)?
   5. Há restrições de tamanho máximo de arquivo ou necessidade de processamento em lote?
   6. Qual é a meta de throughput/latência aceitável para processamento de imagens?

5. **Próximos passos**
   1. Aguardar respostas do usuário para as perguntas em aberto.
   2. Após esclarecimentos, avançar para Fase 2 – Contexto do Sistema.

6. **Respostas e decisões**
   *(Aguardando respostas do usuário)* 

Fase 2 – Contexto do Sistema
===========================

1. **Fase atual**
   Fase 2 – Contexto do Sistema

2. **Achados / entregáveis**
   - **Estrutura de código existente**: Não há codebase existente; o projeto será criado do zero.
   - **Sistemas externos identificados**:
     • Binário ImageMagick instalado localmente (comandos `magick convert`, filtros de blur, etc.).
   - **Limites e responsabilidades**:
     • **Frontend (React)**: UI para upload de imagem, seleção de operação (conversão de tipo ou aplicação de blur), visualização de preview e download do resultado.
     • **Backend (Node)**: API REST para aceitar upload, chamar ImageMagick via `child_process.exec`, armazenar arquivos temporários locais, devolver resultado.
     • **Filesystem local**: Armazenamento temporário de arquivos de entrada/saída; limpeza periódica.
     • **CLI ImageMagick**: Realiza o processamento real de imagens.
   - **Diagrama de contexto (alto nível)**:

     ```text
     [Browser] --HTTP--> [React App] --HTTP/Fetch--> [Node API] --exec--> [ImageMagick CLI]
                                                                    ↘
                                                                   [Local FS]
     ```

3. **Confidence:** 70 %

4. **Perguntas em aberto**
   *Nenhuma pergunta adicional no momento.*

5. **Próximos passos**
   1. Iniciar Fase 3 – Design da Arquitetura (propor padrões e solicitar decisão do usuário).

6. **Respostas e decisões**
   *(Não aplicável nesta fase)* 

Fase 3 – Design da Arquitetura
==============================

1. **Fase atual**
   Fase 3 – Design da Arquitetura

2. **Achados / entregáveis**
   - **Padrões arquiteturais propostos**

     **Opção A – Monólito Node + React Integrado**
     • Backend Node/Express serve API REST e também entrega os assets estáticos do React (build).  
     • Simples de configurar e hospedar (um único processo/porta).  
     • **Vantagens:** deploy único, menor sobrecarga DevOps, fácil para workshop local.  
     • **Desvantagens:** acoplamento forte, escala horizontal exige replicar tudo, assets estáticos re-buildam a cada deploy do backend.

     **Opção B – Frontend Estático + API Node Independente (2-tier)**
     • React é compilado e servido como arquivos estáticos (ex.: nginx ou `vite preview`). Backend Node/Express roda em processo separado apenas para API e ImageMagick.  
     • **Vantagens:** separação de preocupações, deploy frontend via CDN simples, backend pode reiniciar sem afetar UI.  
     • **Desvantagens:** requer configurar CORS ou proxy, 2 deploys distintos.

     **Opção C – Funções Serverless (Experimental)**
     • Expor API de processamento de imagem como funções serverless (e.g., Vercel, AWS Lambda) e hospedar frontend estático.  
     • **Vantagens:** escala automática, sem gerenciar servidor, cobra por uso.  
     • **Desvantagens:** cold start, limites de runtime/memória podem ser problemáticos para ImageMagick, mais complexidade para workshop local.

   - **Recomendação preliminar**
     Sugiro **Opção A – Monólito Node + React Integrado** pela simplicidade e alinhamento ao escopo "super simples / local". Facilita setup em workshop e reduz configuração de rede.

   - **Componentes centrais**
     1. **UI (React + shadcn/ui + Roboto):** upload de imagem, form de operação (tipo alvo ou blur), preview, botão "Download".
     2. **API Controller (Express):** endpoints `POST /convert` e `POST /blur` que recebem arquivo + parâmetros.
     3. **Service ImageProcessor:** módulo interno que sanitiza parâmetros e cria a string de comando ImageMagick (p.ex. `magick input.png -blur 0x8 output.png`). Executa via `child_process.exec`.
     4. **FileStore:** gerencia diretório temporário, gera nomes únicos, remove arquivos antigos.

   - **Interfaces / contratos**
     • **POST /convert** – multipart/form-data `{file, targetFormat}` → retorna `{downloadUrl}`.  
     • **POST /blur** – multipart/form-data `{file, radius, sigma}` → retorna `{downloadUrl}`.

   - **Esquema de dados (mínimo)**
     Não há persistência. Apenas metadados em memória `{ id, originalName, resultPath, expiresAt }` para limpeza de arquivos.

   - **Preocupações transversais**
     • **Segurança:** validar mime-type, tamanho, sanitizar inputs, usar diretório sand-box, limitar execução (`-limit memory 256MiB`).  
     • **Logging:** requests/respostas, tempo de execução do comando.  
     • **Tratamento de erros:** timeout no `exec`, enviar HTTP 500 com mensagem amigável.  
     • **Monitoramento:** contador simples de jobs processados, latência média.  
     • **Limpeza de arquivos temporários:** job periódico cron‐like.

3. **Confidence:** 80 %

4. **Perguntas em aberto**
   1. Qual opção arquitetural você prefere (A, B ou C)?

5. **Próximos passos**
   1. Registrar sua escolha.  
   2. Avançar para Fase 4 – Especificação Técnica com base na opção selecionada.

6. **Respostas e decisões**
   • Usuário escolheu **Opção A – Monólito Node + React Integrado**

Fase 4 – Especificação Técnica
==============================

1. **Fase atual**
   Fase 4 – Especificação Técnica

2. **Achados / entregáveis**
   - **Tecnologias concretas**
     • **Node.js 20 LTS** + **Express 4** para API e servidor estático.  
     • **multer** para upload multipart.  
     • **child_process.execFile** para invocar `magick`.  
     • **vite + React 18 + TypeScript** para frontend.  
     • **shadcn/ui** para componentes, fonte **Roboto** via Google Fonts.  
     • **pnpm** como gerenciador de pacotes (simplicidade e velocidade) – opcional.  
     • **eslint + prettier** para qualidade de código.

   - **Fases de implementação**
     1. Setup monorepo (ou pasta única) `magick-wrapper`, inicializar `package.json`, configurar scripts `dev` e `build`.  
     2. Instalar Node deps: express, multer, cors, dotenv, nanoid, morgan.  
     3. Criar estrutura backend `/server`:
        • `index.ts` (bootstrap)  
        • `routes/image.ts` (endpoints)  
        • `services/imageProcessor.ts`  
        • `services/fileStore.ts`  
     4. Implementar endpoint `POST /convert`:
        - recebe arquivo + `targetFormat`  
        - valida extensão, tamanho ≤ 10 MB  
        - chama `magick` → `output.{fmt}`  
        - responde `{downloadUrl}`
     5. Implementar endpoint `POST /blur`:
        - recebe arquivo + `radius` + `sigma` (defaults 0/4)  
        - valida numérico  
        - `magick input -blur ${radius}x${sigma} output.png`
     6. FileStore: salvar em `/tmp/magick` com `nanoid()`; job `setInterval` cada 10 min para limpar arquivos > 30 min.
     7. Frontend `/client` via Vite: página única com tabs "Converter" e "Blur".
        - Componente UploadDropzone (shadcn Dropzone)  
        - Formulário seleção formato alvo (.png, .jpg, .webp) ou sliders radius/sigma.  
        - Preview `<img>` usando `URL.createObjectURL` da resposta.  
        - Botão "Download".
     8. Configurar proxy no Vite para API `/api`.  
     9. Build de produção: `vite build` gera `dist`; Express configura `app.use(express.static("dist"))`.
    10. Testes manuais e script `npm run clean` para limpar tmp.

   - **Riscos técnicos & mitigadores**
     • **Injeção de comando** → usar `execFile` + array args, validar input.  
     • **Uso excessivo de memória/CPU** → limitar via `magick -limit memory 256MB`, rejeitar arquivo > 10 MB.  
     • **Path traversal** → salvar somente em diretório tmp controlado.  
     • **Windows compatibilidade** → testar caminhos com `path.join`, usar `.exe` se necessário.  
     • **Tempo de build do React** em monólito → script separado `postinstall`.

   - **Especificação de componentes**
     • **/convert**: Método POST, Content-Type `multipart/form-data`. Body: `file`, `targetFormat` (enum: png|jpg|webp). Resposta 200: JSON `{ id, downloadUrl }`.  
     • **/blur**: Body: `file`, `radius` (int 0-50), `sigma` (int 1-10). Resposta igual.  
     • Download: `GET /files/:id` serve resultado com header `Content-Disposition: attachment`.

   - **Critérios de sucesso técnico**
     1. Usuário consegue converter PNG→JPG e aplicar blur 0x8 via UI.  
     2. Tempo de resposta ≤ 2 s para imagens 2 MB.  
     3. Diretório tmp não cresce além de 100 MB com cleanup ativo.  
     4. Nenhum input arbitrário executa comando fora do escopo.

3. **Confidence:** 90 %

4. **Perguntas em aberto**
   *Nenhuma.*

5. **Próximos passos**
   1. Se estiver tudo ok, avançar para Fase 5 – Decisão de Transição.

6. **Respostas e decisões**
   *(Aguardando confirmação do usuário)*

Fase 5 – Decisão de Transição
=============================

1. **Fase atual**
   Fase 5 – Decisão de Transição

2. **Achados / entregáveis**
   - **Resumo da recomendação arquitetural**
     • Adotar **Monólito Node + React Integrado** executando localmente, onde Express serve API e assets estáticos do React.  
     • Backend oferece endpoints `POST /convert`, `POST /blur` e `GET /files/:id`, invocando ImageMagick via `execFile`.  
     • Frontend Vite/React com shadcn/ui provê UI para upload, seleção de formato ou blur e download do resultado.  
     • Segurança garantida via validação de inputs, diretório temporário e limites de recursos.
   - **Roadmap de implementação**
     1. Inicializar repositório Node + Vite, configurar scripts.  
     2. Implementar backend Express com upload via multer.  
     3. Criar serviço ImageProcessor e FileStore.  
     4. Desenvolver frontend com componentes Upload, Form de conversão e blur, Preview e Download.  
     5. Integração end-to-end e testes manuais.  
     6. Implementar limpeza automática de arquivos temporários.  
     7. Ajustes finais, logging e documentação.

3. **Confidence:** 90 %

4. **Perguntas em aberto**
   *Nenhuma.*

5. **Próximos passos**
   • Criar arquivo `plan-ai.md` com o plano final e aguardar troca para Agent mode.

6. **Respostas e decisões**
   *(Não aplicável – pronto para transição)*