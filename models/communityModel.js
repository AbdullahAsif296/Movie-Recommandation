import mongoose from 'mongoose';
const { Schema } = mongoose;

// Thread Schema
const threadSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['MOVIE', 'ACTOR', 'DIRECTOR', 'GENRE', 'GENERAL'],
    required: true
  },
  relatedTo: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Movie', 'Actor', 'Director', 'Genre'],
    required: function() {
      return this.category !== 'GENERAL';
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isLocked: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  reports: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Comment Schema
const commentSchema = new Schema({
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: Date
  }],
  reports: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: Date
  }]
}, {
  timestamps: true
});

// Add indexes
threadSchema.index({ category: 1, createdAt: -1 });
threadSchema.index({ tags: 1 });
threadSchema.index({ title: 'text', content: 'text' });
commentSchema.index({ thread: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1 });

export const Thread = mongoose.model('Thread', threadSchema);
export const Comment = mongoose.model('Comment', commentSchema); 