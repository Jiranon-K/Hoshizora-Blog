import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from './db';

// Ensure JWT_SECRET is configured in environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET environment variable is not set. Authentication will not work properly.');
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
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      role: user.role
    }, 
    JWT_SECRET, 
    { expiresIn: '12h' } // Shorter token lifetime for better security
  );
}


export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}


export async function getUserByUsername(username) {
  const result = await executeQuery({
    query: 'SELECT * FROM users WHERE username = ?',
    values: [username]
  });
  return result[0];
}


export async function getUserByEmail(email) {
  const result = await executeQuery({
    query: 'SELECT * FROM users WHERE email = ?',
    values: [email]
  });
  return result[0];
}


export async function loginUser(usernameOrEmail, password) {

  const isEmail = usernameOrEmail.includes('@');
  
  
  const user = isEmail 
    ? await getUserByEmail(usernameOrEmail)
    : await getUserByUsername(usernameOrEmail);
  
  
  if (!user) {
    return { success: false, message: 'ไม่พบผู้ใช้' };
  }
  
  
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  }
  
  
  const token = createToken(user);
  
  
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    success: true,
    user: userWithoutPassword,
    token
  };
}


export async function isAdmin(userId) {
  const result = await executeQuery({
    query: 'SELECT role FROM users WHERE id = ?',
    values: [userId]
  });
  return result[0]?.role === 'admin';
}

export default {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
  getUserByUsername,
  getUserByEmail,
  loginUser,
  isAdmin
};