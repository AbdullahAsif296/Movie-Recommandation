import mongoose from 'mongoose';
const { Schema } = mongoose;

const boxOfficeSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  openingWeekend: {
    domestic: {
      amount: Number,
      currency: { type: String, default: 'USD' }
    },
    international: {
      amount: Number,
      currency: { type: String, default: 'USD' }
    }
  },
  totalEarnings: {
    domestic: {
      amount: Number,
      currency: { type: String, default: 'USD' }
    },
    international: {
      amount: Number,
      currency: { type: String, default: 'USD' }
    }
  },
  budget: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  weeklyEarnings: [{
    week: Number,
    year: Number,
    domestic: Number,
    international: Number,
    theaters: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

boxOfficeSchema.index({ movie: 1 });
boxOfficeSchema.index({ 'totalEarnings.domestic.amount': -1 });

export default mongoose.model('BoxOffice', boxOfficeSchema); 