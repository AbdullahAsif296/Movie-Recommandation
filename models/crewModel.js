import mongoose from "mongoose";

// Define the schema for Cast and Crew Members
const crewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., 'Actor', 'Director'
  biography: String,
  awards: [String], // List of awards
  photos: [String], // Array of URLs to images
  filmography: [String], // List of movie titles they have worked on
});

// Export the model with crewSchema (not movieSchema)
export default mongoose.model("Crew", crewSchema);

