import connectDB from '../../lib/db.js';
import { Property, Booking, Inquiry, ActivityLog } from '../../lib/models.js';
import { verifyAuth } from '../../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const admin = await verifyAuth(req);
  if (!admin) return res.status(401).json({ error: 'No token provided' });

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/dashboard/stats
  if (req.method === 'GET' && pathname.endsWith('/stats')) {
    try {
      const [totalProperties, totalBookings, totalInquiries, notifications] = await Promise.all([
        Property.countDocuments(),
        Booking.countDocuments(),
        Inquiry.countDocuments(),
        ActivityLog.find().sort({ created_at: -1 }).limit(5)
      ]);
      return res.json({ totalProperties, totalBookings, totalInquiries, notifications });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
