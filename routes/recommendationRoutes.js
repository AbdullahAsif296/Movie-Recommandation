import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import {
  getSimilarMovies,
  getPersonalizedRecommendations,
  getTrendingMovies,
  getTopRatedMovies
} from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/movies/:movieId/similar', getSimilarMovies);
router.get('/recommendations', auth, getPersonalizedRecommendations);
router.get('/movies/trending', getTrendingMovies);
router.get('/movies/top-rated', getTopRatedMovies);

export default router; 