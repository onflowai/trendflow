import mongoose from 'mongoose';

const TechnologySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, maxlength: 500 },
    fullImageUrl: { type: String, required: true },
  },
  { collection: 'technologies' }
);

export default mongoose.model('Technology', TechnologySchema);
