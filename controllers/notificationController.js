import NotificationService from '../services/notificationService.js';
import Movie from '../models/movieModel.js';
import Notification from '../models/notificationModel.js';

export const getUpcomingMovies = async (req, res) => {
  try {
    const now = new Date();
    const threeMonthsFromNow = new Date(now.setMonth(now.getMonth() + 3));

    const upcomingMovies = await Movie.find({
      releaseDate: {
        $gt: now,
        $lt: threeMonthsFromNow
      }
    }).sort({ releaseDate: 1 });

    res.json(upcomingMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setReleaseReminder = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const notification = await NotificationService.createReleaseReminder(
      userId,
      movieId,
      movie.releaseDate
    );

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('movie', 'title releaseDate');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingMoviesWithReminders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;

    const movies = await NotificationService.getUpcomingMoviesWithReminders(
      userId,
      page,
      limit
    );

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setMovieReminder = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { reminderType } = req.body;
    const userId = req.user.id;

    if (!['RELEASE_REMINDER', 'TRAILER_RELEASE'].includes(reminderType)) {
      return res.status(400).json({ message: 'Invalid reminder type' });
    }

    const notification = await NotificationService.setMovieReminder(
      userId,
      movieId,
      reminderType
    );

    res.status(201).json(notification);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const testEmail = async (req, res) => {
  try {
    const testResult = await NotificationService.sendTestEmail(req.user.id);
    res.json({ message: 'Test email sent successfully', result: testResult });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
}; 