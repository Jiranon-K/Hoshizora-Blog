import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./db";
import User from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(
    "WARNING: JWT_SECRET environment variable is not set. Authentication will not work properly.",
  );
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function createToken(user) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id?.toString() || user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "12h" },
  );
}

export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email) {
  await connectToDatabase();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (user) {
    user.id = user._id.toString();
  }
  return user;
}

export async function loginUser(email, password) {
  await connectToDatabase();

  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  if (!user) {
    return { success: false, message: "ไม่พบผู้ใช้" };
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "รหัสผ่านไม่ถูกต้อง" };
  }

  const token = createToken(user);

  const { password: _, ...userWithoutPassword } = user;
  userWithoutPassword.id = user._id.toString();

  return {
    success: true,
    user: userWithoutPassword,
    token,
  };
}

export async function isAdmin(userId) {
  await connectToDatabase();
  const user = await User.findById(userId).select("role").lean();
  return user?.role === "admin";
}

export default {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
  getUserByEmail,
  loginUser,
  isAdmin,
};
