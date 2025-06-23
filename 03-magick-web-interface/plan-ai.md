# Plano Final – ImageMagick Wrapper

## Objetivo
Construir uma aplicação web simples que permita a um usuário único converter imagens de formato ou aplicar filtro de blur utilizando o ImageMagick local, através de uma interface React + Node monolítica.

## Arquitetura Selecionada
Monólito **Node.js 20 + Express** que serve:
1. **API REST** para upload, processamento e download de imagens.
2. **Assets estáticos** do frontend **Vite + React 18**.

O Express invoca o binário **ImageMagick** (`magick`) via `child_process.execFile` em um diretório temporário isolado.

### Componentes Principais
| Componente | Responsabilidade |
|------------|------------------|
| UI (React/shadcn) | Upload, seleção de operação (convert/blur), preview, download |
| API Controller | Endpoints `POST /convert`, `POST /blur`, `GET /files/:id` |
| ImageProcessor | Monta e executa comando ImageMagick seguro |
| FileStore | Gerencia arquivos temporários, cleanup periódico |

### Endpoints
- `POST /convert` – multipart: `file`, `targetFormat (png|jpg|webp)` → `{ id, downloadUrl }`
- `POST /blur` – multipart: `file`, `radius (int)`, `sigma (int)` → `{ id, downloadUrl }`
- `GET /files/:id` – download resultado com cabeçalho `Content-Disposition`

### Segurança & Limites
- Validação de mime-type/extensão e tamanho ≤ 10 MB
- Uso de `execFile` (não `exec`) para evitar injeção
- Diretório sandbox `/tmp/magick` + `nanoid()`
- `magick -limit memory 256MB`
- Cleanup automático de arquivos > 30 min

## Roadmap de Implementação
1. Scaffold projeto: `npm init -y`, `vite` (React TS), instalar deps Express, multer, nanoid.
2. Implementar backend (`/server/index.ts`, rotas, serviços).
3. Implementar frontend com shadcn ui (Dropzone, Forms, Preview).
4. Configurar proxy Vite `/api` em dev, e `express.static("dist")` em prod.
5. Testes manuais de conversão PNG→JPG e blur padrão.
6. Implementar script/cron de limpeza.
7. Adicionar logging (morgan) e ajustes finais.

## Critérios de Sucesso
- Conversão e blur funcionam com < 2 s para imagens de 2 MB
- Diretório tmp limitado a 100 MB com cleanup ativo
- Nenhuma injeção de comando possível

---
**Status:** Plano aprovado, confiança 90 %. Pronto para implementação. 