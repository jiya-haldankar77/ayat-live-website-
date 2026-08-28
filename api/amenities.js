import connectDB from '../lib/db.js';
import { Amenity } from '../lib/models.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  if (req.method === 'GET') {
    try {
      const amenities = await Amenity.find();
      return res.json(amenities);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch amenities' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
