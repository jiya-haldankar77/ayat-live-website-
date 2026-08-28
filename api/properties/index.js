import { connectToDatabase, Property, ActivityLog } from '../db.js';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const properties = await Property.find().sort({ created_at: -1 });
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  } else if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'No token provided' });
      
      const property = await Property.create(req.body);
      await ActivityLog.create({ action: 'create', entity: 'property', entity_id: property._id, detail: `Created property: ${property.title}` });
      res.json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: 'Failed to create property' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
