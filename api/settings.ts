import { sql } from '@vercel/postgres';
import { rowToSettings } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from app_settings where id = 1`;
      return res.status(200).json(rows[0] ? rowToSettings(rows[0]) : null);
    }

    if (req.method === 'PUT') {
      const s = parseBody(req);
      const { rows } = await sql`
        update app_settings set
          seminary_name = ${s.seminaryName}, rector_name = ${s.rectorName},
          diocese = ${s.diocese}, address = ${s.address}, current_year = ${s.currentYear},
          updated_at = now()
        where id = 1
        returning *
      `;
      return res.status(200).json(rowToSettings(rows[0]));
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/settings]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
