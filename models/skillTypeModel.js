import mongoose from 'mongoose';

const SkillTypeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      immutable: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    fullImageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'skilltypes',
  }
);

SkillTypeSchema.index({
  isActive: 1,
  sortOrder: 1,
  label: 1,
});

export default mongoose.models.SkillType ||
  mongoose.model('SkillType', SkillTypeSchema);