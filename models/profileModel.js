import mongoose from 'mongoose';
const { Schema } = mongoose;
const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  favoriteGenres: [String],
  favoriteActors: [String],
  bio: String,
  avatar: {
    filename: String,
    path: String,
    contentType: String,
    size: Number,
  },
});
export default mongoose.model("Profile", profileSchema);
