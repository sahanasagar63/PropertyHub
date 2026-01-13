import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../middleware/admin.js";

import {
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  getAllListings,
  deleteListing,
} from "../controllers/admin.controller.js";

const router = express.Router();

/* USERS */
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);
router.patch("/users/block/:id", verifyToken, verifyAdmin, toggleBlockUser);

/* LISTINGS */
router.get("/listings", verifyToken, verifyAdmin, getAllListings);
router.delete("/listings/:id", verifyToken, verifyAdmin, deleteListing);

export default router;