import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcryptjs';

// ✅ Update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password)
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

// ✅ Get user listings
export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only view your own listings!'));
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// ✅ Get user details
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(errorHandler(404, 'User not found!'));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Test route
export const test = (req, res) => {
  res.json({ message: 'User route working fine!' });
};