import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  updateBoxOffice,
  getMovieBoxOffice,
  getTopGrossing,
  updateWeeklyEarnings
} from '../controllers/boxOfficeController.js';
import { validateBoxOfficeUpdate, validateWeeklyEarnings } from '../middlewares/boxOfficeValidation.js';

const router = express.Router();

// Box Office routes
router.put('/movies/:movieId/box-office', [auth, isAdmin, validateBoxOfficeUpdate], updateBoxOffice);
router.get('/movies/:movieId/box-office', getMovieBoxOffice);
router.get('/box-office/top-grossing', getTopGrossing);
router.post('/movies/:movieId/box-office/weekly', [auth, isAdmin, validateWeeklyEarnings], updateWeeklyEarnings);

export default router; 