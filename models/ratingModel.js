import mongoose from "mongoose";
const { Schema } = mongoose;

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Rating", ratingSchema);
