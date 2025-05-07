import mongoose from 'mongoose';
const { Schema } = mongoose;

const userListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  listName: { type: String, required: true },
  description: String,
  isPublic: { type: Boolean, default: false },
  movies: [{
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  shareId: { 
    type: String,
    unique: true,
    sparse: true
  },
  shareViews: {
    type: Number,
    default: 0
  },
  sharedAt: Date
});

// Index for efficient queries
userListSchema.index({ user: 1, listName: 1 });
userListSchema.index({ isPublic: 1, followers: 1 });
userListSchema.index({ 'movies.movie': 1 });
userListSchema.index({ shareId: 1 });

// Middleware to update the updatedAt timestamp
userListSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set sharedAt when shareId is first created
  if (this.shareId && !this.sharedAt) {
    this.sharedAt = new Date();
  }
  
  next();
});

// Method to check if movie exists in list
userListSchema.methods.hasMovie = function(movieId) {
  return this.movies.some(item => item.movie.toString() === movieId.toString());
};

// Method to add movie to list
userListSchema.methods.addMovie = function(movieId) {
  if (!this.hasMovie(movieId)) {
    this.movies.push({ movie: movieId });
  }
};

// Method to remove movie from list
userListSchema.methods.removeMovie = function(movieId) {
  this.movies = this.movies.filter(item => item.movie.toString() !== movieId.toString());
};

export const UserList = mongoose.model("UserList", userListSchema);
