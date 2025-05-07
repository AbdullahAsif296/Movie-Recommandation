import mongoose from "mongoose";
const { Schema } = mongoose;

const awardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["NOMINATION", "WINNER"],
    required: true,
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
  },
  person: {
    name: String,
    role: String, // actor, director, etc.
  },
  ceremony: {
    date: Date,
    location: String,
  },
});

awardSchema.index({ movie: 1 });
awardSchema.index({ year: -1, organization: 1 });
awardSchema.index({ "person.name": 1 });

export const Award = mongoose.model("Award", awardSchema);
