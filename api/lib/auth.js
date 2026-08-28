import jwt from 'jsonwebtoken';
import { Admin } from './models.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aayat-secret-key-2026-change-in-production';

export async function verifyAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    return admin || null;
  } catch {
    return null;
  }
}

export { JWT_SECRET };
