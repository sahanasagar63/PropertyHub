import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import createError from "../utils/error.js";

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.status(200).json(user.wishlist || []);
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return next(createError(401, "Not authenticated"));

    if (!user.wishlist) user.wishlist = [];

    const exists = user.wishlist.some(
      (id) => id.toString() === listingId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== listingId
      );
    } else {
      const listing = await Listing.findById(listingId);
      if (!listing) return next(createError(404, "Listing not found"));
      user.wishlist.push(listingId);
    }

    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};