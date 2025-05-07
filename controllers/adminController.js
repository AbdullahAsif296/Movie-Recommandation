import AdminService from '../services/adminService.js';

export async function addMovie(req, res) {
  try {
    const movie = await AdminService.addMovie(req.body, req.user._id);
    res.status(201).json(movie);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export async function updateMovie(req, res) {
  try {
    const { movieId } = req.params;
    const movie = await AdminService.updateMovie(movieId, req.body, req.user._id);
    res.json(movie);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export async function deleteMovie(req, res) {
  try {
    const { movieId } = req.params;
    const result = await AdminService.deleteMovie(movieId, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export async function moderateReview(req, res) {
  try {
    const { reviewId, action } = req.body;
    const result = await AdminService.moderateReview(reviewId, action, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const stats = await AdminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getTrendingData(req, res) {
  try {
    const { period } = req.query;
    const trends = await AdminService.getTrendingData(period);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMovies(req, res) {
  try {
    const { genre, year } = req.query;
    const filters = {};
    
    if (genre) filters.genre = genre;
    if (year) filters.releaseYear = parseInt(year);

    const movies = await AdminService.getMovies(req.pagination, filters);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAdminLogs(req, res) {
  try {
    const { action, entityType, startDate, endDate } = req.query;
    const filters = { action, entityType, startDate, endDate };

    const logs = await AdminService.getAdminLogs(req.pagination, filters);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 