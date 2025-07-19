const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    notificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'alert', 'recommendation', 'system'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedRecommendationId: {
      type: Schema.Types.ObjectId,
      ref: "Recommendation",
    },
    relatedAssessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema); 