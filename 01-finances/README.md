# 💹 TechStocks Pro

Uma aplicação financeira moderna construída com Next.js 14+, React 19, TypeScript e TailwindCSS para rastreamento de ações de tecnologia em tempo real.

## ✨ Características

- **SSR (Server-Side Rendering)** com Next.js App Router
- **Dados em tempo real** via Alpha Vantage API
- **Gráficos interativos** com Recharts
- **Design responsivo** com TailwindCSS v3.4
- **Componentes reutilizáveis** com shadcn/ui
- **TypeScript strict** para type safety
- **Testes automatizados** com Vitest
- **Docker support** para deploy

## 🚀 Tecnologias

- **Framework:** Next.js 14.2+
- **Frontend:** React 18.3+, TypeScript 5.6+
- **Styling:** TailwindCSS 3.4+, shadcn/ui
- **Charts:** Recharts 2.12+
- **Testing:** Vitest, Testing Library
- **API:** Alpha Vantage (financials data)
- **Deployment:** Docker, Vercel ready

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Setup Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd techstocks-pro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
ALPHA_VANTAGE_KEY=your_api_key_here
ALPHA_VANTAGE_URL=https://www.alphavantage.co/query
FETCH_STOCKS_OFFLINE=true  # Para desenvolvimento offline
```

4. **Execute em modo desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

## 📊 Funcionalidades

### Dashboard Principal
- **Header fixo** com navegação
- **Hero section** com CTAs
- **Grid de ações** mostrando:
  - Preço atual
  - Variação diária (%)
  - Mini gráfico de tendência
  - Última atualização

### Gráfico Histórico
- **Dados dos últimos 12 meses**
- **Filtros de período**: YTD, 6M, 1M, ALL
- **Visualização interativa** com tooltips
- **Responsivo** para todos os dispositivos

### Ações Suportadas
- NVDA (NVIDIA)
- GOOG (Alphabet/Google)
- AMZN (Amazon)
- MSFT (Microsoft)
- META (Meta/Facebook)

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start

# Linting
npm run lint

# Testes
npm run test

# Type checking
npm run type-check
```

## 🧪 Testes

Execute os testes com:
```bash
npm test
```

Os testes cobrem:
- Renderização dos componentes principais
- Integração com APIs mockadas
- Funcionalidade do gráfico NVDA

## 🐳 Docker

### Build da imagem
```bash
docker build -t techstocks-pro .
```

### Executar container
```bash
docker run -p 3000:3000 \
  -e ALPHA_VANTAGE_KEY=your_key \
  -e FETCH_STOCKS_OFFLINE=true \
  techstocks-pro
```

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard page
├── src/
│   ├── components/        # Componentes React
│   │   ├── StockChart.tsx
│   │   └── StockSparkline.tsx
│   ├── ui/               # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── lib/              # Utilitários e APIs
│   │   ├── fetchAlpha.ts
│   │   ├── mockSeries.ts
│   │   └── utils.ts
│   ├── styles/           # Estilos globais
│   │   └── globals.css
│   └── test/             # Setup de testes
├── __tests__/            # Arquivos de teste
├── public/               # Assets estáticos
├── Dockerfile            # Configuração Docker
└── README.md
```

## 🔧 Configuração da API

Para usar dados reais da Alpha Vantage:

1. **Obtenha uma chave gratuita** em [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. **Configure no .env.local**:
```bash
ALPHA_VANTAGE_KEY=sua_chave_aqui
FETCH_STOCKS_OFFLINE=false
```

## 🎨 Customização

### Tema
O tema pode ser customizado editando as variáveis CSS em `src/styles/globals.css`.

### Ações
Para adicionar novas ações, edite o array `TECH_STOCKS` em `app/page.tsx`.

### Gráficos
Os gráficos podem ser customizados nos componentes `StockChart.tsx` e `StockSparkline.tsx`.

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload da pasta .next para Netlify
```

### Docker Production
```bash
docker build -t techstocks-pro .
docker run -p 3000:3000 techstocks-pro
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique os [Issues](../../issues) existentes
2. Crie um novo issue se necessário
3. Consulte a documentação das tecnologias utilizadas

---

**Desenvolvido com ❤️ usando Next.js, React e TailwindCSS** 