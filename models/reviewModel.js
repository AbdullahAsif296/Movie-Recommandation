import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  reviewText: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);
