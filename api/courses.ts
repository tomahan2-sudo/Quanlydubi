import { sql } from '@vercel/postgres';
import { rowToCourse } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from courses order by created_at desc`;
      return res.status(200).json(rows.map(rowToCourse));
    }

    if (req.method === 'POST') {
      const c = parseBody(req);
      if (!c.id || !c.name) return res.status(400).json({ error: 'Thiếu id hoặc name' });

      const { rows } = await sql`
        insert into courses (id, code, name, instructor, level, current_week, total_weeks, credits, semester, updated_at)
        values (${c.id}, ${c.code ?? null}, ${c.name}, ${c.instructor ?? null}, ${c.level ?? null},
          ${c.currentWeek ?? 0}, ${c.totalWeeks ?? 0}, ${c.credits ?? 0}, ${c.semester ?? null}, now())
        on conflict (id) do update set
          code = excluded.code, name = excluded.name, instructor = excluded.instructor,
          level = excluded.level, current_week = excluded.current_week, total_weeks = excluded.total_weeks,
          credits = excluded.credits, semester = excluded.semester, updated_at = now()
        returning *
      `;
      return res.status(200).json(rowToCourse(rows[0]));
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'Thiếu id' });
      await sql`delete from courses where id = ${id}`;
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/courses]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
