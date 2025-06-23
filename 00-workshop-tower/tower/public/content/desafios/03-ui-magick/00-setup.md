# Setup do ImageMagick

Bem-vindo ao desafio de criação de uma interface web para manipulação de imagens usando **ImageMagick**!

O ImageMagick é uma das bibliotecas mais poderosas para processamento de imagens, capaz de ler, processar e escrever mais de 200 formatos de imagem diferentes.

## 🎯 Objetivo

Instalar e configurar o ImageMagick no seu sistema operacional para poder utilizá-lo no próximo desafio.

## 📋 Instalação por Sistema Operacional

### Windows

1. **Acesse a página oficial de downloads**: [https://imagemagick.org/script/download.php](https://imagemagick.org/script/download.php)

2. **Escolha a versão apropriada para Windows**:
   - Para sistemas **64 bits**: `ImageMagick-7.1.1-47-Q16-HDRI-x64-dll.exe`
   - Para sistemas **32 bits**: `ImageMagick-7.1.1-47-Q16-HDRI-x86-dll.exe`
   - Para instalação **portável**: `ImageMagick-7.1.1-47-portable-Q16-HDRI-x64.zip`

3. **Execute o instalador** como administrador

4. **Durante a instalação**, certifique-se de marcar as opções:
   - ✅ Install development headers and libraries for C and C++
   - ✅ Add application directory to your system path

### macOS

1. **Via Homebrew** (recomendado):
```bash
brew install imagemagick
```

2. **Instalar fontes do Ghostscript** (opcional, mas recomendado):
```bash
brew install ghostscript
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install imagemagick
```

### Linux (CentOS/RHEL/Fedora)

```bash
sudo yum install ImageMagick
# ou para versões mais recentes
sudo dnf install ImageMagick
```

## ✅ Verificação da Instalação

Após a instalação, abra o terminal/prompt de comando e execute os seguintes comandos para verificar se tudo está funcionando:

### 1. Verificar a versão
```bash
magick -version
```

**Saída esperada**: Informações sobre a versão do ImageMagick instalada.

### 2. Criar uma imagem de teste
```bash
magick logo: logo.gif
```

Este comando cria uma imagem de teste com o logo do ImageMagick.

### 3. Obter informações da imagem
```bash
magick identify logo.gif
```

**Saída esperada**: Informações detalhadas sobre a imagem criada (dimensões, formato, etc.).

### 4. Exibir a imagem (opcional)
```bash
magick display logo.gif
```

**Nota**: O comando `display` pode não funcionar em todos os sistemas. No Windows, você pode simplesmente abrir o arquivo `logo.gif` com qualquer visualizador de imagens.

## 🔧 Comandos Básicos para Conhecer

Aqui estão alguns comandos básicos que usaremos no próximo desafio:

```bash
# Redimensionar uma imagem
magick input.jpg -resize 800x600 output.jpg

# Converter formato
magick input.png output.jpg

# Aplicar um filtro blur
magick input.jpg -blur 0x8 output.jpg

# Rotacionar uma imagem
magick input.jpg -rotate 90 output.jpg

# Criar uma montagem de imagens
magick montage *.jpg -tile 3x3 -geometry +2+2 montage.jpg
```

## 🚨 Troubleshooting

### Problema: "comando não encontrado"
- **Solução**: Certifique-se de que o ImageMagick foi adicionado ao PATH do sistema
- No Windows, reinicie o terminal após a instalação
- No Linux/macOS, verifique se o pacote foi instalado corretamente

### Problema: Falta de dependências
- **Windows**: Instale o Visual C++ Redistributable Package
- **Linux**: Instale bibliotecas de desenvolvimento: `sudo apt install build-essential`

## 📚 Recursos Adicionais

- **Documentação Oficial**: [https://imagemagick.org/](https://imagemagick.org/)
- **Guia de Uso**: [https://imagemagick.org/script/command-line-processing.php](https://imagemagick.org/script/command-line-processing.php)
- **Exemplos de Comandos**: [https://imagemagick.org/script/examples.php](https://imagemagick.org/script/examples.php)

## ✨ Próximo Passo

Após completar a instalação e verificação, você estará pronto para o próximo desafio!