import React, { useState } from 'react';
import { 
  Users, 
  Footprints, 
  Hourglass, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Megaphone, 
  UserPlus, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Seminarian, Activity, CalendarEvent, ViewType } from '../types';
import { CLASS_DISTRIBUTION } from '../mockData';

interface DashboardViewProps {
  seminarians: Seminarian[];
  activities: Activity[];
  events: CalendarEvent[];
  onNavigate: (view: ViewType) => void;
  onSelectSeminarian: (sem: Seminarian) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  seminarians,
  activities,
  events,
  onNavigate,
  onSelectSeminarian,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Calendar dates generation for November 2024
  // Nov 1, 2024 was a Friday (T6). Previous month Oct ends with 31 days.
  const prevDays = [28, 29, 30, 31];
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Tổng quan
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#43474e] mt-1 font-normal">
            Theo dõi số liệu và tình hình học tập tại Chủng viện.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="view-seminarians-btn"
            onClick={() => onNavigate('seminarians')}
            className="px-4 py-2 bg-white hover:bg-[#f1f4f6] text-[#002045] border border-[#c4c6cf] rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#1a365d]" />
            Xem danh sách ({seminarians.length})
          </button>
          <button
            id="view-training-btn"
            onClick={() => onNavigate('training')}
            className="px-4 py-2 bg-[#002045] hover:bg-[#1a365d] text-white rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>Quản lý đào tạo</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Tổng số chủng sinh */}
        <div 
          id="stat-card-total"
          onClick={() => onNavigate('seminarians')}
          className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] hover:shadow-md hover:border-[#adc7f7] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#d6e3ff] text-[#002045] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#74777f] mb-1">
              Tổng số chủng sinh
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
              248
            </h3>
          </div>
        </div>

        {/* Card 2: Thực tập mục vụ */}
        <div 
          id="stat-card-pastoral"
          onClick={() => onNavigate('training')}
          className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] hover:shadow-md hover:border-[#ffb866] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffddba] text-[#875200] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Footprints className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#74777f] mb-1">
              Thực tập mục vụ
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
              32
            </h3>
          </div>
        </div>

        {/* Card 3: Số chủng sinh năm Thử */}
        <div 
          id="stat-card-probation"
          onClick={() => onNavigate('seminarians')}
          className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] hover:shadow-md hover:border-[#dcc748] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#fae361]/50 text-[#6b5f00] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Hourglass className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#74777f] mb-1">
              Số chủng sinh năm Thử
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
              45
            </h3>
          </div>
        </div>

        {/* Card 4: Sự kiện sắp tới */}
        <div 
          id="stat-card-events"
          onClick={() => onNavigate('calendar')}
          className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] hover:shadow-md hover:border-[#ffdad6] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#74777f] mb-1">
              Sự kiện sắp tới
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
              3
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Activities vs Calendar & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-[#002045]">
                Phân bổ chủng sinh theo lớp
              </h3>
              <span className="text-[12px] font-medium text-[#74777f] bg-[#f1f4f6] px-3 py-1 rounded-full">
                Niên khóa 2024 - 2025
              </span>
            </div>

            {/* Interactive Bar Chart */}
            <div className="relative h-64 flex items-end justify-between gap-3 border-b border-[#e0e3e5] pb-2 px-2 md:px-6">
              {CLASS_DISTRIBUTION.map((item, idx) => (
                <div
                  key={item.class}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {hoveredBar === idx && (
                    <div className="absolute -top-10 z-10 bg-[#002045] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-150">
                      {item.class}: {item.count} Chủng sinh
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className="w-full max-w-[48px] rounded-t-md transition-all duration-300 group-hover:brightness-95 group-hover:scale-y-[1.02] origin-bottom shadow-2xs"
                    style={{
                      height: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between px-2 md:px-6 mt-3 text-[12px] md:text-[13px] font-semibold text-[#43474e]">
              {CLASS_DISTRIBUTION.map((item) => (
                <span key={item.class} className="text-center flex-1">
                  {item.class}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[18px] font-bold text-[#002045]">
                Hoạt động gần đây
              </h3>
              <button
                id="view-all-activities-btn"
                onClick={() => onNavigate('seminarians')}
                className="text-[13px] font-semibold text-[#1a365d] hover:text-[#002045] hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Activity Item 1 */}
              <div 
                onClick={() => {
                  const s = seminarians.find(x => x.fullName.includes('Trần Văn B')) || seminarians[1];
                  onSelectSeminarian(s);
                }}
                className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-[#f7fafc] border border-transparent hover:border-[#e0e3e5] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#d6e3ff] flex items-center justify-center text-[#002045] shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-[#181c1e] leading-snug">
                    <span className="font-bold text-[#002045]">Cha Giuse Nguyễn Văn A</span> đã cập nhật nhận xét môn Triết học cho{' '}
                    <span className="font-bold text-[#002045]">Phêrô Trần Văn B</span>.
                  </p>
                  <p className="text-[12px] text-[#74777f] font-medium mt-1">2 giờ trước</p>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div 
                onClick={() => onNavigate('calendar')}
                className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-[#f7fafc] border border-transparent hover:border-[#e0e3e5] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffddba] flex items-center justify-center text-[#875200] shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-[#181c1e] leading-snug">
                    Thông báo mới: Lịch tĩnh tâm tháng 11 đã được cập nhật.
                  </p>
                  <p className="text-[12px] text-[#74777f] font-medium mt-1">Hôm qua</p>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div 
                onClick={() => onNavigate('seminarians')}
                className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-[#f7fafc] border border-transparent hover:border-[#e0e3e5] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#fae361]/50 flex items-center justify-center text-[#6b5f00] shrink-0 mt-0.5">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-[#181c1e] leading-snug">
                    Đã thêm 15 hồ sơ chủng sinh mới vào danh sách lớp Tu đức.
                  </p>
                  <p className="text-[12px] text-[#74777f] font-medium mt-1">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Mini Calendar & Upcoming Events */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[17px] font-bold text-[#002045]">
                Tháng 11, 2024
              </h3>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onNavigate('calendar')}
                  className="p-1.5 rounded-lg hover:bg-[#f1f4f6] text-[#74777f] hover:text-[#002045] transition-colors"
                  aria-label="Tháng trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onNavigate('calendar')}
                  className="p-1.5 rounded-lg hover:bg-[#f1f4f6] text-[#74777f] hover:text-[#002045] transition-colors"
                  aria-label="Tháng sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-[#74777f] mb-2">
              <div>T2</div>
              <div>T3</div>
              <div>T4</div>
              <div>T5</div>
              <div>T6</div>
              <div>T7</div>
              <div>CN</div>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-medium text-[#181c1e]">
              {prevDays.map((d) => (
                <div key={`prev-${d}`} className="py-2 text-[#c4c6cf]">
                  {d}
                </div>
              ))}

              {currentMonthDays.slice(0, 17).map((d) => {
                const isSelected = selectedDay === d;
                const isToday = d === 1;
                const isEvent10 = d === 10;
                const isEvent17 = d === 17;

                return (
                  <div
                    key={`curr-${d}`}
                    onClick={() => setSelectedDay(d)}
                    className={`py-2 rounded-full cursor-pointer transition-all relative flex flex-col items-center justify-center ${
                      isToday
                        ? 'bg-[#002045] text-white font-bold shadow-xs'
                        : isSelected
                        ? 'bg-[#adc7f7] text-[#002045] font-bold'
                        : 'hover:bg-[#f1f4f6]'
                    } ${
                      isEvent10 || isEvent17 ? 'text-[#ba1a1a] font-bold' : ''
                    }`}
                  >
                    <span>{d}</span>
                    {isEvent10 && (
                      <span className="w-1 h-1 bg-[#875200] rounded-full absolute bottom-1"></span>
                    )}
                    {isEvent17 && (
                      <span className="w-1 h-1 bg-[#ba1a1a] rounded-full absolute bottom-1"></span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mini Upcoming Events List */}
            <div className="mt-5 pt-5 border-t border-[#e0e3e5]">
              <h4 className="text-[14px] font-bold text-[#002045] mb-3 flex items-center justify-between">
                <span>Sự kiện sắp tới</span>
                <span className="text-[11px] font-semibold text-[#875200] bg-[#ffddba]/40 px-2 py-0.5 rounded-full">
                  Tháng 11
                </span>
              </h4>

              <div className="space-y-3.5">
                {/* Event 1 */}
                <div 
                  onClick={() => onNavigate('calendar')}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#f7fafc] transition-colors cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#875200] shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">
                      Tĩnh tâm tháng
                    </p>
                    <p className="text-[12px] text-[#74777f]">
                      10 Tháng 11, 08:00 - 17:00
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div 
                  onClick={() => onNavigate('calendar')}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#f7fafc] transition-colors cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#002045] shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">
                      Họp Ban Giám đốc
                    </p>
                    <p className="text-[12px] text-[#74777f]">
                      15 Tháng 11, 09:00 - 11:30
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-gradient-to-br from-[#1a365d] to-[#002045] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-[#adc7f7]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[12px] font-semibold uppercase tracking-wider">
                  Năm học 2024-2025
                </span>
              </div>
              <h4 className="text-[16px] font-bold leading-snug mb-2">
                Huấn luyện Chủng sinh theo Tông huấn Pastores Dabo Vobis
              </h4>
              <p className="text-[12px] text-[#adc7f7]/90 leading-relaxed mb-4">
                4 chiều kích đào tạo: Nhân bản, Thiêng liêng, Tri thức và Mục vụ.
              </p>
              <button
                onClick={() => onNavigate('training')}
                className="px-3.5 py-1.5 bg-white text-[#002045] hover:bg-[#adc7f7] rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
              >
                Xem quy trình đào tạo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
