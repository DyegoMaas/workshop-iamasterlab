"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = getFilePath;
exports.scheduleCleanup = scheduleCleanup;
exports.cleanupExpiredFiles = cleanupExpiredFiles;
exports.getTempDirectorySize = getTempDirectorySize;
exports.forceCleanupOldFiles = forceCleanupOldFiles;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const scheduledFiles = new Map();
function getFilePath(filename) {
    const tmpDir = path_1.default.join(process.cwd(), 'tmp', 'magick');
    const filePath = path_1.default.join(tmpDir, filename);
    if (!filePath.startsWith(tmpDir)) {
        return null;
    }
    if (!fs_1.default.existsSync(filePath)) {
        return null;
    }
    return filePath;
}
function scheduleCleanup(filePath, expirationMinutes) {
    const now = Date.now();
    const expiresAt = now + (expirationMinutes * 60 * 1000);
    const fileInfo = {
        path: filePath,
        scheduledAt: now,
        expiresAt: expiresAt
    };
    scheduledFiles.set(filePath, fileInfo);
}
function cleanupExpiredFiles() {
    const now = Date.now();
    let cleanedCount = 0;
    for (const [filePath, fileInfo] of scheduledFiles.entries()) {
        if (now >= fileInfo.expiresAt) {
            try {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    cleanedCount++;
                }
            }
            catch (error) {
                console.error(`Failed to delete file ${filePath}:`, error);
            }
            finally {
                scheduledFiles.delete(filePath);
            }
        }
    }
    return cleanedCount;
}
function getTempDirectorySize() {
    const tmpDir = path_1.default.join(process.cwd(), 'tmp', 'magick');
    let totalSize = 0;
    try {
        if (!fs_1.default.existsSync(tmpDir)) {
            return 0;
        }
        const files = fs_1.default.readdirSync(tmpDir);
        for (const file of files) {
            const filePath = path_1.default.join(tmpDir, file);
            const stat = fs_1.default.statSync(filePath);
            if (stat.isFile()) {
                totalSize += stat.size;
            }
        }
    }
    catch (error) {
        console.error('Error calculating temp directory size:', error);
    }
    return totalSize;
}
function forceCleanupOldFiles(maxAgeDays = 1) {
    const tmpDir = path_1.default.join(process.cwd(), 'tmp', 'magick');
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let cleanedCount = 0;
    try {
        if (!fs_1.default.existsSync(tmpDir)) {
            return 0;
        }
        const files = fs_1.default.readdirSync(tmpDir);
        for (const file of files) {
            const filePath = path_1.default.join(tmpDir, file);
            const stat = fs_1.default.statSync(filePath);
            if (stat.isFile() && (now - stat.mtime.getTime()) > maxAgeMs) {
                try {
                    fs_1.default.unlinkSync(filePath);
                    scheduledFiles.delete(filePath);
                    cleanedCount++;
                }
                catch (error) {
                    console.error(`Failed to delete old file ${filePath}:`, error);
                }
            }
        }
    }
    catch (error) {
        console.error('Error during force cleanup:', error);
    }
    return cleanedCount;
}
const CLEANUP_INTERVAL = 10 * 60 * 1000;
setInterval(() => {
    const cleaned = cleanupExpiredFiles();
    if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired files`);
    }
    const dirSize = getTempDirectorySize();
    const maxSize = 100 * 1024 * 1024;
    if (dirSize > maxSize) {
        const forcesCleaned = forceCleanupOldFiles(0.5);
        console.log(`⚠️  Directory size ${Math.round(dirSize / 1024 / 1024)}MB exceeded limit. Force cleaned ${forcesCleaned} files.`);
    }
}, CLEANUP_INTERVAL);
console.log(`🔄 File cleanup service started (interval: ${CLEANUP_INTERVAL / 1000}s)`);
