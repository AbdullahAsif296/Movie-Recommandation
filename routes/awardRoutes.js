import express from 'express';
import { auth, isAdmin } from '../middlewares/authMiddleware.js';
import {
  addAward,
  getMovieAwards,
  getPersonAwards,
  getAwardsByYear
} from '../controllers/awardController.js';

const router = express.Router();

router.get('/movies/:movieId/awards', getMovieAwards);
router.get('/persons/:name/awards', getPersonAwards);
router.get('/awards', getAwardsByYear);

// Admin routes
router.post('/awards', [auth, isAdmin], addAward);

export default router; 