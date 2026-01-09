import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },

    state: { type: String, required: true },
    city: { type: String, required: true },

    cityType: {
      type: String,
      enum: ["inside", "outside"],
      required: true,
    },

    distance: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },

    type: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "house",
        "apartment",
        "villa",
        "plot",
        "farmhouse",
        "agricultural",
        "store",
      ],
      required: true,
    },

    price: { type: Number, required: true },

    /* 🔑 FINAL FEATURE DESIGN */
    features: {
      type: Object,
      default: {}, // ✅ stores category-based features safely
    },

    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length > 0 && v.length <= 8,
        message: "1–8 images required",
      },
    },

    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);