import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
 
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
//   preferences: {
//     favoriteGenres: [String],
//     favoriteActors: [String],
//     favoriteDirectors: [String]
//   },
//   watchlist: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Movie'
//   }],
//   customLists: [{
//     name: String,
//     movies: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Movie'
//     }]
//   }],
//   ratings: [{
//     movie: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Movie'
//     },
//     rating: Number,
//     date: Date
// }]
  notifications: [{
    type: {
      type: String,
      enum: ['NEW_COMMENT', 'MENTION', 'LIKE'],
      required: true
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    thread: {
      type: Schema.Types.ObjectId,
      ref: 'Thread'
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add index for notifications
userSchema.index({ 'notifications.createdAt': -1 });

export default mongoose.model('User', userSchema);