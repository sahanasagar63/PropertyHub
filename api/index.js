import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import uploadRoutes from "./routes/upload.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import reportRoutes from "./routes/report.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reports", reportRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server running")
);