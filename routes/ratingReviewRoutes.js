import express from "express";
import { auth } from "../middlewares/authMiddleware.js";
import {
  createUserReview,
  getUserReviews,
  updateUserReview,
  deleteUserReview,
  getReviewById,
  addRating,
  getMovieRatingStats,
  addReview,
  getMovieReviews,
  updateReview,
  likeReview,
  getReviewHighlights,
  getTopRatedReviews,
  getMovieDetails,
} from "../controllers/ratingReviewController.js";

const router = express.Router();

// User review routes
router.post("/users/:userId/reviews", auth, createUserReview);
router.get("/users/:userId/reviews", getUserReviews);
router.get("/reviews/:reviewId", getReviewById);
router.put("/users/:userId/reviews/:reviewId", auth, updateUserReview);
router.delete("/users/:userId/reviews/:reviewId", auth, deleteUserReview);

// New routes from Swagger documentation
router.post("/ratings", auth, addRating);
router.get("/movies/:movieId/rating", getMovieRatingStats);
router.post("/reviews", auth, addReview);
router.get("/movies/:movieId/reviews", getMovieReviews);
router.put("/reviews/:reviewId", auth, updateReview);

router.post("/reviews/:reviewId/like", auth, likeReview);
router.get("/reviews/highlights", getReviewHighlights);
router.get("/reviews/top-rated", getTopRatedReviews);

router.get("/movies/:movieId/details", getMovieDetails);

export default router;
