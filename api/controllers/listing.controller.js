import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import createError from "../utils/error.js";

/* ===============================
   CREATE LISTING
================================ */
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      state,
      city,
      cityType,
      distance,
      pincode,
      phone,
      type,
      category,
      price,
      features,
      imageUrls,
    } = req.body;

    if (
      !name ||
      !description ||
      !address ||
      !state ||
      !city ||
      !cityType ||
      !type ||
      !category ||
      !price ||
      !phone ||
      !imageUrls ||
      imageUrls.length === 0
    ) {
      return next(createError(400, "Missing required fields"));
    }

    const listing = await Listing.create({
      name,
      description,
      address,
      state,
      city,
      cityType,
      distance,
      pincode,
      phone,
      type,
      category,
      price,
      features: features || {},
      imageUrls,
      userRef: req.user.id,
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET LISTING BY ID
================================ */
export const getListingById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid listing ID"));
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(createError(404, "Listing not found"));

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

/* ===============================
   SEARCH LISTINGS
================================ */
export const searchListings = async (req, res, next) => {
  try {
    const { searchTerm = "", state, city, type, category } = req.query;

    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (state) query.state = state;
    if (city) query.city = city;
    if (type) query.type = type;
    if (category) query.category = category;

    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

/* ===============================
   MY LISTINGS
================================ */
export const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DELETE LISTING (OWNER ONLY)
================================ */
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(createError(404, "Listing not found"));
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(createError(401, "You can delete only your own listing"));
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};