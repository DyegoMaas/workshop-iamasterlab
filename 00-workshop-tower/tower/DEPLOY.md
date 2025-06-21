[![Netlify Status](https://api.netlify.com/api/v1/badges/2a843abd-d258-4224-99f2-b96578407bb9/deploy-status)](https://app.netlify.com/projects/ia-masterlab-devs-do-futuro/deploys)

# Deploy no Netlify

Este projeto está configurado para deploy automático no Netlify via GitHub Actions.

## Setup Inicial

### 1. Criar site no Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Faça login e clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `00-workshop-tower/tower`

### 2. Configurar Secrets no GitHub

No seu repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

- `NETLIFY_AUTH_TOKEN`: Token de autenticação do Netlify
- `NETLIFY_SITE_ID`: ID do site criado no Netlify 

#### Como obter o NETLIFY_AUTH_TOKEN:
1. No Netlify, vá em **User settings > Applications > Personal access tokens**
2. Clique em "New access token"
3. Copie o token gerado

#### Como obter o NETLIFY_SITE_ID:
1. No dashboard do Netlify, selecione seu site
2. Vá em **Site settings > General**
3. Copie o "Site ID"

## Como Funciona

O pipeline executa automaticamente quando há mudanças no diretório `00-workshop-tower/tower/`:

- **Push** para `main` ou `master`: Faz build e deploy
- **Pull Request** para `main` ou `master`: Faz build e linting (sem deploy)

### Filtro de Paths

O workflow só dispara quando há modificações em:
- `00-workshop-tower/tower/**` (qualquer arquivo dentro do diretório tower)

Isso evita builds desnecessários quando você modifica outros projetos no repositório.

## Estrutura do Workflow

1. **Checkout**: Baixa o código
2. **Setup Node.js**: Configura Node.js 20 com cache
3. **Install**: Instala dependências
4. **Lint**: Executa ESLint
5. **Build**: Compila a aplicação
6. **Deploy**: Faz deploy no Netlify (apenas em main/master)

## Localização dos Arquivos

- **Workflow**: `.github/workflows/deploy.yml` (raiz do repositório)
- **Config Netlify**: `00-workshop-tower/tower/netlify.toml`
- **Documentação**: `00-workshop-tower/tower/DEPLOY.md`

## Troubleshooting

### Erro de build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o Node.js 20 é compatível

### Erro de deploy
- Verifique se os secrets estão configurados corretamente
- Confirme se o `NETLIFY_SITE_ID` está correto

### Cache issues
- O workflow usa cache do npm para otimizar builds
- Se houver problemas, force um novo build sem cache

### Workflow não dispara
- Confirme que as mudanças estão no diretório `00-workshop-tower/tower/`
- Verifique se está fazendo push para `main` ou `master` 