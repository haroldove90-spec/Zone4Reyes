import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { rows: users } = await sql`
      SELECT 
        id, 
        name, 
        avatar_url, 
        cover_url, 
        bio,
        is_verified 
      FROM users;
    `;
    return response.status(200).json({ users });
  } catch (error) {
     console.error('API Error fetching users:', error);
     return response.status(500).json({ error: 'Internal Server Error' });
  }
}