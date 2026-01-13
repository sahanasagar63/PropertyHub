import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";

const router = express.Router();

/* UPDATE PROFILE */
router.put("/update", verifyToken, updateUser);

/* DELETE ACCOUNT */
router.delete("/delete/:id", verifyToken, deleteUser);

/* GET USER LISTINGS */
router.get("/listings/:id", verifyToken, getUserListings);

/* GET USER DETAILS */
router.get("/:id", verifyToken, getUser);

export default router;