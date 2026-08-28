import connectDB from '../../lib/db.js';
import { Team } from '../../lib/models.js';
import { verifyAuth } from '../../lib/auth.js';
import { logActivity } from '../../lib/activity.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/team/published
  if (req.method === 'GET' && pathname.endsWith('/published')) {
    try {
      const team = await Team.find({ published: true }).sort({ sort_order: 1 });
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
  }

  // GET /api/team
  if (req.method === 'GET') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const team = await Team.find().sort({ sort_order: 1 });
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch team' });
    }
  }

  // POST /api/team
  if (req.method === 'POST') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    try {
      const member = await Team.create(req.body);
      await logActivity('create', 'team_member', member._id, `Created team member: ${member.name}`);
      return res.json(member);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create team member' });
    }
  }

  // PUT /api/team/:id
  if (req.method === 'PUT') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      const member = await Team.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity('update', 'team_member', id, 'Updated team member');
      return res.json(member);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update team member' });
    }
  }

  // DELETE /api/team/:id
  if (req.method === 'DELETE') {
    const admin = await verifyAuth(req);
    if (!admin) return res.status(401).json({ error: 'No token provided' });
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    try {
      await Team.findByIdAndDelete(id);
      await logActivity('delete', 'team_member', id, 'Deleted team member');
      return res.json({ message: 'Team member deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete team member' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
