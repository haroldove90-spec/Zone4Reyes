import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
     // For now, returning an empty array as stories are not in the DB schema yet
    const stories: any[] = [];
    return response.status(200).json({ stories });
  } catch (error) {
     console.error('API Error fetching stories:', error);
     return response.status(500).json({ error: 'Internal Server Error' });
  }
}
