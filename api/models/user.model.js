import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // ❤️ WISHLIST (FIX)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);