import Movie from '../models/movieModel.js';
import Rating from '../models/ratingModel.js';

const SearchService = {
  async searchMovies(query) {
    const {
      searchTerm,
      genre,
      director,
      actor,
      yearFrom,
      yearTo,
      ratingFrom,
      ratingTo,
      language,
      country,
      keywords,
      sortBy = 'releaseDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    // Build search criteria
    const searchCriteria = {};
    
    if (searchTerm) {
      searchCriteria.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { synopsis: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (genre) {
      searchCriteria.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    if (director) {
      searchCriteria.director = { $regex: director, $options: 'i' };
    }

    if (actor) {
      searchCriteria.cast = { $regex: actor, $options: 'i' };
    }

    if (yearFrom || yearTo) {
      searchCriteria.releaseDate = {};
      if (yearFrom) searchCriteria.releaseDate.$gte = new Date(yearFrom, 0, 1);
      if (yearTo) searchCriteria.releaseDate.$lte = new Date(yearTo, 11, 31);
    }

    if (language) {
      searchCriteria.language = language;
    }

    if (country) {
      searchCriteria.country = country;
    }

    if (keywords) {
      const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
      searchCriteria.keywords = { $in: keywordArray };
    }

    if (ratingFrom || ratingTo) {
      searchCriteria.averageRating = {};
      if (ratingFrom) searchCriteria.averageRating.$gte = Number(ratingFrom);
      if (ratingTo) searchCriteria.averageRating.$lte = Number(ratingTo);
    }

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [movies, total] = await Promise.all([
      Movie.find(searchCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('director', 'name')
        .populate('cast', 'name'),
      Movie.countDocuments(searchCriteria)
    ]);

    return {
      movies,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  },

  async searchByFilters(query) {
    const {
      genre,
      yearFrom,
      yearTo,
      ratingFrom,
      ratingTo,
      language,
      country,
      keywords,
      sortBy = 'releaseDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const searchCriteria = {};

    if (genre) {
      searchCriteria.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }

    if (yearFrom || yearTo) {
      searchCriteria.releaseDate = {};
      if (yearFrom) searchCriteria.releaseDate.$gte = new Date(yearFrom, 0, 1);
      if (yearTo) searchCriteria.releaseDate.$lte = new Date(yearTo, 11, 31);
    }

    if (language) {
      searchCriteria.language = language;
    }

    if (country) {
      searchCriteria.country = country;
    }

    if (keywords) {
      const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
      searchCriteria.keywords = { $in: keywordArray };
    }

    if (ratingFrom || ratingTo) {
      searchCriteria.averageRating = {};
      if (ratingFrom) searchCriteria.averageRating.$gte = Number(ratingFrom);
      if (ratingTo) searchCriteria.averageRating.$lte = Number(ratingTo);
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [movies, total] = await Promise.all([
      Movie.find(searchCriteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('director', 'name')
        .populate('cast', 'name'),
      Movie.countDocuments(searchCriteria)
    ]);

    return {
      movies,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  },

  async getTopMovies(options) {
    const {
      period = 'month',
      genre,
      limit = 10
    } = options;

    const dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        dateFilter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const matchCriteria = {
      ...(Object.keys(dateFilter).length && { releaseDate: dateFilter }),
      ...(genre && { genre })
    };

    const topMovies = await Movie.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'movie',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$ratings.rating' },
          numberOfRatings: { $size: '$ratings' }
        }
      },
      {
        $match: {
          numberOfRatings: { $gte: 5 } // Minimum number of ratings
        }
      },
      {
        $sort: { averageRating: -1, numberOfRatings: -1 }
      },
      { $limit: parseInt(limit) }
    ]);

    return topMovies;
  }
};

export default SearchService; 