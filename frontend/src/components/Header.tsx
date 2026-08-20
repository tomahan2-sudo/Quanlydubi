import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Crown, 
  RefreshCw, 
  SlidersHorizontal,
  CloudCheck,
  CloudOff
} from 'lucide-react';
import { Activity, RectorProfile } from '../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activities: Activity[];
  onOpenHelp: () => void;
  rector: RectorProfile;
  onOpenRectorModal: () => void;
  dbConnected: boolean | null;
  onManualSync?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  activities,
  onOpenHelp,
  rector,
  onOpenRectorModal,
  dbConnected,
  onManualSync,
  isSyncing,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-[#e5e9eb] px-4 md:px-8 flex items-center justify-between shadow-2xs">
      {/* Left side: Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] transition-colors cursor-pointer"
          aria-label="Mở danh mục"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-[17px] md:text-[19px] text-[#002045] tracking-tight truncate">
            Seminarian Management System
          </h2>
          <p className="text-[11px] text-[#74777f] hidden sm:block">
            Đại Chủng Viện Thánh Giuse • Ban Đào Tạo
          </p>
        </div>
      </div>

      {/* Right side: Sync Status, Search, Notifications, Help, Rector Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live Database / Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            title={dbConnected ? 'Đã liên kết dữ liệu trực tiếp. Nhấn để cập nhật ngay' : 'Đang dùng dữ liệu cục bộ. Nhấn để kiểm tra kết nối https://quanlydubi.vercel.app'}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              dbConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isSyncing ? 'Đang cập nhật...' : dbConnected ? 'quanlydubi.vercel.app' : 'Chế độ Cục bộ'}</span>
            {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />}
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777f]" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhanh chủng sinh, môn học..."
            className="w-52 md:w-60 pl-9 pr-4 py-1.5 bg-[#f1f4f6] text-[13px] text-[#181c1e] rounded-full border border-transparent focus:border-[#adc7f7] focus:bg-white focus:ring-2 focus:ring-[#002045]/10 outline-none transition-all placeholder-[#74777f]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777f] hover:text-[#181c1e] cursor-pointer"
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
            className="p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] hover:text-[#002045] relative transition-colors cursor-pointer"
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
                    className="text-[12px] font-semibold text-[#002045] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
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
          className="p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] hover:text-[#002045] transition-colors cursor-pointer"
          title="Trợ giúp & Hướng dẫn"
          aria-label="Trợ giúp"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Rector Profile Trigger */}
        <div className="relative">
          <button
            id="rector-header-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full hover:bg-[#f1f4f6] transition-all cursor-pointer border border-transparent hover:border-[#c4c6cf]"
            title={`Mục Cha Giám Đốc: ${rector.saintName} ${rector.fullName}`}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-[#c4c6cf] shadow-xs ring-2 ring-[#002045]/10 shrink-0">
              <img
                src={rector.avatarUrl}
                alt={rector.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-[12.5px] font-bold text-[#002045] leading-tight truncate max-w-[130px]">
                {rector.saintName} {rector.fullName}
              </p>
              <p className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Super Admin</span>
              </p>
            </div>
          </button>

          {/* Quick Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header preview */}
                <div className="p-4 bg-gradient-to-br from-[#002045] to-[#1a365d] text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ffddba] shadow-xs shrink-0">
                    <img
                      src={rector.avatarUrl}
                      alt={rector.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-[#ffddba]/20 text-[#ffddba] border border-[#ffddba]/30 text-[10px] font-bold uppercase">
                        Super Admin
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-white truncate mt-0.5">
                      {rector.saintName} {rector.fullName}
                    </h4>
                    <p className="text-[11px] text-[#adc7f7] truncate">
                      {rector.title}
                    </p>
                  </div>
                </div>

                {/* Body Actions */}
                <div className="p-2 space-y-1 text-[13px]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenRectorModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#002045] font-bold hover:bg-[#e8effd] transition-colors text-left cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#002045]" />
                    <span>Đổi hình, Tên & Quyền Cha Giám Đốc</span>
                  </button>

                  <div className="px-3 py-2 text-[11.5px] text-[#74777f] border-t border-[#f1f4f6]">
                    <p>Giáo phận: <strong>{rector.diocese}</strong></p>
                    <p>Quyền hạn: <strong className="text-emerald-700">Tối cao 10/10 module</strong></p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

