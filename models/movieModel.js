import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema for the Movie Model
const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  director: { type: mongoose.Schema.Types.ObjectId, ref: "Crew" },
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crew" }],
  releaseDate: { type: Date, required: true },
  runtime: { type: Number, required: true },
  synopsis: { type: String, required: true },
  averageRating: { type: Number, min: 0, max: 10 },
  coverPhotos: [{
    filename: String,
    path: String,
    contentType: String,
    size: Number
  }],
  trivia: [String],
  goofs: [String],
  soundtrack: [String],
  ageRating: { type: String, required: true },
  parentalGuidance: String,
});

export default mongoose.model("Movie", movieSchema);


