import BoxOfficeService from '../services/boxOfficeService.js';

export const updateBoxOffice = async (req, res) => {
  try {
    const { movieId } = req.params;
    const boxOffice = await BoxOfficeService.updateBoxOffice(movieId, req.body);
    res.json(boxOffice);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getMovieBoxOffice = async (req, res) => {
  try {
    const { movieId } = req.params;
    const boxOffice = await BoxOfficeService.getMovieBoxOffice(movieId);
    res.json(boxOffice);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTopGrossing = async (req, res) => {
  try {
    const { limit, type } = req.query;
    const movies = await BoxOfficeService.getTopGrossing(limit, type);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWeeklyEarnings = async (req, res) => {
  try {
    const { movieId } = req.params;
    const boxOffice = await BoxOfficeService.updateWeeklyEarnings(movieId, req.body);
    res.json(boxOffice);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}; 