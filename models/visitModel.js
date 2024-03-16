import mongoose from 'mongoose';
/**
 * Schema which can be used to log interaction for any user. For now it is used only for guest
 */
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
  // interactionType: {
  //   type: String,
  //   required: true,
  //   enum: ['signIn', 'pageVisit', 'featureUse', 'other'], //other possible interaction types
  // },
});

export default mongoose.model('Visit', visitSchema);
