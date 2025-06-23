import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
// Simple ID generator to replace nanoid
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const execFileAsync = promisify(execFile);

// Allowed image formats and MIME types
const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg', 
  'image/jpg',
  'image/webp'
];

export function validateImageFile(file: Express.Multer.File): boolean {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  return ALLOWED_FORMATS.includes(ext) && ALLOWED_MIME_TYPES.includes(file.mimetype);
}

export async function convertImage(inputPath: string, targetFormat: string): Promise<string> {
  if (!ALLOWED_FORMATS.includes(targetFormat)) {
    throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  const outputId = generateId();
  const outputPath = path.join(
    path.dirname(inputPath),
    `output-${outputId}.${targetFormat}`
  );

  try {
    // Use ImageMagick to convert with security limits
    await execFileAsync('magick', [
      inputPath,
      '-limit', 'memory', '256MB',
      '-limit', 'time', '60',
      outputPath
    ], {
      timeout: 60000, // 60 seconds timeout
      cwd: path.dirname(inputPath)
    });

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    return outputPath;
  } catch (error) {
    // Clean up output file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    
    if (error instanceof Error) {
      throw new Error(`Image conversion failed: ${error.message}`);
    }
    throw new Error('Image conversion failed: Unknown error');
  }
}

export async function blurImage(inputPath: string, radius: number, sigma: number): Promise<string> {
  // Validate parameters
  if (radius < 0 || radius > 50) {
    throw new Error('Radius must be between 0 and 50');
  }
  if (sigma < 1 || sigma > 10) {
    throw new Error('Sigma must be between 1 and 10');
  }

  const outputId = generateId();
  const outputPath = path.join(
    path.dirname(inputPath),
    `blur-${outputId}.png`
  );

  try {
    // Use ImageMagick to apply blur with security limits
    await execFileAsync('magick', [
      inputPath,
      '-limit', 'memory', '256MB',
      '-limit', 'time', '60',
      '-blur', `${radius}x${sigma}`,
      outputPath
    ], {
      timeout: 60000, // 60 seconds timeout
      cwd: path.dirname(inputPath)
    });

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    return outputPath;
  } catch (error) {
    // Clean up output file if it exists
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    
    if (error instanceof Error) {
      throw new Error(`Image blur failed: ${error.message}`);
    }
    throw new Error('Image blur failed: Unknown error');
  }
} 