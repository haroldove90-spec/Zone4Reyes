import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.content, 
        p.media_url,
        p.media_type,
        p.created_at as timestamp,
        p.likes,
        p.shares,
        row_to_json(u) as author
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC;
    `;
    // Note: Comments are not included in this query for simplicity.
    // A real implementation would fetch them separately or aggregate them.
    const posts = result.rows.map(p => ({ ...p, comments: [] }));
    return response.status(200).json({ posts });
  } catch (error) {
    console.error('API Error fetching posts:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}