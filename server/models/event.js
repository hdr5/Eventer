import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  targetAudience: {
    type: String,
  },
  keywords: {
    type: [String],
  },
  images: {
    type: [String],
  },
  websiteLink: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  registrations: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending',
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
      // ... שדות רישום נוספים ...
    },
  ],
});

export default mongoose.model('Event', eventSchema);