import { sql } from '@vercel/postgres';
import { rowToActivity } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from activities order by created_at desc limit 50`;
      return res.status(200).json(rows.map(rowToActivity));
    }

    if (req.method === 'POST') {
      const a = parseBody(req);
      if (!a.id || !a.title) return res.status(400).json({ error: 'Thiếu id hoặc title' });

      const { rows } = await sql`
        insert into activities (id, type, title, description, time, author, icon)
        values (${a.id}, ${a.type ?? null}, ${a.title}, ${a.description ?? null}, ${a.time ?? null},
          ${a.author ?? null}, ${a.icon ?? null})
        on conflict (id) do update set
          type = excluded.type, title = excluded.title, description = excluded.description,
          time = excluded.time, author = excluded.author, icon = excluded.icon
        returning *
      `;
      return res.status(200).json(rowToActivity(rows[0]));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/activities]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
