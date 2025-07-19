const mongoose = require("mongoose");
const { Schema } = mongoose;

const SharedDataSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedDataId: {
      // Unique ID for shared data, can be a UUID from frontend
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    assessmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assessment",
      },
    ],
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
    // No need for sharedAt as timestamps: true will add createdAt
  },
  { timestamps: true }
);

module.exports = mongoose.model("SharedData", SharedDataSchema);
