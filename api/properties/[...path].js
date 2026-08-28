import connectDB from '../../lib/db.js';
import { Property } from '../../lib/models.js';
import { verifyAuth } from '../../lib/auth.js';
import { logActivity } from '../../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/properties/published
  if (req.method === 'GET' && pathname.endsWith('/published')) {
    try {
      const properties = await Property.find({ published: true }).sort({ created_at: -1 });
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  // GET /api/properties
  if (req.method === 'GET' && (pathname === '/api/properties' || pathname === '/api/properties/')) {
    try {
      const properties = await Property.find().sort({ created_at: -1 });
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  // POST /api/properties
  if (req.method === 'POST') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const property = await Property.create(req.body);
      await logActivity('create', 'property', property._id, `Created property: ${property.title}`);
      return res.json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  // PUT /api/properties/:id
  if (req.method === 'PUT') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const property = await Property.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'property', id, `Updated property: ${property.title}`);
      return res.json(property);
    } catch (error) {
      console.error('Error updating property:', error);
      return res.status(500).json({ error: 'Failed to update property' });
    }
  }

  // DELETE /api/properties/:id
  if (req.method === 'DELETE') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Property.findByIdAndDelete(id);
      await logActivity('delete', 'property', id, 'Deleted property');
      return res.json({ message: 'Property deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
