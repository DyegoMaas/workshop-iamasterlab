# Instruções gerais

Documentações:
- [Cursor](https://docs.cursor.com/welcome)

## Setup de ambiente

### Instalação do Cursor

Para baixar a IDE Cursor, acesse https://www.cursor.com/downloads.

Em seguida faça as seguintes configurações:
- Acesse as configurações do Cursor em Arquivo->Preferências->Cursor Settings
- Em General, mude a opção Privacy para **Privacy Mode with Storage**
- Em Chat, habilite as opções **Completion Sound** e **Custom Modes**
- Em Beta, habilite a opção **Notepads**
- Em Tools & Integrations, configure os seguintes servidores (guias mais abaixo):
 - perplexity-ask
 - context7
 - playwright-mcp

#### Perplexity


#### Context7


#### Playwright




Alpha Vantage
API KEY
034XW5GJ0J55HA9P
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=PETR4.SA&apikey=S034XW5GJ0J55HA9P
https://www.alphavantage.co/documentation/



### Instalar extensões no Cursor

A instalação de extensões no Cursor funciona exatamente como no VSCode.

Instalar as seguintes extensões:
1. REST Client: será usada para testes, dispensando Postman ou Insomnia

### Clonar repositório git

Clone o seguinte repositório do GitHub:
https://github.com/DyegoMaas/workshop-iamasterlab


Bloco 01: Aplicação Financeira

##### Template visual

Acesse o site [TweakCn](https://tweakcn.com/editor/theme?tab=ai) e gere um template do leaitue da sua preferência:

🎯 Conservative Investor (tons terrosos, layout clean)
🔥 Day Trader (cores vibrantes, dados em tempo real)
📈 Growth Investor (azuis e verdes, foco em tendências)
💎 Crypto Enthusiast (neon, dark mode, volatilidade)
🎯 @Doom 64

Copie o código CSS para Tailwind.


Construa o seguinte prompt no Cursor:


You are a senior full-stack engineer expert in Next.js 15+, React 19, TypeScript,
TailwindCSS 3.4 and shadcn/ui.  
Produce production-ready code that compiles after `npm i && npm run build`.

No prose, no markdown, no emojis outside files.

──────────────────────
📝 CORE REQUIREMENTS
──────────────────────
1. **SSR ENABLED**  
   • Use `app/` router with `export const dynamic = "force-dynamic"`  
2. **TailwindCSS v4** fully configured (`tailwind.config.ts`, JIT)  
3. **shadcn/ui** installed; wrapper `src/ui/ShadThemeProvider.tsx` (theme `"light"`); demo components `Button`, `Card`, `Input`  
4. **Financial Dashboard** (`/`)  
   • Header fixo com logo “💹 TechStocks” e navegação fictícia  
   • Hero com CTA “Adicionar ação” (`Button`)  
   • **Stock Grid SSR**: para NVDA, GOOG, AMZN, MSFT, META  
        – Mostrar **price, daily % change, last-updated**  
        – Dados vindos de `https://query1.finance.yahoo.com/v7/finance/quote?symbols=NVDA,GOOG,AMZN,MSFT,META`  
        – Se `process.env.FETCH_STOCKS_OFFLINE === "true"`, usar mock JSON `src/lib/mockQuotes.ts`  
   • **Mini-chart**: componente `StockSparkline.tsx` (Recharts) exibindo últimos 7 fechamentos (endpoint:  
     `https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}?range=7d&interval=1d`)  
5. **Best Practices**  
   • ESLint, Prettier, TypeScript strict, `next/image`, `next/font/google` (Inter)  
   • Lazy-load charts com `React.lazy` + `Suspense`  
   • SEO default metas (`next/seo`) e ARIA labels  
6. **Tests** — `__tests__/dashboard.test.tsx` (Vitest + Testing Library) verifica render de símbolo NVDA  
7. **package.json scripts** — `dev`, `build`, `start`, `lint`, `test`, `type-check`  
8. **Dockerfile** multi-stage (node:lts-alpine) geração imagem slim

──────────────────────
📁 EXPECTED STRUCTURE
──────────────────────
/
├─ src/
│  ├─ app/                      # SSR routes
│  │   └─ page.tsx              # dashboard
│  ├─ components/
│  │   └─ StockSparkline.tsx
│  ├─ ui/
│  ├─ lib/
│  │   └─ mockQuotes.ts
│  └─ styles/
├─ public/
├─ __tests__/
├─ tailwind.config.ts
├─ postcss.config.js
└─ Dockerfile

──────────────────────
🌱 OPTIONAL EXTRAS (if tokens allow)
──────────────────────
• `.env.example` with `YAHOO_API_URL` and `FETCH_STOCKS_OFFLINE`  
• Simple GitHub Actions CI (lint → test → build)

──────────────────────
🎨 [template-css]
──────────────────────
// file: src/styles/theme-overrides.css
/* === [template-css] Paste your custom Tailwind layer/utilities here ========= */
/*                                                                            */
/*                                                                            */

──────────────────────
IMPORTANT
──────────────────────
• Use relative imports under `src/` only  
• Ensure `npm run build` passes  
• Keep inline comments minimal

LET’S CODE — que os mercados estejam verdes! 📈





Bloco 02:
https://github.com/DyegoMaas/workshop-iamasterlab-block2-codesurgeon

Bloco 03:


Bloco 04:



