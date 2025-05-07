import Rating from '../models/ratingModel.js';
import Review from '../models/reviewModel.js';
import Movie from '../models/movieModel.js';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/errors.js';

// Rating Controllers
export const addRating = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Check if user has already rated
    let userRating = await Rating.findOne({ user: userId, movie: movieId });
    
    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = await Rating.create({
        user: userId,
        movie: movieId,
        rating
      });
    }

    // Update movie's average rating
    const ratings = await Rating.find({ movie: movieId });
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    
    await Movie.findByIdAndUpdate(movieId, { averageRating });

    res.status(200).json({ message: 'Rating added successfully', rating: userRating });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Review Controllers
export const addReview = async (req, res) => {
  try {
    const { movieId, reviewText } = req.body;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({ user: userId, movie: movieId });
    if (existingReview) {
      throw new BadRequestError('You have already reviewed this movie');
    }

    const review = await Review.create({
      user: userId,
      movie: movieId,
      reviewText
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reviewText } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user.toString() !== userId.toString()) {
      throw new UnauthorizedError('You can only update your own reviews');
    }

    review.reviewText = reviewText;
    review.updatedAt = Date.now();
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    review.likes += 1;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name')
      .sort({ likes: -1, createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getReviewHighlights = async (req, res) => {
  try {
    // Get top-rated reviews (most likes)
    const topRated = await Review.find()
      .populate({
        path: 'user',
        select: 'name avatar'
      })
      .populate({
        path: 'movie',
        select: 'title genre coverPhotos'
      })
      .sort({ likes: -1 })
      .limit(5);

    // Get most recent reviews
    const mostRecent = await Review.find()
      .populate({
        path: 'user',
        select: 'name avatar'
      })
      .populate({
        path: 'movie',
        select: 'title genre coverPhotos'
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      topRated,
      mostRecent
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get movie rating
export const getMovieRating = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie exists and get movie details
    const movie = await Movie.findById(movieId)
      .select('title'); // Select specific fields we want

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Get all ratings for the movie
    const ratings = await Rating.find({ movie: movieId });
    
    // Calculate statistics
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings 
      : 0;

    // Calculate rating distribution
    const distribution = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      movie: {
        _id: movie._id,
        title: movie.title,
        genre: movie.genre,
        releaseDate: movie.releaseDate,
        ageRating: movie.ageRating
      },
      ratings: {
        average: Number(averageRating.toFixed(1)), // Round to 1 decimal place
        total: totalRatings,
        distribution
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get comprehensive movie details including ratings and reviews
export const getMovieDetails = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Get movie details with director and cast
    const movie = await Movie.findById(movieId)
      .populate('director', 'name role')
      .populate('cast', 'name role');

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Get ratings
    const ratings = await Rating.find({ movie: movieId });
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    ratings.forEach(rating => {
      distribution[rating.rating]++;
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
      : 0;

    // Get reviews with user details
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name')
      .select('user reviewText likes createdAt')
      .sort({ likes: -1, createdAt: -1 });

    // Construct response object
    const response = {
      movie: {
        _id: movie._id,
        title: movie.title,
        director: movie.director ? {
          _id: movie.director._id,
          name: movie.director.name,
          role: movie.director.role
        } : null,
        cast: movie.cast.map(member => ({
          _id: member._id,
          name: member.name,
          role: member.role
        }))
      },
      ratings: {
        average: Number(averageRating.toFixed(1)),
        total: totalRatings,
        distribution
      },
      reviews: reviews.map(review => ({
        _id: review._id,
        user: {
          _id: review.user._id,
          name: review.user.name
        },
        reviewText: review.reviewText,
        likes: review.likes,
        createdAt: review.createdAt
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ user: userId })
      .populate({
        path: 'movie',
        select: 'title genre releaseDate coverPhotos'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId })
      .populate({
        path: 'movie',
        select: 'title genre releaseDate coverPhotos'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get most discussed reviews
export const getMostDiscussedReviews = async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movie'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$movie'
      },
      {
        $project: {
          'user.password': 0,
          'user.email': 0
        }
      },
      {
        $sort: { likes: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get top rated reviews
export const getTopRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'name avatar'
      })
      .populate({
        path: 'movie',
        select: 'title genre coverPhotos averageRating'
      })
      .sort({ likes: -1 })
      .limit(10);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Create a review by specific user
export const createUserReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { movieId, reviewText } = req.body;

    // Check if user is authorized to create review
    if (req.user._id.toString() !== userId) {
      throw new UnauthorizedError('You can only create reviews for yourself');
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ 
      user: userId, 
      movie: movieId 
    });
    
    if (existingReview) {
      throw new BadRequestError('You have already reviewed this movie');
    }

    const review = await Review.create({
      user: userId,
      movie: movieId,
      reviewText
    });

    // Populate user and movie details
    await review.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'movie', select: 'title genre coverPhotos' }
    ]);

    res.status(201).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get a specific review by ID
export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId)
      .populate('user', 'name avatar')
      .populate('movie', 'title genre coverPhotos');

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Update user's review
export const updateUserReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;
    const { reviewText } = req.body;

    // Check if user is authorized
    if (req.user._id.toString() !== userId) {
      throw new UnauthorizedError('You can only update your own reviews');
    }

    const review = await Review.findOne({ 
      _id: reviewId, 
      user: userId 
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    review.reviewText = reviewText;
    review.updatedAt = Date.now();
    await review.save();

    await review.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'movie', select: 'title genre coverPhotos' }
    ]);

    res.status(200).json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Delete user's review
export const deleteUserReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params;

    // Check if user is authorized
    if (req.user._id.toString() !== userId) {
      throw new UnauthorizedError('You can only delete your own reviews');
    }

    const review = await Review.findOneAndDelete({ 
      _id: reviewId, 
      user: userId 
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    res.status(200).json({ 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Add new controller methods from Swagger documentation
export const getMovieRatingStats = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    const ratings = await Rating.find({ movie: movieId });

    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    ratings.forEach(rating => {
      distribution[rating.rating]++;
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
      : 0;

    res.status(200).json({
      movieId: movie._id,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
      distribution
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

