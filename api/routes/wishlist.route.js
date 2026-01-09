import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", verifyToken, getWishlist);
router.post("/:listingId", verifyToken, toggleWishlist);

export default router;