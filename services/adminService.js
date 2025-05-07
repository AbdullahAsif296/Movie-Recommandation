import Movie from '../models/movieModel.js';
import Review from '../models/reviewModel.js';
import AdminLog from '../models/adminLogModel.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';
import { paginatedResponse } from '../utils/paginationUtils.js';

class AdminService {
  // Movie Management
  async addMovie(movieData, adminId) {
    try {
      const movie = new Movie(movieData);
      await movie.save();

      await this.logAdminAction(adminId, 'CREATE', 'MOVIE', movie._id, movieData);
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async updateMovie(movieId, movieData, adminId) {
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { $set: movieData },
      { new: true }
    );

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    await this.logAdminAction(adminId, 'UPDATE', 'MOVIE', movieId, movieData);
    return movie;
  }

  async deleteMovie(movieId, adminId) {
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    await this.logAdminAction(adminId, 'DELETE', 'MOVIE', movieId, { title: movie.title });
    return { message: 'Movie deleted successfully' };
  }

  // Review Moderation
  async moderateReview(reviewId, action, adminId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    switch (action) {
      case 'DELETE':
        await Review.deleteOne({ _id: reviewId });
        break;
      case 'HIDE':
        review.isHidden = true;
        await review.save();
        break;
      default:
        throw new Error('Invalid moderation action');
    }

    await this.logAdminAction(adminId, 'MODERATE', 'REVIEW', reviewId, { action });
    return { message: 'Review moderated successfully' };
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalMovies,
      activeUsers,
      totalReviews,
      genreStats,
      topRatedMovies
    ] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Review.countDocuments(),
      Movie.aggregate([
        { $unwind: '$genre' },
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Movie.find()
        .sort({ averageRating: -1 })
        .limit(10)
        .select('title averageRating')
    ]);

    return {
      totalMovies,
      activeUsers,
      totalReviews,
      mostPopularGenres: genreStats,
      topRatedMovies
    };
  }

  // Trending Analysis
  async getTrendingData(period = 'week') {
    const dateRange = this.getDateRangeForPeriod(period);

    const movieTrends = await Review.aggregate([
      { $match: { createdAt: { $gte: dateRange.start, $lte: dateRange.end } } },
      { $group: { _id: '$movie', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails'
        }
      }
    ]);

    return {
      period,
      trends: movieTrends.map(trend => ({
        name: trend.movieDetails[0]?.title,
        count: trend.count
      }))
    };
  }

  // Admin Logs
  async getAdminLogs({ skip, limit, page }, filters = {}) {
    try {
      const query = {};
      if (filters.action) query.action = filters.action;
      if (filters.entityType) query.entityType = filters.entityType;
      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const [logs, total] = await Promise.all([
        AdminLog.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .populate('admin', 'name'),
        AdminLog.countDocuments(query)
      ]);

      return paginatedResponse(logs, total, page, limit);
    } catch (error) {
      throw error;
    }
  }

  // Helper Methods
  async logAdminAction(adminId, action, entityType, entityId, details) {
    const log = new AdminLog({
      admin: adminId,
      action,
      entityType,
      entityId,
      details
    });
    await log.save();
  }

  getDateRangeForPeriod(period) {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setDate(start.getDate() - 7);
    }

    return { start, end };
  }

  // Example of paginated movie list
  async getMovies({ skip, limit, page }, filters = {}) {
    try {
      const query = { ...filters };
      
      const [movies, total] = await Promise.all([
        Movie.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('director', 'name'),
        Movie.countDocuments(query)
      ]);

      return paginatedResponse(movies, total, page, limit);
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService(); 