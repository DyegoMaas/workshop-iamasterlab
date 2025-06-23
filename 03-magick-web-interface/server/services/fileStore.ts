import fs from 'fs';
import path from 'path';

interface ScheduledFile {
  path: string;
  scheduledAt: number;
  expiresAt: number;
}

// In-memory store for scheduled file cleanup
const scheduledFiles: Map<string, ScheduledFile> = new Map();

export function getFilePath(filename: string): string | null {
  const tmpDir = path.join(process.cwd(), 'tmp', 'magick');
  const filePath = path.join(tmpDir, filename);
  
  // Security check: ensure file is within temp directory
  if (!filePath.startsWith(tmpDir)) {
    return null;
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return filePath;
}

export function scheduleCleanup(filePath: string, expirationMinutes: number): void {
  const now = Date.now();
  const expiresAt = now + (expirationMinutes * 60 * 1000);
  
  const fileInfo: ScheduledFile = {
    path: filePath,
    scheduledAt: now,
    expiresAt: expiresAt
  };
  
  scheduledFiles.set(filePath, fileInfo);
}

export function cleanupExpiredFiles(): number {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [filePath, fileInfo] of scheduledFiles.entries()) {
    if (now >= fileInfo.expiresAt) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      } catch (error) {
        console.error(`Failed to delete file ${filePath}:`, error);
      } finally {
        scheduledFiles.delete(filePath);
      }
    }
  }
  
  return cleanedCount;
}

export function getTempDirectorySize(): number {
  const tmpDir = path.join(process.cwd(), 'tmp', 'magick');
  let totalSize = 0;
  
  try {
    if (!fs.existsSync(tmpDir)) {
      return 0;
    }
    
    const files = fs.readdirSync(tmpDir);
    for (const file of files) {
      const filePath = path.join(tmpDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        totalSize += stat.size;
      }
    }
  } catch (error) {
    console.error('Error calculating temp directory size:', error);
  }
  
  return totalSize;
}

export function forceCleanupOldFiles(maxAgeDays: number = 1): number {
  const tmpDir = path.join(process.cwd(), 'tmp', 'magick');
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let cleanedCount = 0;
  
  try {
    if (!fs.existsSync(tmpDir)) {
      return 0;
    }
    
    const files = fs.readdirSync(tmpDir);
    for (const file of files) {
      const filePath = path.join(tmpDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (now - stat.mtime.getTime()) > maxAgeMs) {
        try {
          fs.unlinkSync(filePath);
          scheduledFiles.delete(filePath);
          cleanedCount++;
        } catch (error) {
          console.error(`Failed to delete old file ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error during force cleanup:', error);
  }
  
  return cleanedCount;
}

// Start periodic cleanup (every 10 minutes)
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

setInterval(() => {
  const cleaned = cleanupExpiredFiles();
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired files`);
  }
  
  // Check directory size and force cleanup if > 100MB
  const dirSize = getTempDirectorySize();
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  if (dirSize > maxSize) {
    const forcesCleaned = forceCleanupOldFiles(0.5); // Clean files older than 12 hours
    console.log(`⚠️  Directory size ${Math.round(dirSize / 1024 / 1024)}MB exceeded limit. Force cleaned ${forcesCleaned} files.`);
  }
}, CLEANUP_INTERVAL);

console.log(`🔄 File cleanup service started (interval: ${CLEANUP_INTERVAL / 1000}s)`); 