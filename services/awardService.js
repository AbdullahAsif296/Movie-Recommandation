import { Award } from '../models/awardModel.js';

class AwardService {
  async addAward(awardData) {
    try {
      const award = new Award(awardData);
      await award.save();
      return award;
    } catch (error) {
      throw error;
    }
  }

  async getMovieAwards(movieId) {
    return Award.find({ movie: movieId })
      .sort({ year: -1, organization: 1 });
  }

  async getPersonAwards(personName) {
    return Award.find({ 'person.name': personName })
      .sort({ year: -1, organization: 1 })
      .populate('movie', 'title releaseDate');
  }

  async getAwardsByYear(year, organization) {
    const query = { year };
    if (organization) {
      query.organization = organization;
    }
    return Award.find(query)
      .sort({ organization: 1, category: 1 })
      .populate('movie', 'title');
  }

  async getAwardWinners(year, organization) {
    return Award.find({
      year,
      organization,
      type: 'WINNER'
    })
      .sort({ category: 1 })
      .populate('movie', 'title');
  }
}

export default new AwardService(); 