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
  overall: Number, // Overall risk score
  // Add other relevant risk scores as needed
});

const AssessmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assessmentId: {
      type: String,
      required: true,
      unique: true,
    },
    // Support both old individual fields and new nested structure
    fullAssessmentData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    riskScores: {
      type: RiskScoresSchema,
      required: true,
    },
    // Keep individual fields for backward compatibility (optional)
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    height: { type: Number },
    weight: { type: Number },
    bloodPressure: { type: String },
    heartRate: { type: Number },
    smokingStatus: { type: String, enum: ["Never", "Former", "Current"] },
    alcoholConsumption: {
      type: String,
      enum: ["None", "Light", "Moderate", "Heavy"],
    },
    exerciseFrequency: {
      type: String,
      enum: ["Never", "1-2 times/week", "3-4 times/week", "5+ times/week"],
    },
    dietType: {
      type: String,
      enum: ["Balanced", "Vegetarian", "Vegan", "Low-carb", "Other"],
    },
    allergies: { type: String },
    chronicConditions: { type: String },
    currentMedications: { type: String },
    // AI Generated Content
    reportSummary: {
      type: String,
    },
    // Status and metadata
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries by user and date
AssessmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Assessment", AssessmentSchema);
