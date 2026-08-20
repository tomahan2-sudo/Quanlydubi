import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarDays, 
  Settings, 
  Church, 
  X
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mobileOpen,
  onCloseMobile,
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
            className="md:hidden p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f]"
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
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] ${
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
          <div className="bg-white/80 rounded-xl p-3 flex items-center gap-3 border border-[#e0e3e5] shadow-xs">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c4c6cf] shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI-HJLLKFxOY8kIHFjYQvSGaa3K3VisUaN-7LgtEFHvR9kBoOFQpkW0AJjBDb9lo0eIEzv28Z-zbvQViXvS9dn50NvHQ1_Tel0uN60yUf5zzq62FNDD4aP0Cf9W3gjbSOXuqj717gQ4fZl_dYHz8icxY36VQMbjPWzmSEFEXpouOFGz11TzpjCA3nKTOJMl3l7BZraV_Y6WKhkvtBQlMvkrJkN7ILyZa178cxG-HWWVujgmqas6Mzv"
                alt="Cha Giám đốc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden flex-1 text-left">
              <p className="text-[13px] font-bold text-[#181c1e] truncate leading-tight">
                Cha Giám đốc
              </p>
              <p className="text-[11px] text-[#74777f] font-medium truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
