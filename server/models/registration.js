import mongoose from 'mongoose';

// const registrationSchema = new mongoose.Schema({
//   eventId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['approved', 'pending', 'rejected'],
//     default: 'pending',
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['paid', 'unpaid'],
//     default: 'unpaid',
//   },
// });
const registrationSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ['approved','pending','rejected'],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['paid','unpaid'],
    default: 'unpaid'
  }

},{timestamps:true})

//למנוע הרשמה כפולה
registrationSchema.index(
  { eventId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model('Registration', registrationSchema);
