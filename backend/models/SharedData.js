const mongoose = require('mongoose');
const { Schema } = mongoose;

const SharedDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessmentIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
  }],
  consentGiven: {
    type: Boolean,
    default: false,
  },
  pdfGenerated: {
    type: Boolean,
    default: false,
  },
  pdfUrl: {
    type: String, // To be used in the future
  },
  sharedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('SharedData', SharedDataSchema); 