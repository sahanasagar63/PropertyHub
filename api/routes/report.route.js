import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { reportListing } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/:listingId", verifyToken, reportListing);

export default router;