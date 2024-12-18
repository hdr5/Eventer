import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['admin', 'producer', 'guest'], default: 'guest'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    registeredEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event', // References the Event model
    },
  ],
})

export default mongoose.model('User', userSchema);