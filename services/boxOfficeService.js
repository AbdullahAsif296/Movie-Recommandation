import BoxOffice from "../models/boxOfficeModel.js";
import { NotFoundError } from "../utils/errors.js";

class BoxOfficeService {
  async updateBoxOffice(movieId, boxOfficeData) {
    try {
      const boxOffice = await BoxOffice.findOneAndUpdate(
        { movie: movieId },
        {
          ...boxOfficeData,
          lastUpdated: new Date(),
        },
        { new: true, upsert: true }
      );
      return boxOffice;
    } catch (error) {
      throw error;
    }
  }

  async getMovieBoxOffice(movieId) {
    const boxOffice = await BoxOffice.findOne({ movie: movieId });
    if (!boxOffice) {
      throw new NotFoundError("Box office data not found");
    }
    return boxOffice;
  }

  async getTopGrossing(limit = 10, type = "domestic") {
    const sortField = `totalEarnings.${type}.amount`;
    return BoxOffice.find()
      .sort({ [sortField]: -1 })
      .limit(limit)
      .populate("movie", "title releaseDate");
  }

  async updateWeeklyEarnings(movieId, weekData) {
    const boxOffice = await BoxOffice.findOne({ movie: movieId });
    if (!boxOffice) {
      throw new NotFoundError("Box office data not found");
    }

    boxOffice.weeklyEarnings.push(weekData);
    boxOffice.lastUpdated = new Date();
    return boxOffice.save();
  }
}

export default new BoxOfficeService();
