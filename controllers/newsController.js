import NewsService from '../services/newsService.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

export const createNews = async (req, res) => {
  try {
    const news = await NewsService.createNews(req.body, req.user._id);
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const publishNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await NewsService.publishNews(newsId, req.user._id);
    res.json(news);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page, limit } = req.query;
    const news = await NewsService.getNewsByCategory(category, page, limit);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const news = await NewsService.getLatestNews(page, limit);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await NewsService.getNewsById(newsId);
    res.json(news);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { content } = req.body;
    const news = await NewsService.addComment(newsId, req.user._id, content);
    res.json(news);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await NewsService.toggleLike(newsId, req.user._id);
    res.json(news);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}; 