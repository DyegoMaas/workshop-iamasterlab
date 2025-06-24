# 🔧 Criar Workflows para Agentes

Neste desafio, você irá criar regras e workflows detalhados que permitam a agentes de IA criar filtros de imagem de forma automatizada e consistente.

Criar novos filtros é uma **tarefa repetitiva**, são operações simples, com comandos e parâmetros de estrutura semelhante. Por isso, podemos automatizar este processo criando uma regra especial que chamaremos de `workflow-adicionar-novo-filtro`.

Há três maneiras de criar uma regra:
1. Nas configurações do Cursor->Rules->Add Project Rule
2. Manualmente, criando um arquivo `.mdc` na pasta `/.cursor/rules`
3. Pedindo para o agente criar uma regra do Cursor e explicando a regra

A regra deverá ser do tipo Manual.

## 🎯 Objetivo

Criar uma regra, ou conjunto de regras, que documentem o processo de adicionar um novo filtro de imagem na aplicação, de modo que:
- Os novos filtros sejam criados com consistência e respeitando a arquitetura existente
- Deve ser feito de modo que seja repetível, de forma confiável, e que conclua a tarefa em one-shot

## Formas de especificar uma regra

- Escrever a regra manualmente
- Engenharia reversa a partir do código: um agente pode extrair as regras e convenções de implementações existentes