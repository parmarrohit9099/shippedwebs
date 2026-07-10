import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const password = req.headers['x-admin-password'];

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT,
        contact TEXT,
        project_type TEXT,
        details TEXT
      );
    `;

    const { rows } = await sql`
      SELECT id, created_at, name, contact, project_type, details
      FROM submissions
      ORDER BY created_at DESC;
    `;

    return res.status(200).json({ submissions: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong loading submissions' });
  }
}
