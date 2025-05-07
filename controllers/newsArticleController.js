import NewsArticleService from '../services/newsArticleService.js';

export const createArticle = async (req, res) => {
  try {
    const article = await NewsArticleService.createArticle(req.body, req.user.id);
    res.status(201).json(article);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getArticlesByCategory = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const articles = await NewsArticleService.getArticlesByCategory(
      req.params.category,
      page,
      limit
    );
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentArticles = async (req, res) => {
  try {
    const { limit } = req.query;
    const articles = await NewsArticleService.getRecentArticles(limit);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await NewsArticleService.updateArticle(
      req.params.articleId,
      req.body,
      req.user.id,
      req.user.isAdmin
    );
    res.json(article);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const result = await NewsArticleService.deleteArticle(
      req.params.articleId,
      req.user.id,
      req.user.isAdmin
    );
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}; 