import connectDB from '../lib/db.js';
import { Admin } from '../lib/models.js';
import { verifyAuth, JWT_SECRET } from '../lib/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // POST /api/auth/login
  if (req.method === 'POST' && pathname.endsWith('/login')) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, admin: { id: admin._id, email: admin.email, role: admin.role } });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  // POST /api/auth/register
  if (req.method === 'POST' && pathname.endsWith('/register')) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ email, password: hashedPassword });
      return res.json({ message: 'Admin created', admin: { id: admin._id, email: admin.email } });
    } catch (error) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  // GET /api/auth/me
  if (req.method === 'GET' && pathname.endsWith('/me')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'Invalid token' });
    return res.json({ admin: { id: admin._id, email: admin.email, role: admin.role } });
  }

  return res.status(404).json({ error: 'Not found' });
}
