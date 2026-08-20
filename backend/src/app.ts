import express from 'express';
import cors from 'cors';
import { seminariansRouter } from './routes/seminarians';
import { coursesRouter } from './routes/courses';
import { pastoralsRouter } from './routes/pastorals';
import { eventsRouter } from './routes/events';
import { activitiesRouter } from './routes/activities';
import { settingsRouter } from './routes/settings';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header (curl, server-to-server, health checks) is allowed.
      // Otherwise the origin must be explicitly listed in ALLOWED_ORIGINS.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} không được phép (CORS)`));
    },
  })
);
app.use(express.json({ limit: '5mb' }));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'quanlydubi-backend' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/seminarians', seminariansRouter);
app.use('/courses', coursesRouter);
app.use('/pastorals', pastoralsRouter);
app.use('/events', eventsRouter);
app.use('/activities', activitiesRouter);
app.use('/settings', settingsRouter);

// Central error handler. Route handlers are wrapped in asyncHandler() so
// rejected promises (failed queries etc.) land here instead of crashing.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[backend]', err);
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' });
});
