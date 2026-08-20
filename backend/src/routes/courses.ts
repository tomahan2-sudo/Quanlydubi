import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sql } from '../db';
import { rowToCourse } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const coursesRouter = Router();

coursesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from courses order by created_at desc`;
    res.json(rows.map(rowToCourse));
  })
);

coursesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const c = req.body ?? {};
    if (!c.name) return res.status(400).json({ error: 'Thiếu name' });
    const id = c.id || `course-${randomUUID()}`;

    const rows = await sql`
      insert into courses (id, code, name, instructor, level, current_week, total_weeks, credits, semester)
      values (${id}, ${c.code ?? null}, ${c.name}, ${c.instructor ?? null}, ${c.level ?? null},
        ${c.currentWeek ?? 0}, ${c.totalWeeks ?? 0}, ${c.credits ?? 0}, ${c.semester ?? null})
      returning *
    `;
    res.status(201).json(rowToCourse(rows[0]));
  })
);

coursesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const c = req.body ?? {};
    const rows = await sql`
      update courses set
        code = ${c.code ?? null}, name = ${c.name}, instructor = ${c.instructor ?? null},
        level = ${c.level ?? null}, current_week = ${c.currentWeek ?? 0},
        total_weeks = ${c.totalWeeks ?? 0}, credits = ${c.credits ?? 0}, semester = ${c.semester ?? null},
        updated_at = now()
      where id = ${req.params.id}
      returning *
    `;
    if (!rows[0]) return res.status(404).json({ error: 'Không tìm thấy môn học' });
    res.json(rowToCourse(rows[0]));
  })
);

coursesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await sql`delete from courses where id = ${req.params.id}`;
    res.status(204).end();
  })
);
