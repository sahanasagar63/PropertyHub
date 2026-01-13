import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    address: {
      type: String,          // ✅ ADD THIS
      default: "",
    },

    password: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      default:
        "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

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