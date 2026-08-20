import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sql } from '../db';
import { rowToPastoral } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const pastoralsRouter = Router();

pastoralsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from pastoral_assignments order by created_at desc`;
    res.json(rows.map(rowToPastoral));
  })
);

pastoralsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const p = req.body ?? {};
    if (!p.locationName) return res.status(400).json({ error: 'Thiếu locationName' });
    const id = p.id || `pastoral-${randomUUID()}`;

    const rows = await sql`
      insert into pastoral_assignments (id, location_name, pastor, count, category, type, address, seminarians)
      values (${id}, ${p.locationName}, ${p.pastor ?? null}, ${p.count ?? 0}, ${p.category ?? null},
        ${p.type ?? null}, ${p.address ?? null}, ${JSON.stringify(p.seminarians ?? [])}::jsonb)
      returning *
    `;
    res.status(201).json(rowToPastoral(rows[0]));
  })
);

pastoralsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const p = req.body ?? {};
    const rows = await sql`
      update pastoral_assignments set
        location_name = ${p.locationName}, pastor = ${p.pastor ?? null}, count = ${p.count ?? 0},
        category = ${p.category ?? null}, type = ${p.type ?? null}, address = ${p.address ?? null},
        seminarians = ${JSON.stringify(p.seminarians ?? [])}::jsonb, updated_at = now()
      where id = ${req.params.id}
      returning *
    `;
    if (!rows[0]) return res.status(404).json({ error: 'Không tìm thấy phân công mục vụ' });
    res.json(rowToPastoral(rows[0]));
  })
);

pastoralsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await sql`delete from pastoral_assignments where id = ${req.params.id}`;
    res.status(204).end();
  })
);
