import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
// Simple ID generator to replace nanoid
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
import { convertImage, blurImage, validateImageFile } from '../services/imageProcessor';
import { getFilePath, scheduleCleanup } from '../services/fileStore';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const tmpDir = path.join(process.cwd(), 'tmp', 'magick');
      cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
      const id = generateId();
      const ext = path.extname(file.originalname);
      cb(null, `input-${id}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const isValid = validateImageFile(file);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.'));
    }
  }
});

// POST /api/convert - Convert image format
router.post('/convert', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { targetFormat } = req.body;
    if (!targetFormat || !['png', 'jpg', 'jpeg', 'webp'].includes(targetFormat.toLowerCase())) {
      res.status(400).json({ error: 'Invalid target format. Use: png, jpg, jpeg, or webp' });
      return;
    }

    const outputPath = await convertImage(req.file.path, targetFormat.toLowerCase());
    const fileId = generateId();
    
    // Schedule cleanup for both input and output files
    scheduleCleanup(req.file.path, 30); // 30 minutes
    scheduleCleanup(outputPath, 30);
    
    res.json({
      id: fileId,
      downloadUrl: `/api/files/${path.basename(outputPath)}`,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ 
      error: 'Image conversion failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/blur - Apply blur effect
router.post('/blur', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { radius = 0, sigma = 4 } = req.body;
    const radiusNum = parseInt(radius, 10);
    const sigmaNum = parseInt(sigma, 10);

    if (isNaN(radiusNum) || isNaN(sigmaNum) || radiusNum < 0 || radiusNum > 50 || sigmaNum < 1 || sigmaNum > 10) {
      res.status(400).json({ 
        error: 'Invalid blur parameters. Radius: 0-50, Sigma: 1-10' 
      });
      return;
    }

    const outputPath = await blurImage(req.file.path, radiusNum, sigmaNum);
    const fileId = generateId();
    
    // Schedule cleanup for both input and output files
    scheduleCleanup(req.file.path, 30); // 30 minutes
    scheduleCleanup(outputPath, 30);
    
    res.json({
      id: fileId,
      downloadUrl: `/api/files/${path.basename(outputPath)}`,
      originalName: req.file.originalname,
      size: req.file.size,
      blurSettings: { radius: radiusNum, sigma: sigmaNum }
    });
  } catch (error) {
    console.error('Blur error:', error);
    res.status(500).json({ 
      error: 'Image blur failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/files/:filename - Download processed file
router.get('/files/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filePath = getFilePath(filename);
    
    if (!filePath) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(404).json({ error: 'File not found or expired' });
        }
      }
    });
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'File download failed' });
  }
});

export { router as imageRoutes }; 