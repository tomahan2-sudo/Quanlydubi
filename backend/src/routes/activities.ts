import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sql } from '../db';
import { rowToActivity } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const activitiesRouter = Router();

activitiesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from activities order by created_at desc limit 50`;
    res.json(rows.map(rowToActivity));
  })
);

activitiesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const a = req.body ?? {};
    if (!a.title) return res.status(400).json({ error: 'Thiếu title' });
    const id = a.id || `act-${randomUUID()}`;

    const rows = await sql`
      insert into activities (id, type, title, description, time, author, icon)
      values (${id}, ${a.type ?? null}, ${a.title}, ${a.description ?? null}, ${a.time ?? null},
        ${a.author ?? null}, ${a.icon ?? null})
      returning *
    `;
    res.status(201).json(rowToActivity(rows[0]));
  })
);
