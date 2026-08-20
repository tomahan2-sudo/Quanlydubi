import { Router } from 'express';
import { sql } from '../db';
import { rowToSettings } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const settingsRouter = Router();

settingsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from app_settings where id = 1`;
    res.json(rows[0] ? rowToSettings(rows[0]) : null);
  })
);

settingsRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    const s = req.body ?? {};
    const rows = await sql`
      update app_settings set
        seminary_name = ${s.seminaryName}, rector_name = ${s.rectorName},
        diocese = ${s.diocese}, address = ${s.address}, current_year = ${s.currentYear},
        updated_at = now()
      where id = 1
      returning *
    `;
    res.json(rowToSettings(rows[0]));
  })
);
