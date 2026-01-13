import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import bcrypt from "bcryptjs";
import createError from "../utils/error.js";

/* ================= UPDATE USER ================= */
/* ================= UPDATE USER (FINAL, STABLE) ================= */
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        phone: req.body.phone,
        address: req.body.address,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
/* ================= DELETE USER ================= */
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(createError(401, "You can only delete your own account"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ================= GET USER LISTINGS ================= */
export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(createError(401, "You can only view your own listings"));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

/* ================= GET USER DETAILS ================= */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(createError(404, "User not found"));

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};