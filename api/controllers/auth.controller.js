import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import createError from "../utils/error.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(createError(400, "All fields are required"));
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return next(createError(400, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    const token = signToken(user);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .status(201)
      .json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (err) {
    next(err);
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(createError(404, "User not found"));

    if (user.authProvider !== "local") {
      return next(createError(400, "Use Google login"));
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return next(createError(401, "Invalid credentials"));

    const token = signToken(user);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (err) {
    next(err);
  }
};

// GOOGLE LOGIN
export const google = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return next(createError(400, "Google token missing"));

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return next(createError(400, "Google email not verified"));
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        avatar: picture,
        authProvider: "google",
      });
    }

    const token = signToken(user);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const signOut = (req, res) => {
  res.clearCookie("access_token").json({ success: true });
};