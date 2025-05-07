import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getUpcomingMoviesWithReminders,
  setMovieReminder,
  getUserNotifications,
  markNotificationAsRead,
  testEmail,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/movies/upcoming", auth, getUpcomingMoviesWithReminders);
router.post("/movies/:movieId/reminder", auth, setMovieReminder);
router.get("/notifications", auth, getUserNotifications);
router.patch("/notifications/:notificationId", auth, markNotificationAsRead);
router.post("/api/notifications/test-email", auth, testEmail);

export default router;
