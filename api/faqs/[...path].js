import connectDB from '../lib/db.js';
import { Faq } from '../lib/models.js';
import { verifyAuth } from '../lib/auth.js';
import { logActivity } from '../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/faqs/published
  if (req.method === 'GET' && pathname.endsWith('/published')) {
    try {
      const faqs = await Faq.find({ published: true }).sort({ sort_order: 1 });
      return res.json(faqs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  }

  // GET /api/faqs
  if (req.method === 'GET') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const faqs = await Faq.find().sort({ sort_order: 1 });
      return res.json(faqs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  }

  // POST /api/faqs
  if (req.method === 'POST') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const faq = await Faq.create(req.body);
      await logActivity('create', 'faq', faq._id, `Created FAQ: ${faq.question}`);
      return res.json(faq);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create FAQ' });
    }
  }

  // PUT /api/faqs/:id
  if (req.method === 'PUT') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'faq', id, 'Updated FAQ');
      return res.json(faq);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update FAQ' });
    }
  }

  // DELETE /api/faqs/:id
  if (req.method === 'DELETE') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Faq.findByIdAndDelete(id);
      await logActivity('delete', 'faq', id, 'Deleted FAQ');
      return res.json({ message: 'FAQ deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
