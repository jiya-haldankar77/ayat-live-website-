import connectDB from '../../lib/db.js';
import { Testimonial } from '../../lib/models.js';
import { verifyAuth } from '../../lib/auth.js';
import { logActivity } from '../../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/testimonials/published
  if (req.method === 'GET' && pathname.endsWith('/published')) {
    try {
      const testimonials = await Testimonial.find({ published: true }).sort({ created_at: -1 });
      return res.json(testimonials);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  // GET /api/testimonials
  if (req.method === 'GET') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const testimonials = await Testimonial.find().sort({ created_at: -1 });
      return res.json(testimonials);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  // POST /api/testimonials
  if (req.method === 'POST') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const testimonial = await Testimonial.create(req.body);
      await logActivity('create', 'testimonial', testimonial._id, `Created testimonial from ${testimonial.author}`);
      return res.json(testimonial);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }

  // PUT /api/testimonials/:id
  if (req.method === 'PUT') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'testimonial', id, 'Updated testimonial');
      return res.json(testimonial);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update testimonial' });
    }
  }

  // DELETE /api/testimonials/:id
  if (req.method === 'DELETE') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Testimonial.findByIdAndDelete(id);
      await logActivity('delete', 'testimonial', id, 'Deleted testimonial');
      return res.json({ message: 'Testimonial deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
