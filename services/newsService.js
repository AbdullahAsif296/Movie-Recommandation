import News from '../models/newsModel.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';

class NewsService {
  async createNews(newsData, authorId) {
    try {
      const news = new News({
        ...newsData,
        author: authorId,
        status: 'DRAFT'
      });

      await news.save();
      return news;
    } catch (error) {
      throw error;
    }
  }

  async publishNews(newsId, authorId) {
    const news = await News.findOne({ _id: newsId, author: authorId });
    if (!news) {
      throw new NotFoundError('News article not found');
    }

    news.status = 'PUBLISHED';
    news.publishDate = new Date();
    await news.save();
    return news;
  }

  async getNewsByCategory(category, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find({
        category,
        status: 'PUBLISHED'
      })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .populate('relatedMovies', 'title releaseDate'),
      News.countDocuments({
        category,
        status: 'PUBLISHED'
      })
    ]);

    return {
      news,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  async getLatestNews(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find({ status: 'PUBLISHED' })
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .populate('relatedMovies', 'title releaseDate'),
      News.countDocuments({ status: 'PUBLISHED' })
    ]);

    return {
      news,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  async getNewsById(newsId) {
    const news = await News.findOneAndUpdate(
      { _id: newsId, status: 'PUBLISHED' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name')
      .populate('relatedMovies', 'title releaseDate')
      .populate('comments.user', 'name');

    if (!news) {
      throw new NotFoundError('News article not found');
    }

    return news;
  }

  async addComment(newsId, userId, content) {
    const news = await News.findById(newsId);
    if (!news) {
      throw new NotFoundError('News article not found');
    }

    news.comments.push({
      user: userId,
      content
    });

    await news.save();
    return news;
  }

  async toggleLike(newsId, userId) {
    const news = await News.findById(newsId);
    if (!news) {
      throw new NotFoundError('News article not found');
    }

    const likeIndex = news.likes.indexOf(userId);
    if (likeIndex === -1) {
      news.likes.push(userId);
    } else {
      news.likes.splice(likeIndex, 1);
    }

    await news.save();
    return news;
  }

  async getRelatedNews(movieId, limit = 5) {
    return News.find({
      relatedMovies: movieId,
      status: 'PUBLISHED'
    })
      .sort({ publishDate: -1 })
      .limit(limit)
      .populate('author', 'name');
  }
}

export default new NewsService(); 