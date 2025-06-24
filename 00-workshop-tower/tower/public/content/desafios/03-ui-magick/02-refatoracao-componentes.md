## Contexto

No backend, há um serviço chamado `imageProcessor`. Ele concentra as operações em imagens disponíveis no editor.

Há dois filtros com códigos muito semelhantes, com estruturas duplicadas:
- `blurImage`
- `sharpenImage`

## 🎯 Objetivo

Refatorar os componentes de filtros para maximizar a reutilização de código e melhorar a manutenibilidade da aplicação.

Para isso, utilize o modo **Refactor**.

### Tarefas Específicas

1. **Extrair componente genérico** para aplicação de filtros
2. **Consolidar a lógica comum** entre os filtros sharpen e blur
3. **Manter flexibilidade** para futuros filtros
4. **Melhorar a manutenibilidade** do código

Boa refatoração! 🛠️