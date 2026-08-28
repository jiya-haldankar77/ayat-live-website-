import { ActivityLog } from './models.js';

export async function logActivity(action, entity, entity_id, detail) {
  try {
    await ActivityLog.create({ action, entity, entity_id, detail });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
