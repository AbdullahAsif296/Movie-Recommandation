import mongoose from 'mongoose';
const { Schema } = mongoose;

const newsArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['MOVIES', 'ACTORS', 'PROJECTS', 'INDUSTRY_UPDATES'],
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes
newsArticleSchema.index({ category: 1, publicationDate: -1 });
newsArticleSchema.index({ title: 'text', content: 'text' });

export const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
