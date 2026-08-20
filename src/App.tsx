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

import { ViewType, Seminarian, CalendarEvent } from './types';
import { 
  INITIAL_SEMINARIANS, 
  INITIAL_COURSES, 
  INITIAL_PASTORALS, 
  INITIAL_EVENTS, 
  INITIAL_ACTIVITIES 
} from './mockData';

export function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Primary Data State with LocalStorage Persistence
  const [seminarians, setSeminarians] = useState<Seminarian[]>(() => {
    try {
      const saved = localStorage.getItem('sms_seminarians');
      return saved ? JSON.parse(saved) : INITIAL_SEMINARIANS;
    } catch {
      return INITIAL_SEMINARIANS;
    }
  });

  const [courses, setCourses] = useState(() => INITIAL_COURSES);
  const [pastorals, setPastorals] = useState(() => INITIAL_PASTORALS);
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sms_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });
  const [activities, setActivities] = useState(() => INITIAL_ACTIVITIES);

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

  const handleSaveSeminarian = (saved: Seminarian) => {
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

    // Add activity log
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: editingSeminarian
          ? `Đã cập nhật hồ sơ chủng sinh ${saved.fullName}`
          : `Đã tiếp nhận hồ sơ mới: ${saved.fullName}`,
        description: `Lớp: ${saved.stage} • Giáo phận ${saved.diocese}`,
        time: 'Vừa xong',
        type: 'user',
      },
      ...prev,
    ]);
  };

  const handleDeleteSeminarian = (id: string) => {
    setSeminarians((prev) => prev.filter((s) => s.id !== id));
    if (selectedSeminarian.id === id) {
      setSelectedSeminarian(seminarians.find((s) => s.id !== id) || INITIAL_SEMINARIANS[0]);
      if (currentView === 'detail') {
        setCurrentView('seminarians');
      }
    }
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
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
