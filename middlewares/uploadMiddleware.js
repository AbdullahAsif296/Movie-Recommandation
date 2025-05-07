import multer from 'multer';
import path from 'path';
import { UPLOAD_PATHS, ensureDirectoryExists } from '../utils/fileUtils.js';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    // Determine upload path based on file type
    switch (file.fieldname) {
      case 'avatar':
        uploadPath = UPLOAD_PATHS.AVATARS;
        break;
      case 'poster':
        uploadPath = UPLOAD_PATHS.POSTERS;
        break;
      default:
        uploadPath = UPLOAD_PATHS.TEMP;
    }

    // Ensure directory exists
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}); 