import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const { rows: users } = await sql`
      SELECT 
        id, 
        name, 
        avatar_url AS "avatarUrl", 
        cover_url AS "coverUrl", 
        bio,
        is_verified AS "isVerified"
      FROM users;
    `;
    return response.status(200).json({ users });
  } catch (error) {
     console.error('API Error fetching users:', error);
     return response.status(500).json({ error: 'Internal Server Error' });
  }
}
