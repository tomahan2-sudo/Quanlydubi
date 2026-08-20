import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sql } from '../db';
import { rowToEvent } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const eventsRouter = Router();

eventsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from calendar_events order by date asc`;
    res.json(rows.map(rowToEvent));
  })
);

eventsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const e = req.body ?? {};
    if (!e.title || !e.date) return res.status(400).json({ error: 'Thiếu title hoặc date' });
    const id = e.id || `event-${randomUUID()}`;

    const rows = await sql`
      insert into calendar_events (id, title, date, time, type, location, description, color)
      values (${id}, ${e.title}, ${e.date}, ${e.time ?? null}, ${e.type ?? null},
        ${e.location ?? null}, ${e.description ?? null}, ${e.color ?? null})
      returning *
    `;
    res.status(201).json(rowToEvent(rows[0]));
  })
);

eventsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const e = req.body ?? {};
    const rows = await sql`
      update calendar_events set
        title = ${e.title}, date = ${e.date}, time = ${e.time ?? null}, type = ${e.type ?? null},
        location = ${e.location ?? null}, description = ${e.description ?? null}, color = ${e.color ?? null}
      where id = ${req.params.id}
      returning *
    `;
    if (!rows[0]) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    res.json(rowToEvent(rows[0]));
  })
);

eventsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await sql`delete from calendar_events where id = ${req.params.id}`;
    res.status(204).end();
  })
);
