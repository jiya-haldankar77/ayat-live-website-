import connectDB from '../../lib/db.js';
import { Booking, Inquiry } from '../../lib/models.js';
import { verifyAuth } from '../../lib/auth.js';
import { logActivity } from '../../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // BOOKINGS
  // GET /api/forms/bookings
  if (req.method === 'GET' && pathname.endsWith('/bookings')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const bookings = await Booking.find().sort({ created_at: -1 });
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  // POST /api/forms/bookings
  if (req.method === 'POST' && pathname.endsWith('/bookings')) {
    try {
      const booking = await Booking.create(req.body);
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  // PUT /api/forms/bookings/:id
  if (req.method === 'PUT' && pathname.includes('/bookings/')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'booking', id, `Updated booking status to ${req.body.status}`);
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  // DELETE /api/forms/bookings/:id
  if (req.method === 'DELETE' && pathname.includes('/bookings/')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Booking.findByIdAndDelete(id);
      await logActivity('delete', 'booking', id, 'Deleted booking');
      return res.json({ message: 'Booking deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
  }

  // INQUIRIES
  // GET /api/forms/inquiries
  if (req.method === 'GET' && pathname.endsWith('/inquiries')) {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const inquiries = await Inquiry.find().sort({ created_at: -1 });
      return res.json(inquiries);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  }

  // POST /api/forms/inquiries
  if (req.method === 'POST' && pathname.endsWith('/inquiries')) {
    try {
      const inquiry = await Inquiry.create(req.body);
      return res.json(inquiry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create inquiry' });
    }
  }

  // PUT /api/forms/inquiries/:id
  if (req.method === 'PUT' && pathname.includes('/inquiries/')) {
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

  // DELETE /api/forms/inquiries/:id
  if (req.method === 'DELETE' && pathname.includes('/inquiries/')) {
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
