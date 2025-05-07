import { NewsArticle } from '../models/newsArticleModel.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';

class NewsArticleService {
  async createArticle(articleData, userId) {
    const article = new NewsArticle({
      ...articleData,
      author: userId
    });
    await article.save();
    return article.populate('author', 'name');
  }

  async getArticlesByCategory(category, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [articles, total] = await Promise.all([
      NewsArticle.find({ category })
        .sort({ publicationDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name'),
      NewsArticle.countDocuments({ category })
    ]);

    return {
      articles,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  async getRecentArticles(limit = 10) {
    return NewsArticle.find()
      .sort({ publicationDate: -1 })
      .limit(limit)
      .populate('author', 'name');
  }

  async updateArticle(articleId, updateData, userId, isAdmin) {
    const article = await NewsArticle.findById(articleId);
    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (article.author.toString() !== userId && !isAdmin) {
      throw new UnauthorizedError('Not authorized to update this article');
    }

    Object.assign(article, updateData);
    await article.save();
    return article.populate('author', 'name');
  }

  async deleteArticle(articleId, userId, isAdmin) {
    const article = await NewsArticle.findById(articleId);
    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (article.author.toString() !== userId && !isAdmin) {
      throw new UnauthorizedError('Not authorized to delete this article');
    }

    await NewsArticle.deleteOne({ _id: articleId });
    return { message: 'Article deleted successfully' };
  }
}

export default new NewsArticleService(); 