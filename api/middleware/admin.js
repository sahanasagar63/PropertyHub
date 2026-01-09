import { createError } from "../utils/error.js";

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(createError(403, "Admin access only"));
  }
  next();
};