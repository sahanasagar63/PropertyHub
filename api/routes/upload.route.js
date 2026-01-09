import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.array("images", 8),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      const urls = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "propertyhub" }
        );
        urls.push(result.secure_url);
      }

      res.status(200).json({ urls });
    } catch (err) {
      next(err);
    }
  }
);

export default router;