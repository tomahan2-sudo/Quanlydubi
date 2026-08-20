import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarDays, 
  Settings, 
  Church, 
  X,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { ViewType, RectorProfile } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  rector: RectorProfile;
  onOpenRectorModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mobileOpen,
  onCloseMobile,
  rector,
  onOpenRectorModal,
}) => {
  const navItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'seminarians', label: 'Danh sách chủng sinh', icon: Users },
    { id: 'training', label: 'Quản lý đào tạo', icon: GraduationCap },
    { id: 'calendar', label: 'Lịch', icon: CalendarDays },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Aside */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#f1f4f6] text-[#181c1e] shadow-sm z-40 flex flex-col py-4 transition-transform duration-300 ease-in-out border-r border-[#e0e3e5] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a365d] text-white flex items-center justify-center shadow-sm shrink-0">
              <Church className="w-5 h-5 text-[#adc7f7]" />
            </div>
            <div>
              <h1 className="font-bold text-[18px] text-[#002045] leading-tight tracking-tight">
                Quản lý Chủng sinh
              </h1>
              <p className="text-[12px] font-medium text-[#74777f]">Hệ thống Đào tạo</p>
            </div>
          </div>
          <button
            id="close-sidebar-btn"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f] cursor-pointer"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'seminarians');

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? 'bg-[#ffddba]/40 text-[#002045] font-bold shadow-xs'
                    : 'text-[#43474e] hover:bg-[#e5e9eb] hover:text-[#002045]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#002045]' : 'text-[#74777f]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="px-3 pt-3 mt-auto border-t border-[#e0e3e5]/60">
          <div 
            onClick={onOpenRectorModal}
            className="bg-white hover:bg-[#e8effd] rounded-2xl p-3 flex items-center gap-3 border border-[#e0e3e5] hover:border-[#adc7f7] shadow-xs cursor-pointer transition-all group"
            title="Nhấn để đổi hình, tên và quyền truy cập Cha Giám Đốc"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c4c6cf] shadow-xs shrink-0 ring-2 ring-[#ffddba]/60">
              <img
                src={rector.avatarUrl}
                alt={rector.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden flex-1 text-left">
              <p className="text-[13px] font-bold text-[#181c1e] truncate leading-tight group-hover:text-[#002045]">
                {rector.saintName} {rector.fullName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Super Admin</span>
                </span>
              </div>
            </div>
            <div className="p-1 text-[#74777f] group-hover:text-[#002045] transition-colors">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

