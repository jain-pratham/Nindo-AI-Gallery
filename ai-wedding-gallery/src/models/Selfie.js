import mongoose from "mongoose";

const SelfieSchema = new mongoose.Schema(
  {
    galleryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
      required: true
    },

    imagePath: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "done"],
      default: "uploaded"
    },

    matchedPhotos: [
      {
        photoPath: String,
        score: Number
      }
    ],

    expiresAt: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 60 * 2 // 2 hours
    }
  },
  { timestamps: true }
);

// auto delete after expiry
SelfieSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Selfie ||
  mongoose.model("Selfie", SelfieSchema);
