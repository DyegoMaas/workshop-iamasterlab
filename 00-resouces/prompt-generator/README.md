# DOOM 64 Prompt Generator

Uma aplicação React com tema Doom 64 para gerar prompts personalizados a partir de templates.

## 🚀 Funcionalidades

- **Interface temática Doom 64** com efeitos visuais retro
- **Templates personalizáveis** com variáveis dinâmicas
- **4 tipos de templates** incluídos:
  - Creative Writing (Escrita Criativa)
  - Expert Analysis (Análise de Especialistas)
  - Study Plan (Plano de Estudos)
  - Marketing Strategy (Estratégia de Marketing)
- **Validação de campos** obrigatórios
- **Cópia para clipboard** com um clique
- **Interface responsiva** com animações

## 🛠️ Tecnologias

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Ícones
- **Orbitron Font** - Tipografia temática

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:5173`

## 🎯 Como Usar

1. **Selecione um template** no dropdown
2. **Preencha todos os parâmetros** nos campos que aparecem
3. **Clique em "GENERATE PROMPT"** para gerar o prompt
4. **Copie o resultado** usando o botão "COPY TO CLIPBOARD"

## 📁 Estrutura do Projeto

```
prompt-generator/
├── public/
│   └── prompts/          # Templates de prompt (.txt)
├── src/
│   ├── components/
│   │   └── ui/          # Componentes UI reutilizáveis
│   ├── hooks/           # Custom hooks
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos temáticos
│   └── main.jsx         # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 🎨 Personalização

### Adicionando Novos Templates

1. Crie um arquivo `.txt` em `public/prompts/`
2. Use a sintaxe `{{variavel}}` para campos dinâmicos
3. Adicione o nome do arquivo na lista em `src/hooks/useTemplates.js`

### Exemplo de Template
```
Escreva uma história {{genre}} sobre {{protagonist}} que vive em {{setting}}.
A história deve ter um tom {{tone}} e incluir os seguintes elementos: {{elements}}.
```

## 🚀 Deploy

```bash
npm run build
```

Os arquivos de produção estarão em `dist/`

## 🎮 Tema Visual

A aplicação usa uma paleta inspirada no jogo Doom 64:
- **Verde neon** para textos principais
- **Laranja** para destaques e botões  
- **Fundo escuro** com gradientes
- **Efeitos de scanlines** retro
- **Animações de brilho** nos títulos

---

**Mars Research Facility - Template Division v2.64** 