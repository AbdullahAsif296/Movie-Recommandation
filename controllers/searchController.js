import SearchService from '../services/searchService.js';

export const searchMovies = async (req, res) => {
  try {
    const results = await SearchService.searchMovies(req.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchByFilters = async (req, res) => {
  try {
    const results = await SearchService.searchByFilters(req.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopMovies = async (req, res) => {
  try {
    const { limit } = req.query;
    const topMovies = await SearchService.getTopMovies({ limit });
    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { limit } = req.query;
    const topMovies = await SearchService.getTopMovies({ genre, limit });
    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopMoviesByPeriod = async (req, res) => {
  try {
    const { period } = req.params;
    const { limit } = req.query;
    const topMovies = await SearchService.getTopMovies({ period, limit });
    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 