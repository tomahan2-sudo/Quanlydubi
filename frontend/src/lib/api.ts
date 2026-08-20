import {
  Seminarian,
  Course,
  PastoralAssignment,
  CalendarEvent,
  Activity,
  AppSettings,
  RectorProfile,
} from '../types';

export const DEFAULT_LIVE_URL = 'https://quanlydubi.vercel.app';

export function getBaseApiUrl(): string {
  try {
    const custom = localStorage.getItem('sms_api_url');
    if (custom !== null && custom !== undefined && custom.trim() !== '') {
      return custom.trim().replace(/\/$/, '');
    }
  } catch {}

  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return DEFAULT_LIVE_URL;
}

export function setCustomApiUrl(url: string | null): void {
  try {
    if (!url || url.trim() === '') {
      localStorage.removeItem('sms_api_url');
    } else {
      localStorage.setItem('sms_api_url', url.trim().replace(/\/$/, ''));
    }
  } catch {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}${path}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`${options?.method ?? 'GET'} ${path} failed with status: ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  testConnection: async (targetUrl?: string): Promise<{ ok: boolean; latencyMs: number; message: string }> => {
    const baseUrl = (targetUrl ?? getBaseApiUrl()).replace(/\/$/, '');
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // Test either /health, /, or root HEAD
      const res = await fetch(`${baseUrl}/health`, { 
        method: 'GET',
        signal: controller.signal 
      }).catch(async () => {
        return await fetch(`${baseUrl}`, { 
          method: 'GET',
          signal: controller.signal 
        });
      });
      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return { ok: true, latencyMs, message: `Kết nối thành công (${latencyMs}ms)` };
      }
      return { ok: true, latencyMs, message: `Đã phản hồi (HTTP ${res.status}, ${latencyMs}ms)` };
    } catch (e: any) {
      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;
      return { 
        ok: false, 
        latencyMs, 
        message: e?.name === 'AbortError' ? 'Hết thời gian chờ kết nối (Timeout)' : 'Không thể kết nối trực tiếp đến endpoint' 
      };
    }
  },

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
  rector: {
    get: () => request<RectorProfile | null>('/rector'),
    save: (r: RectorProfile) => request<RectorProfile>('/rector', { method: 'PUT', body: JSON.stringify(r) }),
  }
};

