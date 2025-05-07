import Movie from "../models/movieModel.js";
import Crew from "../models/crewModel.js";

export const addMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      trivia,
      goofs,
      soundtrack,
      ageRating,
      parentalGuidance,
      coverPhotos
    } = req.body;

    // Validate required fields
    if (!title || !genre || !releaseDate || !runtime || !synopsis || !ageRating) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    const movie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      coverPhotos,
      trivia: trivia || [],
      goofs: goofs || [],
      soundtrack: soundtrack || [],
      ageRating,
      parentalGuidance
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      trivia,
      goofs,
      soundtrack,
      ageRating,
      parentalGuidance,
      coverPhotos
    } = req.body;

    const updates = {};

    // Only include fields that are provided in the request
    if (title) updates.title = title;
    if (genre) updates.genre = genre;
    if (director) updates.director = director;
    if (cast) updates.cast = cast;
    if (releaseDate) updates.releaseDate = releaseDate;
    if (runtime) updates.runtime = runtime;
    if (synopsis) updates.synopsis = synopsis;
    if (coverPhotos) updates.coverPhotos = coverPhotos;
    if (trivia) updates.trivia = trivia;
    if (goofs) updates.goofs = goofs;
    if (soundtrack) updates.soundtrack = soundtrack;
    if (ageRating) updates.ageRating = ageRating;
    if (parentalGuidance) updates.parentalGuidance = parentalGuidance;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    ).populate('director').populate('cast');

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate({
        path: "director",
        model: "Crew",
        select: "name role biography photos"
      })
      .populate({
        path: "cast",
        model: "Crew",
        select: "name role photos"
      });

    if (!movie) {
      return res.status(404).json({ 
        message: "Movie not found" 
      });
    }

    res.json(movie);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ 
        message: "Invalid movie ID format" 
      });
    }
    res.status(500).json({ 
      message: error.message 
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("director").populate("cast");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
