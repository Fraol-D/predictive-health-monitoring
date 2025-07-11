const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schema for AI-generated Risk Scores
const RiskScoresSchema = new Schema({
  diabetes: {
    score: Number, // 0-100
    level: String, // "Low", "Medium", "High", "Very High"
    description: String, // one-sentence explanation
  },
  heartDisease: {
    score: Number,
    level: String,
    description: String,
  },
  hypertension: {
    score: Number,
    level: String,
    description: String,
  },
  // Add other relevant risk scores as needed
});

const AssessmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Demographics
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    // Vitals
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    heartRate: { type: Number, required: true },
    // Lifestyle
    smokingStatus: { type: String, enum: ['Never', 'Former', 'Current'], required: true },
    alcoholConsumption: { type: String, enum: ['None', 'Light', 'Moderate', 'Heavy'], required: true },
    exerciseFrequency: { type: String, enum: ['Never', '1-2 times/week', '3-4 times/week', '5+ times/week'], required: true },
    // Diet
    dietType: { type: String, enum: ['Balanced', 'Vegetarian', 'Vegan', 'Low-carb', 'Other'], required: true },
    // Medical History
    allergies: { type: String },
    chronicConditions: { type: String },
    currentMedications: { type: String },
    // AI Generated Content
    reportSummary: {
      type: String,
    }
  },
  { timestamps: true }
);

// Index for faster queries by user and date
AssessmentSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Assessment", AssessmentSchema);
