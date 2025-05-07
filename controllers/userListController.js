import Movie from "../models/movieModel.js";
import { UserList } from "../models/userListModel.js";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors.js";
import crypto from "crypto";

// Create a new list
export const createList = async (req, res) => {
  try {
    const { listName, description, isPublic } = req.body;
    const userId = req.user.id;

    // Check if list name already exists for user
    const existingList = await UserList.findOne({
      user: userId,
      listName: listName,
    });

    if (existingList) {
      throw new BadRequestError("List name already exists");
    }

    const newList = await UserList.create({
      user: userId,
      listName,
      description,
      isPublic,
      movies: [],
    });

    res.status(201).json(newList);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Add movie to list
export const addMovieToList = async (req, res) => {
  try {
    const { listName, movieName } = req.body;
    const userId = req.user.id;

    // Find the list
    const list = await UserList.findOne({
      user: userId,
      listName: listName || "WatchList",
    });

    if (!list) {
      throw new NotFoundError("List not found");
    }

    // Find the movie by name
    const movie = await Movie.findOne({
      title: new RegExp(movieName, "i"),
    });

    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    // Check if movie already exists in list
    if (list.hasMovie(movie._id)) {
      throw new BadRequestError("Movie already in list");
    }

    // Add movie to list
    list.addMovie(movie._id);
    await list.save();

    const updatedList = await UserList.findById(list._id).populate(
      "movies.movie",
      "title genre director releaseDate"
    );

    res.status(201).json(updatedList);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Remove movie from list
export const removeMovieFromList = async (req, res) => {
  try {
    const { listName, movieName } = req.params;
    const userId = req.user.id;

    const list = await UserList.findOne({
      user: userId,
      listName,
    });

    if (!list) {
      throw new NotFoundError("List not found");
    }

    const movie = await Movie.findOne({
      title: new RegExp(movieName, "i"),
    });

    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    list.removeMovie(movie._id);
    await list.save();

    res.status(200).json({ message: "Movie removed from list" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get user's lists
export const getUserLists = async (req, res) => {
  try {
    const userId = req.user.id;
    const lists = await UserList.find({ user: userId })
      .populate("movies.movie", "title genre director releaseDate")
      .populate("user", "name")
      .sort({ updatedAt: -1 });

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list details
export const getListDetails = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user._id;

    const list = await UserList.findOne({
      listName,
      $or: [{ user: userId }, { isPublic: true }],
    })
      .populate(
        "movies.movie",
        "title genre director releaseDate averageRating"
      )
      .populate("user", "name")
      .populate("followers", "name");

    if (!list) {
      throw new NotFoundError("List not found");
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Follow a list
export const followList = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user._id;

    const list = await UserList.findOne({ listName });
    if (!list) {
      throw new NotFoundError("List not found");
    }

    if (!list.isPublic) {
      throw new UnauthorizedError("Cannot follow private list");
    }

    if (list.followers.includes(userId)) {
      throw new BadRequestError("Already following this list");
    }

    list.followers.push(userId);
    await list.save();

    res.status(200).json({ message: "List followed successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get followed lists
export const getFollowedLists = async (req, res) => {
  try {
    const userId = req.user._id;
    const lists = await UserList.find({
      followers: userId,
      isPublic: true,
    })
      .populate("user", "name")
      .populate("movies.movie", "title genre director releaseDate")
      .sort({ updatedAt: -1 });

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update list details
export const updateList = async (req, res) => {
  try {
    const { listName } = req.params;
    const { newListName, description, isPublic } = req.body;
    const userId = req.user.id;

    // Find the list
    const list = await UserList.findOne({
      user: userId,
      listName,
    });

    if (!list) {
      throw new NotFoundError("List not found");
    }

    // Check if new list name already exists
    if (newListName && newListName !== listName) {
      const existingList = await UserList.findOne({
        user: userId,
        listName: newListName,
      });

      if (existingList) {
        throw new BadRequestError("List name already exists");
      }
      list.listName = newListName;
    }

    if (description !== undefined) list.description = description;
    if (isPublic !== undefined) list.isPublic = isPublic;

    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Delete list
export const deleteList = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user.id;

    // Prevent deletion of WatchList
    if (listName.toLowerCase() === "watchlist") {
      throw new BadRequestError("Cannot delete WatchList");
    }

    const list = await UserList.findOneAndDelete({
      user: userId,
      listName,
    });

    if (!list) {
      throw new NotFoundError("List not found");
    }

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get public lists
export const getPublicLists = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "updatedAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const query = {
      isPublic: true,
      ...(search && {
        $or: [
          { listName: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ],
      }),
    };

    const lists = await UserList.find(query)
      .populate("user", "name")
      .populate("movies.movie", "title genre director releaseDate")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await UserList.countDocuments(query);

    res.status(200).json({
      lists,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLists: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow list
export const unfollowList = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user._id;

    const list = await UserList.findOne({ listName });
    if (!list) {
      throw new NotFoundError("List not found");
    }

    if (!list.followers.includes(userId)) {
      throw new BadRequestError("Not following this list");
    }

    list.followers = list.followers.filter(
      (followerId) => followerId.toString() !== userId.toString()
    );
    await list.save();

    res.status(200).json({ message: "List unfollowed successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get list statistics
export const getListStats = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user._id;

    const list = await UserList.findOne({
      user: userId,
      listName,
    }).populate("movies.movie", "genre director releaseYear averageRating");

    if (!list) {
      throw new NotFoundError("List not found");
    }

    const stats = {
      totalMovies: list.movies.length,
      genres: {},
      directors: {},
      decades: {},
      averageRating: 0,
    };

    list.movies.forEach(({ movie }) => {
      // Count genres
      movie.genre.forEach((g) => {
        stats.genres[g] = (stats.genres[g] || 0) + 1;
      });

      // Count directors
      stats.directors[movie.director] =
        (stats.directors[movie.director] || 0) + 1;

      // Group by decades
      const decade = Math.floor(movie.releaseYear / 10) * 10;
      stats.decades[decade] = (stats.decades[decade] || 0) + 1;

      // Sum ratings
      stats.averageRating += movie.averageRating || 0;
    });

    // Calculate average rating
    stats.averageRating =
      stats.totalMovies > 0
        ? (stats.averageRating / stats.totalMovies).toFixed(1)
        : 0;

    res.status(200).json(stats);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Generate and save share link for a list
export const shareList = async (req, res) => {
  try {
    const { listName } = req.params;
    const userId = req.user.id;

    const list = await UserList.findOne({
      user: userId,
      listName,
    });

    if (!list) {
      throw new NotFoundError("List not found");
    }

    if (!list.isPublic) {
      throw new UnauthorizedError("Only public lists can be shared");
    }

    // Generate a unique share ID if not exists
    if (!list.shareId) {
      list.shareId = crypto.randomBytes(4).toString("hex");
      await list.save();
    }

    // Generate API endpoint URL
    const baseUrl = process.env.API_URL || "http://localhost:3000/api";
    const shareLink = `${baseUrl}/shared/${list.shareId}`; // Direct API endpoint

    res.status(200).json({
      message: "Share link generated successfully",
      shareLink,
      shareId: list.shareId,
      list: {
        name: list.listName,
        movieCount: list.movies.length,
        followers: list.followers.length,
        views: list.shareViews || 0,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get shared list details using share ID
export const getSharedList = async (req, res) => {
  try {
    const { shareId } = req.params;

    console.log("Accessing shared list with ID:", shareId); // Add logging for debugging

    const list = await UserList.findOne({
      shareId,
      isPublic: true,
    })
      .populate("user", "name")
      .populate(
        "movies.movie",
        "title genre director releaseDate coverPhotos averageRating"
      )
      .populate("followers", "name");

    if (!list) {
      throw new NotFoundError("Shared list not found or is private");
    }

    // Increment share views counter
    list.shareViews = (list.shareViews || 0) + 1;
    await list.save();

    res.status(200).json({
      list: {
        _id: list._id,
        listName: list.listName,
        description: list.description,
        creator: list.user.name,
        movies: list.movies.map((m) => ({
          title: m.movie.title,
          genre: m.movie.genre,
          director: m.movie.director,
          releaseDate: m.movie.releaseDate,
          coverPhotos: m.movie.coverPhotos,
          averageRating: m.movie.averageRating,
          addedAt: m.addedAt,
        })),
        followers: list.followers.map((f) => f.name),
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      },
      shareStats: {
        views: list.shareViews,
        followers: list.followers.length,
        totalMovies: list.movies.length,
      },
    });
  } catch (error) {
    console.error("Error accessing shared list:", error); // Add error logging
    res.status(error.statusCode || 500).json({
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
