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
  username: {
    type: String,
    required: true,
  },
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
  profile_img: String,
  profile_img_id: String,
});
//instance method to limit getCurrentUser return data (removing password)
UserSchema.methods.toJSON = function () {
  let obj = this.toObject(); //transforming UserSchema to object
  delete obj.password; //deleting the password out of this object
  return obj;
};

export default mongoose.model('User', UserSchema);
