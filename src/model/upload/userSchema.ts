import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },
    optimizationHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        originalText: String,
        optimizedText: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
