import express from "express";
import {
  createListing,
  getListingById,
  searchListings,
  getMyListings,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// CREATE

router.post("/", verifyToken, createListing);

// SEARCH
router.get("/search", searchListings);

// MY LISTINGS
router.get("/my", verifyToken, getMyListings);

// DELETE
router.delete("/:id", verifyToken, deleteListing);

// SINGLE LISTING
router.get("/:id", getListingById);

export default router;