import mongoose from 'mongoose';
const { Schema } = mongoose;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    maxLength: 200
  },
  category: {
    type: String,
    enum: ['MOVIE_NEWS', 'ACTOR_NEWS', 'INDUSTRY_UPDATE', 'UPCOMING_PROJECT'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedMovies: [{
    type: Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  relatedActors: [{
    type: String
  }],
  coverImage: {
    url: String,
    alt: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  publishDate: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
newsSchema.index({ category: 1, status: 1, publishDate: -1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ 'relatedMovies': 1 });
newsSchema.index({ status: 1, publishDate: -1 });

export default mongoose.model('News', newsSchema); 