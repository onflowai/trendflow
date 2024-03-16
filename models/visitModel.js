import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'guestUser'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Visit', visitSchema);
