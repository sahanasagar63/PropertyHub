// api/routes/user.route.js
import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import Listing from "../models/listing.model.js";

const router = express.Router();

// GET /api/user/listings - listings created by logged-in user
router.get("/listings", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const listings = await Listing.find({ userRef: userId });

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (err) {
    next(err);
  }
});

export default router;