import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  movie: { 
    type: Schema.Types.ObjectId, 
    ref: 'Movie' 
  },
  type: {
    type: String,
    enum: ['RELEASE_REMINDER', 'TRAILER_RELEASE', 'NEW_IN_GENRE'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ scheduledFor: 1 });

export default mongoose.model('Notification', notificationSchema); 