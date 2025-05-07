import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminLogSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'MODERATE'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['MOVIE', 'REVIEW', 'USER', 'COMMENT'],
    required: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

adminLogSchema.index({ admin: 1, timestamp: -1 });
adminLogSchema.index({ action: 1, entityType: 1 });

export default mongoose.model('AdminLog', adminLogSchema); 