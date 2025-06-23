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

// Filter configuration interfaces
interface FilterParams {
  [key: string]: number;
}

interface FilterValidation {
  [key: string]: {
    min: number;
    max: number;
    errorMessage: string;
  };
}

interface FilterConfig {
  name: string;
  outputPrefix: string;
  outputExtension: string;
  validation: FilterValidation;
  buildCommand: (params: FilterParams) => string[];
}

// Filter configurations
const FILTER_CONFIGS: Record<string, FilterConfig> = {
  blur: {
    name: 'blur',
    outputPrefix: 'blur',
    outputExtension: 'png',
    validation: {
      radius: {
        min: 0,
        max: 50,
        errorMessage: 'Radius must be between 0 and 50'
      },
      sigma: {
        min: 1,
        max: 10,
        errorMessage: 'Sigma must be between 1 and 10'
      }
    },
    buildCommand: (params) => ['-blur', `${params.radius}x${params.sigma}`]
  },
  sharpen: {
    name: 'sharpen',
    outputPrefix: 'sharpen',
    outputExtension: 'png',
    validation: {
      sigma: {
        min: 0.1,
        max: 3.0,
        errorMessage: 'Sigma must be between 0.1 and 3.0'
      }
    },
    buildCommand: (params) => ['-sharpen', `0x${params.sigma}`]
  }
};

// Generic filter validation function
function validateFilterParams(params: FilterParams, validation: FilterValidation): void {
  for (const [paramName, value] of Object.entries(params)) {
    const rule = validation[paramName];
    if (!rule) continue;
    
    if (value < rule.min || value > rule.max) {
      throw new Error(rule.errorMessage);
    }
  }
}

// Generic image filter processing function
async function applyImageFilter(
  inputPath: string, 
  filterConfig: FilterConfig, 
  params: FilterParams
): Promise<string> {
  // Validate parameters
  validateFilterParams(params, filterConfig.validation);

  const outputId = generateId();
  const outputPath = path.join(
    path.dirname(inputPath),
    `${filterConfig.outputPrefix}-${outputId}.${filterConfig.outputExtension}`
  );

  try {
    // Build ImageMagick command
    const filterCommands = filterConfig.buildCommand(params);
    const magickArgs = [
      inputPath,
      '-limit', 'memory', '256MB',
      '-limit', 'time', '60',
      ...filterCommands,
      outputPath
    ];

    // Execute ImageMagick with security limits
    await execFileAsync('magick', magickArgs, {
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
      throw new Error(`Image ${filterConfig.name} failed: ${error.message}`);
    }
    throw new Error(`Image ${filterConfig.name} failed: Unknown error`);
  }
}

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

// Refactored blur function using the generic filter system
export async function blurImage(inputPath: string, radius: number, sigma: number): Promise<string> {
  return applyImageFilter(inputPath, FILTER_CONFIGS.blur, { radius, sigma });
}

// Refactored sharpen function using the generic filter system
export async function sharpenImage(inputPath: string, sigma: number): Promise<string> {
  return applyImageFilter(inputPath, FILTER_CONFIGS.sharpen, { sigma });
}

// Helper function to add new filters easily - example usage:
// export async function rotateImage(inputPath: string, degrees: number): Promise<string> {
//   // Add rotation config to FILTER_CONFIGS first
//   return applyImageFilter(inputPath, FILTER_CONFIGS.rotate, { degrees });
// } 