const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecommendationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  category: {
    type: String,
    enum: ['diet', 'exercise', 'lifestyle', 'medication', 'monitoring'],
    required: true,
  },
  advice: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', RecommendationSchema); 