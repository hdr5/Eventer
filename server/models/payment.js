import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Payment', paymentSchema);
