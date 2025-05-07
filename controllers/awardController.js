import AwardService from '../services/awardService.js';

export const addAward = async (req, res) => {
  try {
    const award = await AwardService.addAward(req.body);
    res.status(201).json(award);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovieAwards = async (req, res) => {
  try {
    const { movieId } = req.params;
    const awards = await AwardService.getMovieAwards(movieId);
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPersonAwards = async (req, res) => {
  try {
    const { name } = req.params;
    const awards = await AwardService.getPersonAwards(name);
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAwardsByYear = async (req, res) => {
  try {
    const { year, organization } = req.query;
    const awards = await AwardService.getAwardsByYear(year, organization);
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 