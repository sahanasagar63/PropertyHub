import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import createError from "../utils/error.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= TOKEN ================= */
const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================= RESPONSE HELPER ================= */
const sendUser = (res, user, token) => {
  res
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
    })
    .status(200)
    .json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
};

/* ===================== SIGN UP ===================== */
export const signup = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || (!email && !phone) || !password) {
      return next(
        createError(400, "Username, password and email or phone required")
      );
    }

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return next(createError(400, "Email or phone already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      authProvider: "local",
      role: "user",
    });

    const token = signToken(user);
    sendUser(res, user, token);
  } catch (err) {
    next(err);
  }
};

/* ===================== SIGN IN ===================== */
export const signin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(createError(400, "All fields required"));
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).select("+password");

    if (!user) return next(createError(404, "User not found"));

    if (user.isBlocked) {
      return next(createError(403, "Your account is blocked by admin"));
    }

    if (user.authProvider !== "local") {
      return next(createError(400, "Use Google login"));
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return next(createError(401, "Invalid credentials"));

    const token = signToken(user);
    sendUser(res, user, token);
  } catch (err) {
    next(err);
  }
};

/* ===================== GOOGLE LOGIN ===================== */
export const google = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return next(createError(400, "Google token missing"));

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, email_verified } = ticket.getPayload();

    if (!email_verified) {
      return next(createError(400, "Google email not verified"));
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        avatar: picture,
        authProvider: "google",
        role: "user",
      });
    }

    if (user.isBlocked) {
      return next(createError(403, "Your account is blocked by admin"));
    }

    const token = signToken(user);
    sendUser(res, user, token);
  } catch (err) {
    next(err);
  }
};

/* ===================== LOGOUT ===================== */
export const signOut = (req, res) => {
  res.clearCookie("access_token").json({ success: true });
};