import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { Activity } from '../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activities: Activity[];
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  activities,
  onOpenHelp,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-[#e5e9eb] px-4 md:px-8 flex items-center justify-between shadow-2xs">
      {/* Left side: Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] transition-colors"
          aria-label="Mở danh mục"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-[18px] md:text-[20px] text-[#002045] tracking-tight truncate">
          Seminarian Management System
        </h2>
      </div>

      {/* Right side: Search, Notifications, Help, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777f]" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhanh chủng sinh, môn học..."
            className="w-56 md:w-64 pl-9 pr-4 py-1.5 bg-[#f1f4f6] text-[13px] text-[#181c1e] rounded-full border border-transparent focus:border-[#adc7f7] focus:bg-white focus:ring-2 focus:ring-[#002045]/10 outline-none transition-all placeholder-[#74777f]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] hover:text-[#002045] relative transition-colors"
            title="Thông báo"
            aria-label="Xem thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 border-b border-[#e5e9eb] flex items-center justify-between bg-[#f7fafc]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#002045]" />
                    <h3 className="font-bold text-[14px] text-[#002045]">Thông báo mới</h3>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#adc7f7]/40 text-[#002045] px-2 py-0.5 rounded-full">
                    {activities.length} tin
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#f1f4f6]">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3.5 hover:bg-[#f7fafc] transition-colors text-left">
                      <p className="text-[13px] font-semibold text-[#181c1e] leading-snug">
                        {act.title}
                      </p>
                      <p className="text-[12px] text-[#74777f] mt-1 line-clamp-2">
                        {act.description}
                      </p>
                      <span className="inline-block text-[11px] text-[#74777f] font-medium mt-1.5">
                        {act.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-[#f7fafc] border-t border-[#e5e9eb] text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[12px] font-semibold text-[#002045] hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đánh dấu tất cả đã đọc
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Button */}
        <button
          id="help-btn"
          onClick={onOpenHelp}
          className="p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] hover:text-[#002045] transition-colors"
          title="Trợ giúp & Hướng dẫn"
          aria-label="Trợ giúp"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Rector Profile Avatar */}
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-[#c4c6cf] shadow-xs cursor-pointer ml-1 ring-2 ring-transparent hover:ring-[#adc7f7] transition-all">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI-HJLLKFxOY8kIHFjYQvSGaa3K3VisUaN-7LgtEFHvR9kBoOFQpkW0AJjBDb9lo0eIEzv28Z-zbvQViXvS9dn50NvHQ1_Tel0uN60yUf5zzq62FNDD4aP0Cf9W3gjbSOXuqj717gQ4fZl_dYHz8icxY36VQMbjPWzmSEFEXpouOFGz11TzpjCA3nKTOJMl3l7BZraV_Y6WKhkvtBQlMvkrJkN7ILyZa178cxG-HWWVujgmqas6Mzv"
            alt="Cha Giám đốc"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
