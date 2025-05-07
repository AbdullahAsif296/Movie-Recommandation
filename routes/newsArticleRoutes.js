import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createArticle,
  getArticlesByCategory,
  getRecentArticles,
  updateArticle,
  deleteArticle
} from '../controllers/newsArticleController.js';

const router = express.Router();

router.post('/articles', auth, createArticle);
router.get('/articles/category/:category', getArticlesByCategory);
router.get('/articles/recent', getRecentArticles);
router.put('/articles/:articleId', auth, updateArticle);
router.delete('/articles/:articleId', auth, deleteArticle);

export default router; 