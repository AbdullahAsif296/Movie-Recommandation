const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const awardSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    refPath: "onModel",
    required: true,
  },
  onModel: { type: String, required: true, enum: ["Movie", "Person"] }, // Specifies whether the award is for a movie or a person
  awardName: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: Number, required: true },
  isWinner: { type: Boolean, default: false }, // True if the recipient won, false if it's just a nomination
});

module.exports = mongoose.model("Award", awardSchema);
