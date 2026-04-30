import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    participants: {
      type: Number,
      required: true,
      min: 2
    },

    targetAudience: {
      type: String,
      trim: true
    },

    keywords: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    websiteLink: {
      type: String
    },

    date: {
      type: Date,
      required: true
    },

    /* EVENT CREATOR */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

  location: {
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    address: {
      street: String,
      houseNumber: String,
      city: String,
      fullAddress: String,
    },

    details: {
      floor: String,
      entrance: String,
      building: String,
      notes: String,
    },
  },

  },
  {
    timestamps: true
  }
);
eventSchema.index({ "location.geo": "2dsphere" });
export default mongoose.model("Event", eventSchema);