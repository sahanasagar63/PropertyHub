import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Defaults that listings will inherit when created without overrides
    defaultPhone: { type: String, default: '' },
    defaultAddress: { type: String, default: '' },
    defaultPhotos: { type: [String], default: [] }, // array of URL strings
    defaultPrice: { type: Number, default: 0 },

    description: { type: String, default: '' },

    // Optional metadata you might want later
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);