import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  addMovie,
  updateMovie,
  deleteMovie,
  moderateReview,
  getDashboardStats,
  getTrendingData,
  getAdminLogs,
  getMovies
} from '../controllers/adminController.js';
import { paginationMiddleware } from '../middleware/paginationMiddleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(auth, isAdmin);

// Movie management
router.post('/movies', addMovie);
router.put('/movies/:movieId', updateMovie);
router.delete('/movies/:movieId', deleteMovie);

// Review moderation
router.post('/reviews/moderate', moderateReview);

// Dashboard and analytics
router.get('/dashboard/stats', auth, isAdmin, getDashboardStats);
router.get('/trending', getTrendingData);

// Admin logs
router.get('/logs', paginationMiddleware, getAdminLogs);

// Movie list
router.get('/movies', paginationMiddleware, getMovies);

export default router; 