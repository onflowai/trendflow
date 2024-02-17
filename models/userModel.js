import mongoose from 'mongoose';
/**
 * Example
 * _id
 * username
 * name
 * email
 * password
 * lastName
 * role
 * __v
 * 0
 */
const UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export default mongoose.model('User', UserSchema);
