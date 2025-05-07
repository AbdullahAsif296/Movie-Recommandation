import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createNews,
  publishNews,
  getNewsByCategory,
  getLatestNews,
  getNewsById,
  addComment,
  toggleLike
} from '../controllers/newsController.js';

const router = express.Router();

// Public routes
router.get('/news/latest', getLatestNews);
router.get('/news/category/:category', getNewsByCategory);
router.get('/news/:newsId', getNewsById);

// Protected routes
router.post('/news', [auth, isAdmin], createNews);
router.patch('/news/:newsId/publish', [auth, isAdmin], publishNews);
router.post('/news/:newsId/comments', auth, addComment);
router.post('/news/:newsId/like', auth, toggleLike);

export default router; 