import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

/* ================= USERS ================= */

// GET ALL USERS (FULL DETAILS)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Listing.deleteMany({ userRef: req.params.id });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

// BLOCK / UNBLOCK USER
export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found"));

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= LISTINGS ================= */

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};