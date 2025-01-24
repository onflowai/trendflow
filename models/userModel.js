import mongoose from 'mongoose';
/**
 * Example
 * _id: ObjectId('user_id')
 * username:
 * name:
 * email:
 * password:
 * lastName:
 * role:
 * createdAt:
 * updatedAt:
 * __v: 0
 */
const UserSchema = new mongoose.Schema(
  {
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
      enum: ['user', 'admin', 'guestUser'],
      default: 'user',
    },
    githubUsername: {
      type: String,
      default: '',
    },
    privacy: {
      type: Boolean,
      default: false,
    },
    profile_img: String,
    profile_img_id: String,
    savedTrends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend', // reference to the Trend model prevents duplication
      },
    ],
    savedFilters: {
      type: Object,
      default: {},
    },
    expiresAt: {
      type: Date,
      default: null, //only set for guest users
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
UserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // index only affects documents where 'expiresAt' is set (guestUser in authController)
//instance method to limit getCurrentUser return data (removing password)
UserSchema.methods.toJSON = function () {
  let obj = this.toObject(); //transforming UserSchema to object
  delete obj.password; //deleting the password out of this object
  return obj;
};

export default mongoose.model('User', UserSchema);
