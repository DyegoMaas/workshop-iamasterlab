import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, '../public/prompts');
const manifestPath = path.join(__dirname, '../public/prompts/manifest.json');

try {
  // Ler todos os arquivos .txt da pasta prompts
  const files = fs.readdirSync(promptsDir)
    .filter(file => file.endsWith('.txt'))
    .map(filename => {
      const name = filename.replace('.txt', '').replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      return {
        id: filename.replace('.txt', ''),
        name,
        filename
      };
    });

  // Gerar manifest
  const manifest = {
    templates: files,
    generatedAt: new Date().toISOString()
  };

  // Escrever manifest.json
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Manifest gerado com ${files.length} templates:`, files.map(f => f.name).join(', '));
} catch (error) {
  console.error('❌ Erro ao gerar manifest:', error);
  process.exit(1);
} 