import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'producer', 'guest'], default: 'producer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // registeredEvents: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Event', // References the Event model
  //   },
  // ],
  avatarUrl: { type: String, default: "" },       // URL הציבורי
  avatarPublicId: { type: String, default: "" },  // public_id ב-Cloudinary
})

export default mongoose.model('User', userSchema);