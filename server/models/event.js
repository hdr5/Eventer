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

  /* LOCATION */
location: {
  venueName: { type: String, trim: true },   // שם המקום (לדוגמה: Azrieli Tower)
  street: { type: String, trim: true },      // רחוב
  buildingNumber: { type: String, trim: true }, // מספר בניין
  city: { type: String, trim: true },        // עיר
  floor: { type: String, trim: true },       // קומה
  room: { type: String, trim: true },        // אולם / חדר
  lat: Number,
  lng: Number
}
  // /* REGISTRATIONS */
  // registrations: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //       required: true
  //     },

  //     status: {
  //       type: String,
  //       enum: ["approved", "pending", "rejected"],
  //       default: "pending"
  //     },

  //     payment: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Payment"
  //     }
  //   }
  // ]

},
{
  timestamps: true
}
);

export default mongoose.model("Event", eventSchema);