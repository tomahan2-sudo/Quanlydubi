import { sql } from '@vercel/postgres';
import { rowToPastoral } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from pastoral_assignments order by created_at desc`;
      return res.status(200).json(rows.map(rowToPastoral));
    }

    if (req.method === 'POST') {
      const p = parseBody(req);
      if (!p.id || !p.locationName) return res.status(400).json({ error: 'Thiếu id hoặc locationName' });

      const { rows } = await sql`
        insert into pastoral_assignments (id, location_name, pastor, count, category, type, address, seminarians, updated_at)
        values (${p.id}, ${p.locationName}, ${p.pastor ?? null}, ${p.count ?? 0}, ${p.category ?? null},
          ${p.type ?? null}, ${p.address ?? null}, ${JSON.stringify(p.seminarians ?? [])}::jsonb, now())
        on conflict (id) do update set
          location_name = excluded.location_name, pastor = excluded.pastor, count = excluded.count,
          category = excluded.category, type = excluded.type, address = excluded.address,
          seminarians = excluded.seminarians, updated_at = now()
        returning *
      `;
      return res.status(200).json(rowToPastoral(rows[0]));
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'Thiếu id' });
      await sql`delete from pastoral_assignments where id = ${id}`;
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/pastorals]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
