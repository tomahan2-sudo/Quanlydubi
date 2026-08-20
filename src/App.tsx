import React, { useState, useEffect } from 'react';
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

import { ViewType, Seminarian, CalendarEvent, Course, PastoralAssignment, AppSettings } from './types';
import {
  INITIAL_SEMINARIANS,
  INITIAL_COURSES,
  INITIAL_PASTORALS,
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES
} from './mockData';
import { api } from './lib/api';

const DEFAULT_SETTINGS: AppSettings = {
  seminaryName: 'Đại Chủng viện Thánh Giuse',
  rectorName: 'Cha Giuse Nguyễn Văn A (Linh mục Giám đốc)',
  diocese: 'Tổng Giáo phận Hà Nội',
  address: '40 Nhà Chung, Hàng Trống, Hoàn Kiếm, Hà Nội',
  currentYear: '2024 - 2025',
};

export function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Backend connection state: while `null` we're still probing /api on
  // mount; once resolved it's `true` (Vercel Postgres reachable — every
  // write goes through /api) or `false` (no backend — falls back to the
  // localStorage/mock-data behavior this app shipped with originally).
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Primary Data State with LocalStorage Persistence
  const [seminarians, setSeminarians] = useState<Seminarian[]>(() => {
    try {
      const saved = localStorage.getItem('sms_seminarians');
      return saved ? JSON.parse(saved) : INITIAL_SEMINARIANS;
    } catch {
      return INITIAL_SEMINARIANS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => INITIAL_COURSES);
  const [pastorals, setPastorals] = useState<PastoralAssignment[]>(() => INITIAL_PASTORALS);
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sms_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });
  const [activities, setActivities] = useState(() => INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // On first mount, try the real backend. If it answers, that becomes the
  // source of truth; otherwise we keep the original local-only behavior.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [sems, crs, pst, evs, acts, cfg] = await Promise.all([
          api.seminarians.list(),
          api.courses.list(),
          api.pastorals.list(),
          api.events.list(),
          api.activities.list(),
          api.settings.get(),
        ]);
        if (cancelled) return;
        setSeminarians(sems);
        setCourses(crs);
        setPastorals(pst);
        setEvents(evs);
        setActivities(acts);
        if (cfg) setSettings(cfg);
        setDbConnected(true);
      } catch (e) {
        console.warn('[app] Không kết nối được /api — dùng dữ liệu cục bộ.', e);
        if (!cancelled) setDbConnected(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('sms_seminarians', JSON.stringify(seminarians));
    } catch (e) {
      console.error(e);
    }
  }, [seminarians]);

  useEffect(() => {
    try {
      localStorage.setItem('sms_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

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
        await api.seminarians.save(saved);
        await api.activities.save(activity);
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
        await api.events.save(newEvent);
      } catch (e) {
        console.error('Lưu sự kiện thất bại:', e);
      }
    }
  };

  const handleSaveCourse = async (course: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      return exists ? prev.map((c) => (c.id === course.id ? course : c)) : [course, ...prev];
    });
    if (dbConnected) {
      try {
        await api.courses.save(course);
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
    setPastorals((prev) => {
      const exists = prev.some((p) => p.id === assignment.id);
      return exists ? prev.map((p) => (p.id === assignment.id ? assignment : p)) : [assignment, ...prev];
    });
    if (dbConnected) {
      try {
        await api.pastorals.save(assignment);
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
      await api.settings.save(next);
    }
  };

  const handleResetData = () => {
    setSeminarians(INITIAL_SEMINARIANS);
    setCourses(INITIAL_COURSES);
    setPastorals(INITIAL_PASTORALS);
    setEvents(INITIAL_EVENTS);
    setActivities(INITIAL_ACTIVITIES);
    setSelectedSeminarian(INITIAL_SEMINARIANS[0]);
    localStorage.removeItem('sms_seminarians');
    localStorage.removeItem('sms_events');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#74777f]">
          <div className="w-8 h-8 border-2 border-[#c4c6cf] border-t-[#002045] rounded-full animate-spin" />
          <p className="text-[13px] font-semibold">Đang tải dữ liệu...</p>
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
        />

        {/* Dynamic View Route */}
        <main className="flex-1">
          {dbConnected === false && (
            <div className="px-4 sm:px-6 md:px-8 pt-4">
              <div className="rounded-xl border border-[#ffb85c] bg-[#fff4e5] text-[#875200] text-[13px] font-semibold px-4 py-2.5">
                Chưa kết nối Vercel Postgres — đang dùng dữ liệu mẫu lưu tạm trên trình duyệt này.
                Xem <code className="bg-white/60 px-1 rounded">README.md</code> để kết nối cơ sở dữ liệu thật.
              </div>
            </div>
          )}

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
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
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
