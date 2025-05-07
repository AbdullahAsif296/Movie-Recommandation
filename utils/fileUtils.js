import fs from 'fs';
import path from 'path';

export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Define upload paths
export const UPLOAD_PATHS = {
  AVATARS: 'uploads/avatars',
  MOVIES: 'uploads/movies',
  POSTERS: 'uploads/posters',
  TEMP: 'uploads/temp'
};

// Create all required directories
Object.values(UPLOAD_PATHS).forEach(path => ensureDirectoryExists(path)); 