import express from 'express';
import { 
  searchMovies, 
  getTopMovies,
  getTopMoviesByGenre,
  getTopMoviesByPeriod,
  searchByFilters
} from '../controllers/searchController.js';

const router = express.Router();

// Basic search
router.get('/search', searchMovies);

// Advanced filters
router.get('/movies/filter', searchByFilters);

// Top movies routes
router.get('/movies/top', getTopMovies);
router.get('/movies/top/genre/:genre', getTopMoviesByGenre);
router.get('/movies/top/period/:period', getTopMoviesByPeriod);

export default router; 