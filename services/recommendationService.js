import Movie from '../models/movieModel.js';
import Rating from '../models/ratingModel.js';
import Profile from '../models/profileModel.js';

export class RecommendationService {
  // Get similar movies based on genre and director
  static async getSimilarMovies(movieId, limit = 5) {
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) return [];

      return await Movie.find({
        _id: { $ne: movieId },
        $or: [
          { genre: { $in: movie.genre } },
          { director: movie.director }
        ]
      })
      .sort({ averageRating: -1 })
      .limit(limit);
    } catch (error) {
      console.error('Error getting similar movies:', error);
      return [];
    }
  }

  // Get personalized recommendations based on user preferences
  static async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      // Get user profile and ratings
      const userProfile = await Profile.findOne({ user: userId });
      const userRatings = await Rating.find({ user: userId });

      // Get user's favorite genres
      const favoriteGenres = userProfile?.favoriteGenres || [];
      
      // Get highly rated movies by user
      const highlyRatedMovieIds = userRatings
        .filter(rating => rating.rating >= 4)
        .map(rating => rating.movie);

      // Find similar users based on rating patterns
      const similarUsers = await this.findSimilarUsers(userId, userRatings);

      // Get movies rated highly by similar users
      const similarUserRatings = await Rating.find({
        user: { $in: similarUsers },
        rating: { $gte: 4 }
      });

      // Combine all factors for recommendations
      const recommendations = await Movie.find({
        $and: [
          { _id: { $nin: userRatings.map(r => r.movie) } }, // Exclude already rated movies
          {
            $or: [
              { genre: { $in: favoriteGenres } },
              { _id: { $in: similarUserRatings.map(r => r.movie) } }
            ]
          }
        ]
      })
      .sort({ averageRating: -1 })
      .limit(limit);

      return recommendations;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  // Find similar users based on rating patterns
  static async findSimilarUsers(userId, userRatings, limit = 5) {
    try {
      const similarUsers = await Rating.aggregate([
        // Match ratings for movies that the current user has rated
        { $match: { movie: { $in: userRatings.map(r => r.movie) } } },
        // Group by user
        {
          $group: {
            _id: '$user',
            commonRatings: { $push: { movie: '$movie', rating: '$rating' } }
          }
        },
        // Filter out the current user
        { $match: { _id: { $ne: userId } } },
        // Calculate similarity score
        {
          $addFields: {
            similarityScore: {
              $reduce: {
                input: '$commonRatings',
                initialValue: 0,
                in: {
                  $add: [
                    '$$value',
                    {
                      $abs: {
                        $subtract: [
                          '$$this.rating',
                          {
                            $arrayElemAt: [
                              userRatings.map(r => r.rating),
                              { $indexOfArray: [userRatings.map(r => r.movie), '$$this.movie'] }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        // Sort by similarity score
        { $sort: { similarityScore: 1 } },
        // Limit results
        { $limit: limit }
      ]);

      return similarUsers.map(user => user._id);
    } catch (error) {
      console.error('Error finding similar users:', error);
      return [];
    }
  }

  // Get trending movies based on recent activity
  static async getTrendingMovies(limit = 10, days = 7) {
    try {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - days);

      const trendingMovies = await Rating.aggregate([
        // Match recent ratings
        { $match: { createdAt: { $gte: recentDate } } },
        // Group by movie
        {
          $group: {
            _id: '$movie',
            ratingCount: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        // Calculate trending score (rating count * average rating)
        {
          $addFields: {
            trendingScore: { $multiply: ['$ratingCount', '$averageRating'] }
          }
        },
        // Sort by trending score
        { $sort: { trendingScore: -1 } },
        // Limit results
        { $limit: limit },
        // Lookup movie details
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movieDetails'
          }
        },
        // Unwind movie details
        { $unwind: '$movieDetails' },
        // Project final format
        {
          $project: {
            _id: '$movieDetails._id',
            title: '$movieDetails.title',
            genre: '$movieDetails.genre',
            averageRating: 1,
            ratingCount: 1
          }
        }
      ]);

      return trendingMovies;
    } catch (error) {
      console.error('Error getting trending movies:', error);
      return [];
    }
  }

  // Get top rated movies
  static async getTopRatedMovies(limit = 10, minRatings = 5) {
    try {
      const topRated = await Rating.aggregate([
        // Group by movie
        {
          $group: {
            _id: '$movie',
            ratingCount: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        // Filter movies with minimum number of ratings
        { $match: { ratingCount: { $gte: minRatings } } },
        // Sort by average rating
        { $sort: { averageRating: -1 } },
        // Limit results
        { $limit: limit },
        // Lookup movie details
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movieDetails'
          }
        },
        // Unwind movie details
        { $unwind: '$movieDetails' },
        // Project final format
        {
          $project: {
            _id: '$movieDetails._id',
            title: '$movieDetails.title',
            genre: '$movieDetails.genre',
            averageRating: 1,
            ratingCount: 1
          }
        }
      ]);

      return topRated;
    } catch (error) {
      console.error('Error getting top rated movies:', error);
      return [];
    }
  }
} 