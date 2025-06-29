const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssessmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  symptoms: [String],
  medicalHistory: [String],
  lifestyle: {
    // Define nested lifestyle object structure
    diet: String,
    exercise: String,
    smoking: String,
    alcohol: String,
  },
  riskScores: {
    diabetes: Number,
    heartDisease: Number,
    hypertension: Number,
    stroke: Number,
    // Add other relevant risk scores
  },
}, { timestamps: true });

// Index for faster queries by user and date
AssessmentSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Assessment', AssessmentSchema); 