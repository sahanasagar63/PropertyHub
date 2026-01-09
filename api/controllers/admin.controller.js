import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* DELETE USER */
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Listing.deleteMany({ userRef: req.params.id });
  res.json({ success: true });
};

/* GET ALL LISTINGS */
export const getAllListings = async (req, res) => {
  const listings = await Listing.find().sort({ createdAt: -1 });
  res.json(listings);
};

/* DELETE LISTING */
export const deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};