## Criar arquivos de regras

Para garantir um comportamento mais consistente dos agentes dentro de um determinado projeto, podemos definir **regras para o agente**.

Podemos configurar quatro tipos de regras:
1. **Manual**: o desenvolvidor precisa referenciá-lo no prompt usando `@nome-regra`
2. **Auto Attached**: a regra é selecionada de acordo com um seletor de arquivos. Exemplo: `*.js`
3. **Agent Requested**: o agente escolhe de acordo com a situação baseado na descrição da regra
4. **Always**: regras mais gerais que são utilizadas em **todos os prompts**

Essas regras podem:
- Estabelecer padrões consistentes de nomenclatura
- Definir estrutura organizacional de arquivos
- Criar convenções de código e boas práticas
- Estabelecer regras de commit e versionamento
- Definir guidelines para testes


## 🎯 Objetivo

Criar regras de projeto que estabeleçam padrões consistentes e boas práticas para o desenvolvimento, garantindo que todos os agentes e desenvolvedores sigam as mesmas convenções. Essas regras devem cobrir desde nomenclatura até estrutura de arquivos, passando por convenções de código e processos de desenvolvimento, visando manter a qualidade e consistência do código em todo o projeto.

Acesse o site [Cursor.diretory](https://cursor.directory/rules) e encontre regras para a stack do projeto:
- Frontend
- Backend

Crie diferentes arquivos de regra, ou mescle as mesmas em um único arquivo.

## 📋 Exemplos

A seguir há vários exemplos para inspiração!

### 1. Regras de Nomenclatura

Baseado na análise do projeto, estabeleça padrões claros para:

- **Arquivos e Diretórios**: Convenções para nomes de arquivos, extensões e organização
- **Componentes**: Padrões para nomes de componentes React
- **Funções e Variáveis**: Estilo de nomenclatura (camelCase, kebab-case, etc.)
- **Constantes**: Convenções para valores constantes
- **Tipos TypeScript**: Padrões para interfaces, types e enums

### 2. Estrutura de Arquivos

Documente a organização padrão:

- Hierarquia de diretórios
- Onde colocar novos componentes
- Organização de assets e recursos
- Separação de lógica de negócio e UI

### 3. Convenções de Código

Estabeleça regras para:

- **Formatação**: Uso de prettier, eslint
- **Imports**: Ordem e organização de imports
- **Comentários**: Quando e como comentar código
- **Props e State**: Padrões para definição e uso
- **Hooks**: Convenções para hooks customizados

### 4. Regras de Commit

Defina padrões para:

- **Formato de mensagens**: Conventional commits ou padrão próprio
- **Frequência de commits**: Quando fazer commit
- **Branch naming**: Convenções para nomes de branches
- **Pull Requests**: Estrutura e processo de review

### 5. Guidelines de Testes

Estabeleça regras para:

- **Estrutura de testes**: Organização de arquivos de teste
- **Naming**: Convenções para nomes de testes
- **Cobertura**: Metas de cobertura de código
- **Tipos de teste**: Unit, integration, e2e

## 🔧 Implementação Prática

1. **Crie um arquivo `CONTRIBUTING.md`** com todas as regras estabelecidas
2. **Configure ferramentas de linting** (ESLint, Prettier) para enforcar regras
3. **Documente no README.md** os padrões mais importantes
4. **Crie templates** para pull requests e issues
5. **Configure hooks de pre-commit** para validar regras automaticamente

## 📝 Exemplo de Estrutura

```markdown
# Regras do Projeto

## Nomenclatura
- Componentes: PascalCase (`FilterComponent.tsx`)
- Funções: camelCase (`applyFilter()`)
- Constantes: UPPER_CASE (`MAX_FILE_SIZE`)

## Estrutura
- `/components` - Componentes reutilizáveis
- `/pages` - Páginas da aplicação
- `/utils` - Funções utilitárias
- `/types` - Definições de tipos TypeScript

## Commits
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Refatoração
```

## ✅ Checklist

- [ ] Regras de nomenclatura definidas e documentadas
- [ ] Estrutura de arquivos padronizada
- [ ] Convenções de código estabelecidas
- [ ] Padrões de commit definidos
- [ ] Guidelines de testes criadas
- [ ] Ferramentas de linting configuradas
- [ ] Documentação criada (`CONTRIBUTING.md`)