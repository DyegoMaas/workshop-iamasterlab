"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageFile = validateImageFile;
exports.convertImage = convertImage;
exports.blurImage = blurImage;
exports.sharpenImage = sharpenImage;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
];
function validateImageFile(file) {
    const ext = path_1.default.extname(file.originalname).toLowerCase().slice(1);
    return ALLOWED_FORMATS.includes(ext) && ALLOWED_MIME_TYPES.includes(file.mimetype);
}
async function convertImage(inputPath, targetFormat) {
    if (!ALLOWED_FORMATS.includes(targetFormat)) {
        throw new Error(`Unsupported target format: ${targetFormat}`);
    }
    const outputId = generateId();
    const outputPath = path_1.default.join(path_1.default.dirname(inputPath), `output-${outputId}.${targetFormat}`);
    try {
        await execFileAsync('magick', [
            inputPath,
            '-limit', 'memory', '256MB',
            '-limit', 'time', '60',
            outputPath
        ], {
            timeout: 60000,
            cwd: path_1.default.dirname(inputPath)
        });
        if (!fs_1.default.existsSync(outputPath)) {
            throw new Error('Output file was not created');
        }
        return outputPath;
    }
    catch (error) {
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
        if (error instanceof Error) {
            throw new Error(`Image conversion failed: ${error.message}`);
        }
        throw new Error('Image conversion failed: Unknown error');
    }
}
async function blurImage(inputPath, radius, sigma) {
    if (radius < 0 || radius > 50) {
        throw new Error('Radius must be between 0 and 50');
    }
    if (sigma < 1 || sigma > 10) {
        throw new Error('Sigma must be between 1 and 10');
    }
    const outputId = generateId();
    const outputPath = path_1.default.join(path_1.default.dirname(inputPath), `blur-${outputId}.png`);
    try {
        await execFileAsync('magick', [
            inputPath,
            '-limit', 'memory', '256MB',
            '-limit', 'time', '60',
            '-blur', `${radius}x${sigma}`,
            outputPath
        ], {
            timeout: 60000,
            cwd: path_1.default.dirname(inputPath)
        });
        if (!fs_1.default.existsSync(outputPath)) {
            throw new Error('Output file was not created');
        }
        return outputPath;
    }
    catch (error) {
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
        if (error instanceof Error) {
            throw new Error(`Image blur failed: ${error.message}`);
        }
        throw new Error('Image blur failed: Unknown error');
    }
}
async function sharpenImage(inputPath, sigma) {
    if (sigma < 0.1 || sigma > 3.0) {
        throw new Error('Sigma must be between 0.1 and 3.0');
    }
    const outputId = generateId();
    const outputPath = path_1.default.join(path_1.default.dirname(inputPath), `sharpen-${outputId}.png`);
    try {
        await execFileAsync('magick', [
            inputPath,
            '-limit', 'memory', '256MB',
            '-limit', 'time', '60',
            '-sharpen', `0x${sigma}`,
            outputPath
        ], {
            timeout: 60000,
            cwd: path_1.default.dirname(inputPath)
        });
        if (!fs_1.default.existsSync(outputPath)) {
            throw new Error('Output file was not created');
        }
        return outputPath;
    }
    catch (error) {
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
        if (error instanceof Error) {
            throw new Error(`Image sharpen failed: ${error.message}`);
        }
        throw new Error('Image sharpen failed: Unknown error');
    }
}
