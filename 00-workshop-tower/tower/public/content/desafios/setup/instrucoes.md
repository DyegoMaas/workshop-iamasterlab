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

### Servidores MCP

O site [smithery.ai](https://smithery.ai) é um repositório de servidores MCP. Acesse o site [smithery.ai](https://smithery.ai), e encontre os seguintes servidores MCP
 - **smithery-ai/server-sequential-thinking**
 - **upstash/context7-mcp**
 - **@microsoft/playwright-mcp**

 Em Tools & Integrations, configure os seguintes servidores (guias mais abaixo):

Para instalar as extensões perplexity-ask e playwright-mcp acesse o site [smithery.ai](https://smithery.ai) e siga as instruções para instalação no Cursor.


#### Instalação do Servidor MCP do Perplexity

Acesse o repositório git do [Perplexity](https://github.com/ppl-ai/modelcontextprotocol/tree/main) e siga as instruções de instalação.

Esta instalação será manual, através das configurações do Cursor:

![Add MCP Server](images/cursor-config-mcp.png)


❗**Importante:** para o Perplexity, você vai precisar de uma API Key. O instrutor vai fornecê-la durante o event.