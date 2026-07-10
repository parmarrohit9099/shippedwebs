import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Creates the table automatically the first time this runs - no manual SQL needed
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

    const { name, contact, project_type, details } = req.body;

    if (!name || !contact) {
      return res.status(400).json({ error: 'Name and contact are required' });
    }

    await sql`
      INSERT INTO submissions (name, contact, project_type, details)
      VALUES (${name}, ${contact}, ${project_type || ''}, ${details || ''});
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong saving your request' });
  }
}
