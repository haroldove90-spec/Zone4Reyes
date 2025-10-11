import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    return handleGetPosts(request, response);
  }
  if (request.method === 'POST') {
    return handleCreatePost(request, response);
  }
  return response.status(405).json({ error: 'Method Not Allowed' });
}

async function handleGetPosts(request: VercelRequest, response: VercelResponse) {
  try {
    const result = await sql`
      SELECT 
        p.id, 
        p.content, 
        p.media_url,
        p.media_type,
        p.created_at,
        p.likes,
        p.shares,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'avatarUrl', u.avatar_url,
          'isVerified', u.is_verified
        ) as author
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC;
    `;

    const posts = result.rows.map(p => ({
      id: p.id,
      author: p.author,
      timestamp: new Date(p.created_at).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      content: p.content,
      media: p.media_url && p.media_type
        ? { type: p.media_type, url: p.media_url }
        : null,
      likes: p.likes,
      comments: [], // Comments should be fetched on demand or with a separate query.
      shares: p.shares,
    }));

    return response.status(200).json({ posts });
  } catch (error) {
    console.error('API Error fetching posts:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleCreatePost(request: VercelRequest, response: VercelResponse) {
  try {
    const { content, media, authorId } = request.body;
    if (!authorId || (!content && !media)) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    const newPostId = `post-${Date.now()}`;
    
    const { rows } = await sql`
      INSERT INTO posts (id, author_id, content, media_url, media_type, likes, shares)
      VALUES (
        ${newPostId}, 
        ${authorId}, 
        ${content || null}, 
        ${media?.url || null}, 
        ${media?.type || null},
        0,
        0
      )
      RETURNING id, content, media_url, media_type, created_at, likes, shares;
    `;
    
    const newPostData = rows[0];
    
    const { rows: authorResult } = await sql`SELECT id, name, avatar_url, is_verified FROM users WHERE id = ${authorId};`;
    if (authorResult.length === 0) {
      return response.status(404).json({ error: 'Author not found' });
    }
    const authorData = authorResult[0];

    // Construct the full post object to return, matching the GET response structure
    const post = {
      id: newPostData.id,
      author: {
        id: authorData.id,
        name: authorData.name,
        avatarUrl: authorData.avatar_url,
        isVerified: authorData.is_verified
      },
      timestamp: new Date(newPostData.created_at).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      content: newPostData.content,
      media: newPostData.media_url && newPostData.media_type
        ? { type: newPostData.media_type, url: newPostData.media_url }
        : null,
      likes: newPostData.likes,
      comments: [],
      shares: newPostData.shares,
    };

    return response.status(201).json({ post });

  } catch (error) {
    console.error('API Error creating post:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
