# Como Usar Imagens nos Markdowns

## Estrutura de Pastas

Organize suas imagens dentro da pasta `images/` de cada desafio:

```
public/content/desafios/
├── setup/
│   ├── instrucoes.md
│   └── images/
│       ├── cursor-download.png
│       ├── cursor-settings.png
│       └── cursor-interface.png
├── fundamentos/
│   ├── introducao.md
│   └── images/
│       └── conceitos.png
└── machine-learning/
    └── images/
        └── algoritmos.png
```

## Sintaxes de Referência

### 1. Sintaxe Básica do Markdown
```markdown
![Texto alternativo](images/nome-da-imagem.png)
```

### 2. Com Título (tooltip)
```markdown
![Texto alternativo](images/nome-da-imagem.png "Título da imagem")
```

### 3. Usando HTML para Controle de Dimensões
```html
<img src="images/nome-da-imagem.png" alt="Texto alternativo" width="600" height="400" />
```

### 4. Imagem Centralizada
```html
<div align="center">
  <img src="images/nome-da-imagem.png" alt="Texto alternativo" width="400" />
</div>
```

### 5. Imagem com Link
```markdown
[![Texto alternativo](images/nome-da-imagem.png)](https://link-destino.com)
```

## Boas Práticas

1. **Nomes de arquivo**: Use kebab-case (ex: `cursor-download.png`)
2. **Formatos**: Prefira PNG para capturas de tela, JPG para fotos
3. **Tamanho**: Otimize as imagens para web (máximo 1MB)
4. **Texto alternativo**: Sempre inclua descrição para acessibilidade
5. **Organização**: Mantenha as imagens na pasta `images/` do respectivo desafio

## Exemplo Prático

```markdown
# Configuração do Cursor

Para configurar o Cursor, siga os passos:

1. Abra as configurações
   ![Configurações do Cursor](images/cursor-settings.png)

2. Configure a privacidade
   <img src="images/privacy-settings.png" alt="Configurações de Privacidade" width="500" />

3. Resultado final
   <div align="center">
     <img src="images/cursor-final.png" alt="Cursor Configurado" width="600" />
   </div>
```

## Caminhos Absolutos (Alternativa)

Se preferir uma pasta global de imagens, use:

```
public/images/
├── setup/
├── fundamentos/
└── machine-learning/
```

E referencie assim:
```markdown
![Exemplo](/images/setup/cursor-download.png)
``` 