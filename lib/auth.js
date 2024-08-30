import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

// Hash the password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare the password with the hashed password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Generate a JWT token
export function generateToken(user) {
  return jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: '1d',
  });
}

// Verify JWT token
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
