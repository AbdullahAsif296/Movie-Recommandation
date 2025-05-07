import Movie from '../models/movieModel.js';
import Crew from '../models/crewModel.js';
import { NotFoundError } from '../utils/errors.js';

export const uploadMovieImage = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    const imageData = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
      size: file.size
    }));

    // Add new images to existing coverPhotos array
    movie.coverPhotos = [...(movie.coverPhotos || []), ...imageData];
    await movie.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageData
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const uploadActorImage = async (req, res) => {
  try {
    const { actorId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const actor = await Crew.findOne({ _id: actorId, role: 'Actor' });
    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    const imageData = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
      size: file.size
    }));

    // Add new images to existing photos array
    actor.photos = [...(actor.photos || []), ...imageData];
    await actor.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageData
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const uploadDirectorImage = async (req, res) => {
  try {
    const { directorId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const director = await Crew.findOne({ _id: directorId, role: 'Director' });
    if (!director) {
      throw new NotFoundError('Director not found');
    }

    const imageData = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      contentType: file.mimetype,
      size: file.size
    }));

    // Add new images to existing photos array
    director.photos = [...(director.photos || []), ...imageData];
    await director.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageData
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}; 