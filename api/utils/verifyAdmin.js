import createError from "./error.js";

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Admin access only"));
  }
  next();
};