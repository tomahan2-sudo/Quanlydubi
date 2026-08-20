import { sql } from '@vercel/postgres';
import { rowToEvent } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from calendar_events order by date asc`;
      return res.status(200).json(rows.map(rowToEvent));
    }

    if (req.method === 'POST') {
      const e = parseBody(req);
      if (!e.id || !e.title || !e.date) return res.status(400).json({ error: 'Thiếu id, title hoặc date' });

      const { rows } = await sql`
        insert into calendar_events (id, title, date, time, type, location, description, color)
        values (${e.id}, ${e.title}, ${e.date}, ${e.time ?? null}, ${e.type ?? null},
          ${e.location ?? null}, ${e.description ?? null}, ${e.color ?? null})
        on conflict (id) do update set
          title = excluded.title, date = excluded.date, time = excluded.time, type = excluded.type,
          location = excluded.location, description = excluded.description, color = excluded.color
        returning *
      `;
      return res.status(200).json(rowToEvent(rows[0]));
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'Thiếu id' });
      await sql`delete from calendar_events where id = ${id}`;
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/events]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
