import connectDB from './lib/db.js';
import { Settings, Category, Amenity } from './lib/models.js';
import { verifyAuth } from './lib/auth.js';
import { logActivity } from './lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/config/settings
  if (req.method === 'GET' && pathname.endsWith('/settings')) {
    try {
      const settings = await Settings.find({});
      const settingsObj = {};
      settings.forEach(s => settingsObj[s.key] = s.value);
      return res.json(settingsObj);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // PUT /api/config/settings
  if (req.method === 'PUT' && pathname.endsWith('/settings')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const { key, value } = req.body;
      await Settings.findOneAndUpdate({ key }, { value, updated_at: new Date() }, { upsert: true });
      await logActivity('update', 'setting', key, `Updated setting: ${key}`);
      return res.json({ message: 'Setting updated' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update setting' });
    }
  }

  // GET /api/config/categories
  if (req.method === 'GET' && pathname.endsWith('/categories')) {
    try {
      const categories = await Category.find();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // GET /api/config/amenities
  if (req.method === 'GET' && pathname.endsWith('/amenities')) {
    try {
      const amenities = await Amenity.find();
      return res.json(amenities);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch amenities' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
