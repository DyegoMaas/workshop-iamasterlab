Para baixar a IDE Cursor, acesse https://www.cursor.com/downloads.

Em seguida faça as seguintes configurações:

- Acesse as configurações do Cursor em *Arquivo->Preferências->Cursor Settings*

![Cursor Settings](images/cursor-settings.png)

- Em General, mude a opção Privacy para **Privacy Mode with Storage**
- Em Chat, habilite as opções **Completion Sound** e **Custom Modes**
- Em Beta, habilite a opção **Notepads**

A aba **Notepads** deve aparecer na janela lateral:

![Cursor Notepads](images/cursor-notepads.png)

Se não aparecer, você pode ajustar essa configuração em:

![Show Cursor Notepads](images/cursor-notepads-show.png)

## Servidores MCP

O site [smithery.ai](https://smithery.ai) é um repositório de servidores MCP. Acesse o site [smithery.ai](https://smithery.ai), e encontre os seguintes servidores MCP
 - **smithery-ai/server-sequential-thinking**
 - **upstash/context7-mcp**
 - **@microsoft/playwright-mcp**

 Em Tools & Integrations, configure os seguintes servidores (guias mais abaixo):

Para instalar as extensões perplexity-ask e playwright-mcp acesse o site [smithery.ai](https://smithery.ai) e siga as instruções para instalação no Cursor.


### Instalação do Servidor MCP do Perplexity

Acesse o repositório git do [Perplexity](https://github.com/ppl-ai/modelcontextprotocol/tree/main) e siga as instruções de instalação.

Esta instalação será manual, através das configurações do Cursor:

![Add MCP Server](images/cursor-config-mcp.png)


❗**Importante:** para o Perplexity, você vai precisar de uma API Key. O instrutor vai fornecê-la durante o event.

## Extensões

Instale as seguintes extensões:
1. Markdown Preview Mermaid Support: será utilizada para visualizar diagramas gerados
2. REST Client: será usada para testes, dispensando Postman ou Insomnia

💡Lembrete: a instalação de extensões no Cursor funciona exatamente como no VSCode.

## Background Agents

Os **Background Agents** são uma funcionalidade poderosa do Cursor IDE que permite executar tarefas automatizadas em segundo plano, como rodar testes automáticos, análises de código ou outras operações que não precisam interromper seu fluxo de trabalho.

### Como Habilitar Background Agents

#### 1. Desabilitar Privacy Mode
- Acesse **Settings** (`Ctrl + ,`)
- Procure por **Privacy Mode** 
- Selecione **Privacy Mode With Storage** esta opção (essencial para o funcionamento dos Background Agents)

#### 2. Habilitar Background Agent
- Ainda em **Settings**, procure por **Background Agent**
- **Ative** esta funcionalidade
- Um ícone de nuvem ☁️ aparecerá na interface do chat

#### 3. Acessar e Controlar
- Use `Ctrl + E` para abrir o painel de controle dos Background Agents
- Alternativamente, clique no ícone de nuvem ☁️ no chat
- Você pode listar agentes ativos, criar novos e monitorar tarefas

### Funcionalidades Principais

- **Execução isolada**: Cada agente roda tarefas independentemente
- **Monitoramento**: Acompanhe o status das tarefas em tempo real  
- **Automação**: Configure tarefas recorrentes como testes automáticos
- **Controle**: Gerencie múltiplos agentes simultaneamente

### Exemplo de Uso

```
"Execute os testes unitários automaticamente após cada salvamento de arquivo"
```

O Background Agent pode ficar rodando essa tarefa em segundo plano enquanto você continua desenvolvendo.

---

**💡 Dica**: Os Background Agents são especialmente úteis para tarefas repetitivas que você normalmente faria manualmente, liberando você para focar no desenvolvimento. 
