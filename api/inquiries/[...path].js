import connectDB from '../lib/db.js';
import { Inquiry } from '../lib/models.js';
import { verifyAuth } from '../lib/auth.js';
import { logActivity } from '../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/inquiries
  if (req.method === 'GET') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const inquiries = await Inquiry.find().sort({ created_at: -1 });
      return res.json(inquiries);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  }

  // POST /api/inquiries
  if (req.method === 'POST') {
    try {
      const inquiry = await Inquiry.create(req.body);
      return res.json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create inquiry' });
    }
  }

  // PUT /api/inquiries/:id
  if (req.method === 'PUT') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const inquiry = await Inquiry.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'inquiry', id, `Updated inquiry status to ${req.body.status}`);
      return res.json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update inquiry' });
    }
  }

  // DELETE /api/inquiries/:id
  if (req.method === 'DELETE') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Inquiry.findByIdAndDelete(id);
      await logActivity('delete', 'inquiry', id, 'Deleted inquiry');
      return res.json({ message: 'Inquiry deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete inquiry' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
