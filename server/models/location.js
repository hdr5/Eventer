import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  exactLocation: {
    type: String,
  },
  transportationInstructions: {
    type: String,
  },
  parking: {
    type: String,
  },
  accessibility: {
    type: String,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
});

export default mongoose.model('Location', locationSchema);