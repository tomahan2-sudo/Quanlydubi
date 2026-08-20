import {
  Seminarian,
  Course,
  PastoralAssignment,
  CalendarEvent,
  Activity,
  AppSettings,
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`${options?.method ?? 'GET'} ${path} failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  seminarians: {
    list: () => request<Seminarian[]>('/seminarians'),
    create: (s: Seminarian) =>
      request<Seminarian>('/seminarians', { method: 'POST', body: JSON.stringify(s) }),
    update: (id: string, s: Seminarian) =>
      request<Seminarian>(`/seminarians/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(s),
      }),
    remove: (id: string) =>
      request<void>(`/seminarians/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  courses: {
    list: () => request<Course[]>('/courses'),
    create: (c: Course) => request<Course>('/courses', { method: 'POST', body: JSON.stringify(c) }),
    update: (id: string, c: Course) =>
      request<Course>(`/courses/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(c) }),
    remove: (id: string) =>
      request<void>(`/courses/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  pastorals: {
    list: () => request<PastoralAssignment[]>('/pastorals'),
    create: (p: PastoralAssignment) =>
      request<PastoralAssignment>('/pastorals', { method: 'POST', body: JSON.stringify(p) }),
    update: (id: string, p: PastoralAssignment) =>
      request<PastoralAssignment>(`/pastorals/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(p),
      }),
    remove: (id: string) =>
      request<void>(`/pastorals/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  events: {
    list: () => request<CalendarEvent[]>('/events'),
    create: (e: CalendarEvent) =>
      request<CalendarEvent>('/events', { method: 'POST', body: JSON.stringify(e) }),
    remove: (id: string) =>
      request<void>(`/events/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  activities: {
    list: () => request<Activity[]>('/activities'),
    create: (a: Activity) =>
      request<Activity>('/activities', { method: 'POST', body: JSON.stringify(a) }),
  },
  settings: {
    get: () => request<AppSettings | null>('/settings'),
    save: (s: AppSettings) => request<AppSettings>('/settings', { method: 'PUT', body: JSON.stringify(s) }),
  },
};
