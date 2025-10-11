import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { UserSettings } from '../types';

// Default settings for a new user
const defaultSettings: UserSettings = {
    account: { email: '' },
    privacy: {
        postVisibility: 'public',
        profileVisibility: 'public',
        messagePrivacy: 'public',
        searchPrivacy: 'public',
    },
    notifications: {
        likes: true,
        comments: true,
        mentions: true,
        messages: true,
        groupUpdates: true,
    },
    general: { language: 'es' },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // This is a prototype, so we're storing the password directly.
    // In a real app, you MUST hash and salt the password.
    const passwordHash = password;

    const newUserId = `user-${Date.now()}`;
    const userSettings = { ...defaultSettings, account: { ...defaultSettings.account, email } };
    
    const { rows: existingUsers } = await sql`SELECT id FROM users WHERE email = ${email};`;
    if (existingUsers.length > 0) {
      return response.status(409).json({ error: 'Ya existe un usuario con este correo electrónico.' });
    }
    
    // Note: This query assumes `settings` and `is_active` columns have been added to the `users` table.
    const { rows } = await sql`
      INSERT INTO users (id, name, email, password_hash, avatar_url, cover_url, bio, settings, is_active, is_verified)
      VALUES (
        ${newUserId}, 
        ${name}, 
        ${email}, 
        ${passwordHash},
        'https://picsum.photos/seed/${newUserId}/200/200',
        'https://picsum.photos/seed/${newUserId}-cover/800/200',
        '',
        ${JSON.stringify(userSettings)}::jsonb,
        true,
        false
      )
      RETURNING 
        id, 
        name,
        email, 
        password_hash as password,
        avatar_url AS "avatarUrl", 
        cover_url AS "coverUrl", 
        bio, 
        settings, 
        is_active AS "isActive", 
        is_verified AS "isVerified";
    `;

    const newUser = rows[0];
    
    // The front-end expects the email inside the settings object
    newUser.settings.account.email = newUser.email;
    delete newUser.email;


    return response.status(201).json({ user: newUser });
  } catch (error) {
    console.error('API Error registering user:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}