



import { RecommendationService } from '../services/recommendationService.js';
import { NotFoundError } from '../utils/errors.js';

export const getSimilarMovies = async (req, res) => {
  try {
    const { movieId } = req.params;
    const similarMovies = await RecommendationService.getSimilarMovies(movieId);
    res.json(similarMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendations = await RecommendationService.getPersonalizedRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingMovies = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const trendingMovies = await RecommendationService.getTrendingMovies(10, parseInt(days));
    res.json(trendingMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopRatedMovies = async (req, res) => {
  try {
    const topRated = await RecommendationService.getTopRatedMovies();
    res.json(topRated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

