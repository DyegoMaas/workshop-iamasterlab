"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const imageProcessor_1 = require("../services/imageProcessor");
const fileStore_1 = require("../services/fileStore");
const router = express_1.default.Router();
exports.imageRoutes = router;
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const tmpDir = path_1.default.join(process.cwd(), 'tmp', 'magick');
            cb(null, tmpDir);
        },
        filename: (req, file, cb) => {
            const id = generateId();
            const ext = path_1.default.extname(file.originalname);
            cb(null, `input-${id}${ext}`);
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const isValid = (0, imageProcessor_1.validateImageFile)(file);
        if (isValid) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed.'));
        }
    }
});
router.post('/convert', upload.single('file'), async (req, res, next) => {
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
        const outputPath = await (0, imageProcessor_1.convertImage)(req.file.path, targetFormat.toLowerCase());
        const fileId = generateId();
        (0, fileStore_1.scheduleCleanup)(req.file.path, 30);
        (0, fileStore_1.scheduleCleanup)(outputPath, 30);
        res.json({
            id: fileId,
            downloadUrl: `/api/files/${path_1.default.basename(outputPath)}`,
            originalName: req.file.originalname,
            size: req.file.size
        });
    }
    catch (error) {
        console.error('Convert error:', error);
        res.status(500).json({
            error: 'Image conversion failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/blur', upload.single('file'), async (req, res, next) => {
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
        const outputPath = await (0, imageProcessor_1.blurImage)(req.file.path, radiusNum, sigmaNum);
        const fileId = generateId();
        (0, fileStore_1.scheduleCleanup)(req.file.path, 30);
        (0, fileStore_1.scheduleCleanup)(outputPath, 30);
        res.json({
            id: fileId,
            downloadUrl: `/api/files/${path_1.default.basename(outputPath)}`,
            originalName: req.file.originalname,
            size: req.file.size,
            blurSettings: { radius: radiusNum, sigma: sigmaNum }
        });
    }
    catch (error) {
        console.error('Blur error:', error);
        res.status(500).json({
            error: 'Image blur failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/sharpen', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const { sigma = 1.0 } = req.body;
        const sigmaNum = parseFloat(sigma);
        if (isNaN(sigmaNum) || sigmaNum < 0.1 || sigmaNum > 3.0) {
            res.status(400).json({
                error: 'Invalid sharpen parameters. Sigma: 0.1-3.0'
            });
            return;
        }
        const outputPath = await (0, imageProcessor_1.sharpenImage)(req.file.path, sigmaNum);
        const fileId = generateId();
        (0, fileStore_1.scheduleCleanup)(req.file.path, 30);
        (0, fileStore_1.scheduleCleanup)(outputPath, 30);
        res.json({
            id: fileId,
            downloadUrl: `/api/files/${path_1.default.basename(outputPath)}`,
            originalName: req.file.originalname,
            size: req.file.size,
            sharpenSettings: { sigma: sigmaNum }
        });
    }
    catch (error) {
        console.error('Sharpen error:', error);
        res.status(500).json({
            error: 'Image sharpen failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = (0, fileStore_1.getFilePath)(filename);
        if (!filePath) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
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
    }
    catch (error) {
        console.error('File download error:', error);
        res.status(500).json({ error: 'File download failed' });
    }
});
