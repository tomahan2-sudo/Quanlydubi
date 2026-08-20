import {
  Seminarian,
  Course,
  PastoralAssignment,
  CalendarEvent,
  Activity,
  AppSettings,
} from '../types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
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
    list: () => request<Seminarian[]>('/api/seminarians'),
    save: (s: Seminarian) =>
      request<Seminarian>('/api/seminarians', { method: 'POST', body: JSON.stringify(s) }),
    remove: (id: string) =>
      request<void>(`/api/seminarians?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  courses: {
    list: () => request<Course[]>('/api/courses'),
    save: (c: Course) => request<Course>('/api/courses', { method: 'POST', body: JSON.stringify(c) }),
    remove: (id: string) =>
      request<void>(`/api/courses?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  pastorals: {
    list: () => request<PastoralAssignment[]>('/api/pastorals'),
    save: (p: PastoralAssignment) =>
      request<PastoralAssignment>('/api/pastorals', { method: 'POST', body: JSON.stringify(p) }),
    remove: (id: string) =>
      request<void>(`/api/pastorals?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  events: {
    list: () => request<CalendarEvent[]>('/api/events'),
    save: (e: CalendarEvent) =>
      request<CalendarEvent>('/api/events', { method: 'POST', body: JSON.stringify(e) }),
    remove: (id: string) =>
      request<void>(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  activities: {
    list: () => request<Activity[]>('/api/activities'),
    save: (a: Activity) =>
      request<Activity>('/api/activities', { method: 'POST', body: JSON.stringify(a) }),
  },
  settings: {
    get: () => request<AppSettings | null>('/api/settings'),
    save: (s: AppSettings) =>
      request<AppSettings>('/api/settings', { method: 'PUT', body: JSON.stringify(s) }),
  },
};
