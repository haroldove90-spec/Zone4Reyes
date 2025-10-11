import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
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