import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SeminarianListView } from './components/SeminarianListView';
import { SeminarianDetailView } from './components/SeminarianDetailView';
import { TrainingManagementView } from './components/TrainingManagementView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';

import { AddEditSeminarianModal } from './components/AddEditSeminarianModal';
import { PastoralMapModal } from './components/PastoralMapModal';
import { ReportModal } from './components/ReportModal';
import { ExportModal } from './components/ExportModal';
import { HelpModal } from './components/HelpModal';
import { RectorProfileModal } from './components/RectorProfileModal';

import { ViewType, Seminarian, CalendarEvent, Course, PastoralAssignment, AppSettings, RectorProfile } from './types';
import {
  INITIAL_SEMINARIANS,
  INITIAL_COURSES,
  INITIAL_PASTORALS,
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES,
  DEFAULT_RECTOR
} from './mockData';
import { api, getBaseApiUrl, DEFAULT_LIVE_URL } from './lib/api';

const DEFAULT_SETTINGS: AppSettings = {
  seminaryName: 'Đại Chủng viện Thánh Giuse',
  rectorName: 'Cha Giuse Nguyễn Văn Tuấn (Linh mục Giám đốc)',
  diocese: 'Tổng Giáo phận Hà Nội',
  address: '40 Nhà Chung, Hàng Trống, Hoàn Kiếm, Hà Nội',
  currentYear: '2024 - 2025',
  apiUrl: DEFAULT_LIVE_URL,
  autoSync: true,
  syncIntervalSeconds: 30,
  lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
};

export function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Backend connection state
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Rector Profile State (Persistent in localStorage and synced with API)
  const [rector, setRector] = useState<RectorProfile>(() => {
    try {
      const saved = localStorage.getItem('sms_rector_profile');
      return saved ? JSON.parse(saved) : DEFAULT_RECTOR;
    } catch {
      return DEFAULT_RECTOR;
    }
  });

  // Primary Data State with LocalStorage Persistence
  const [seminarians, setSeminarians] = useState<Seminarian[]>(() => {
    try {
      const saved = localStorage.getItem('sms_seminarians');
      return saved ? JSON.parse(saved) : INITIAL_SEMINARIANS;
    } catch {
      return INITIAL_SEMINARIANS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('sms_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [pastorals, setPastorals] = useState<PastoralAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('sms_pastorals');
      return saved ? JSON.parse(saved) : INITIAL_PASTORALS;
    } catch {
      return INITIAL_PASTORALS;
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sms_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [activities, setActivities] = useState<typeof INITIAL_ACTIVITIES>(() => {
    try {
      const saved = localStorage.getItem('sms_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('sms_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Selected Seminarian for Detail view
  const [selectedSeminarian, setSelectedSeminarian] = useState<Seminarian>(
    seminarians[0] || INITIAL_SEMINARIANS[0]
  );

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingSeminarian, setEditingSeminarian] = useState<Seminarian | null>(null);
  const [isPastoralMapOpen, setIsPastoralMapOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isRectorModalOpen, setIsRectorModalOpen] = useState(false);

  // Fetch / Sync function
  const syncWithServer = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsSyncing(true);
    try {
      const [sems, crs, pst, evs, acts, cfg, rec] = await Promise.all([
        api.seminarians.list().catch(() => null),
        api.courses.list().catch(() => null),
        api.pastorals.list().catch(() => null),
        api.events.list().catch(() => null),
        api.activities.list().catch(() => null),
        api.settings.get().catch(() => null),
        api.rector.get().catch(() => null),
      ]);

      if (sems && sems.length > 0) setSeminarians(sems);
      if (crs && crs.length > 0) setCourses(crs);
      if (pst && pst.length > 0) setPastorals(pst);
      if (evs && evs.length > 0) setEvents(evs);
      if (acts && acts.length > 0) setActivities(acts);
      if (cfg) setSettings(cfg);
      if (rec) setRector(rec);

      const nowStr = new Date().toLocaleTimeString('vi-VN');
      setSettings(prev => ({ ...prev, lastSyncedAt: nowStr }));
      setDbConnected(true);
    } catch (e) {
      console.warn('[app] Chưa đồng bộ được với endpoint, chuyển sang chế độ cục bộ.', e);
      setDbConnected(false);
    } finally {
      if (!isSilent) setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await syncWithServer(true);
      if (isMounted) setIsLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [syncWithServer]);

  // Periodic Auto-Sync Timer
  useEffect(() => {
    if (settings.autoSync === false) return;

    const intervalMs = (settings.syncIntervalSeconds || 30) * 1000;
    const timer = setInterval(() => {
      syncWithServer(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.autoSync, settings.syncIntervalSeconds, syncWithServer]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sms_rector_profile', JSON.stringify(rector));
    } catch (e) {
      console.error(e);
    }
  }, [rector]);

  useEffect(() => {
    try {
      localStorage.setItem('sms_seminarians', JSON.stringify(seminarians));
    } catch (e) {
      console.error(e);
    }
  }, [seminarians]);

  useEffect(() => {
    try {
      localStorage.setItem('sms_courses', JSON.stringify(courses));
      localStorage.setItem('sms_pastorals', JSON.stringify(pastorals));
      localStorage.setItem('sms_events', JSON.stringify(events));
      localStorage.setItem('sms_activities', JSON.stringify(activities));
      localStorage.setItem('sms_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [courses, pastorals, events, activities, settings]);

  // Handlers
  const handleSelectSeminarian = (sem: Seminarian) => {
    setSelectedSeminarian(sem);
    setCurrentView('detail');
  };

  const handleOpenAddModal = () => {
    setEditingSeminarian(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (sem: Seminarian) => {
    setEditingSeminarian(sem);
    setIsAddEditModalOpen(true);
  };

  const handleSaveRectorProfile = async (updated: RectorProfile) => {
    setRector(updated);
    setSettings(prev => ({
      ...prev,
      rectorName: `Cha ${updated.saintName} ${updated.fullName} (${updated.title})`
    }));

    if (dbConnected) {
      try {
        await api.rector.save(updated);
      } catch (e) {
        console.warn('Lưu thông tin Cha Giám đốc vào server thất bại:', e);
      }
    }
  };

  const handleSaveSeminarian = async (saved: Seminarian) => {
    const isNew = !seminarians.some((s) => s.id === saved.id);

    setSeminarians((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s));
      }
      return [saved, ...prev];
    });

    if (selectedSeminarian.id === saved.id) {
      setSelectedSeminarian(saved);
    }

    const activity = {
      id: `act-${Date.now()}`,
      title: isNew
        ? `Đã tiếp nhận hồ sơ mới: ${saved.fullName}`
        : `Đã cập nhật hồ sơ chủng sinh ${saved.fullName}`,
      description: `Lớp: ${saved.stage} • Giáo phận ${saved.diocese}`,
      time: 'Vừa xong',
      type: (isNew ? 'admission' : 'review') as 'admission' | 'review',
    };
    setActivities((prev) => [activity, ...prev]);

    if (dbConnected) {
      try {
        if (isNew) {
          await api.seminarians.create(saved);
        } else {
          await api.seminarians.update(saved.id, saved);
        }
        await api.activities.create(activity);
      } catch (e) {
        console.error('Lưu chủng sinh vào cơ sở dữ liệu thất bại:', e);
      }
    }
  };

  const handleDeleteSeminarian = async (id: string) => {
    setSeminarians((prev) => prev.filter((s) => s.id !== id));
    if (selectedSeminarian.id === id) {
      setSelectedSeminarian(seminarians.find((s) => s.id !== id) || INITIAL_SEMINARIANS[0]);
      if (currentView === 'detail') {
        setCurrentView('seminarians');
      }
    }
    if (dbConnected) {
      try {
        await api.seminarians.remove(id);
      } catch (e) {
        console.error('Xóa chủng sinh thất bại:', e);
      }
    }
  };

  const handleAddEvent = async (newEvent: CalendarEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    if (dbConnected) {
      try {
        await api.events.create(newEvent);
      } catch (e) {
        console.error('Lưu sự kiện thất bại:', e);
      }
    }
  };

  const handleSaveCourse = async (course: Course) => {
    const isNew = !courses.some((c) => c.id === course.id);

    setCourses((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      return exists ? prev.map((c) => (c.id === course.id ? course : c)) : [course, ...prev];
    });
    if (dbConnected) {
      try {
        if (isNew) {
          await api.courses.create(course);
        } else {
          await api.courses.update(course.id, course);
        }
      } catch (e) {
        console.error('Lưu môn học thất bại:', e);
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (dbConnected) {
      try {
        await api.courses.remove(id);
      } catch (e) {
        console.error('Xóa môn học thất bại:', e);
      }
    }
  };

  const handleSavePastoral = async (assignment: PastoralAssignment) => {
    const isNew = !pastorals.some((p) => p.id === assignment.id);

    setPastorals((prev) => {
      const exists = prev.some((p) => p.id === assignment.id);
      return exists ? prev.map((p) => (p.id === assignment.id ? assignment : p)) : [assignment, ...prev];
    });
    if (dbConnected) {
      try {
        if (isNew) {
          await api.pastorals.create(assignment);
        } else {
          await api.pastorals.update(assignment.id, assignment);
        }
      } catch (e) {
        console.error('Lưu phân công mục vụ thất bại:', e);
      }
    }
  };

  const handleDeletePastoral = async (id: string) => {
    setPastorals((prev) => prev.filter((p) => p.id !== id));
    if (dbConnected) {
      try {
        await api.pastorals.remove(id);
      } catch (e) {
        console.error('Xóa phân công mục vụ thất bại:', e);
      }
    }
  };

  const handleSaveSettings = async (next: AppSettings) => {
    setSettings(next);
    if (dbConnected) {
      try {
        await api.settings.save(next);
      } catch (e) {
        console.warn('Lưu cài đặt server thất bại:', e);
      }
    }
  };

  const handleResetData = () => {
    setSeminarians(INITIAL_SEMINARIANS);
    setCourses(INITIAL_COURSES);
    setPastorals(INITIAL_PASTORALS);
    setEvents(INITIAL_EVENTS);
    setActivities(INITIAL_ACTIVITIES);
    setRector(DEFAULT_RECTOR);
    setSettings(DEFAULT_SETTINGS);
    setSelectedSeminarian(INITIAL_SEMINARIANS[0]);
    localStorage.removeItem('sms_seminarians');
    localStorage.removeItem('sms_events');
    localStorage.removeItem('sms_courses');
    localStorage.removeItem('sms_pastorals');
    localStorage.removeItem('sms_activities');
    localStorage.removeItem('sms_settings');
    localStorage.removeItem('sms_rector_profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#74777f]">
          <div className="w-8 h-8 border-2 border-[#c4c6cf] border-t-[#002045] rounded-full animate-spin" />
          <p className="text-[13px] font-semibold">Đang kết nối hệ thống Đại Chủng Viện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#181c1e] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        rector={rector}
        onOpenRectorModal={() => setIsRectorModalOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={globalSearch}
          onSearchChange={(q) => {
            setGlobalSearch(q);
            if (q && currentView !== 'seminarians') {
              setCurrentView('seminarians');
            }
          }}
          activities={activities}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          rector={rector}
          onOpenRectorModal={() => setIsRectorModalOpen(true)}
          dbConnected={dbConnected}
          onManualSync={() => syncWithServer(false)}
          isSyncing={isSyncing}
        />

        {/* Dynamic View Route */}
        <main className="flex-1">
          {currentView === 'dashboard' && (
            <DashboardView
              seminarians={seminarians}
              activities={activities}
              events={events}
              onNavigate={(v) => setCurrentView(v)}
              onSelectSeminarian={handleSelectSeminarian}
            />
          )}

          {currentView === 'seminarians' && (
            <SeminarianListView
              seminarians={seminarians}
              onSelectSeminarian={handleSelectSeminarian}
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onDeleteSeminarian={handleDeleteSeminarian}
            />
          )}

          {currentView === 'detail' && (
            <SeminarianDetailView
              seminarian={selectedSeminarian}
              onBack={() => setCurrentView('seminarians')}
              onOpenEditModal={handleOpenEditModal}
              onUpdateSeminarian={handleSaveSeminarian}
            />
          )}

          {currentView === 'training' && (
            <TrainingManagementView
              courses={courses}
              pastorals={pastorals}
              seminarians={seminarians}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenMapModal={() => setIsPastoralMapOpen(true)}
              onSelectSeminarian={handleSelectSeminarian}
              onSaveCourse={handleSaveCourse}
              onDeleteCourse={handleDeleteCourse}
              onSavePastoral={handleSavePastoral}
              onDeletePastoral={handleDeletePastoral}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              events={events}
              onAddEvent={handleAddEvent}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              dbConnected={dbConnected === true}
              onResetData={handleResetData}
              rector={rector}
              onOpenRectorModal={() => setIsRectorModalOpen(true)}
              onManualSync={() => syncWithServer(false)}
              isSyncing={isSyncing}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <RectorProfileModal
        isOpen={isRectorModalOpen}
        onClose={() => setIsRectorModalOpen(false)}
        rector={rector}
        onSave={handleSaveRectorProfile}
      />

      <AddEditSeminarianModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveSeminarian}
        editingSeminarian={editingSeminarian}
      />

      <PastoralMapModal
        isOpen={isPastoralMapOpen}
        onClose={() => setIsPastoralMapOpen(false)}
        pastorals={pastorals}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        seminarians={seminarians}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        seminarians={seminarians}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}

export default App;
