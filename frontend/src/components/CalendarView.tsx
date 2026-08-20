import React, { useState } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Tag, 
  X, 
  Sparkles
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [currentMonth, setCurrentMonth] = useState('Tháng 11, 2024');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(events[0] || null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2024-11-20');
  const [time, setTime] = useState('08:00 - 10:30');
  const [type, setType] = useState<'retreat' | 'meeting' | 'exam' | 'liturgy' | 'holiday'>('retreat');
  const [location, setLocation] = useState('Nhà nguyện Đại chủng viện');
  const [description, setDescription] = useState('');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title,
      date,
      time,
      type,
      location,
      description,
      color:
        type === 'retreat'
          ? '#875200'
          : type === 'meeting'
          ? '#002045'
          : type === 'liturgy'
          ? '#ba1a1a'
          : '#455f88',
    };

    onAddEvent(newEvent);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getBadgeStyle = (t: string) => {
    switch (t) {
      case 'retreat':
        return 'bg-[#ffddba] text-[#875200] border-[#ffb866]';
      case 'meeting':
        return 'bg-[#d6e3ff] text-[#002045] border-[#adc7f7]';
      case 'liturgy':
        return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffb4ab]';
      case 'exam':
        return 'bg-[#fae361]/40 text-[#6b5f00] border-[#fae361]';
      default:
        return 'bg-[#e5e9eb] text-[#43474e] border-[#c4c6cf]';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Lịch Phụng vụ & Sự kiện
          </h1>
          <p className="text-[14px] text-[#74777f] mt-1 font-normal">
            Theo dõi kế hoạch sinh hoạt, tĩnh tâm, hội họp và các kỳ thi tại Đại chủng viện.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#002045] hover:bg-[#1a365d] text-white px-4 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#002045] text-white shadow-2xs'
              : 'bg-white text-[#43474e] border border-[#c4c6cf] hover:bg-[#f1f4f6]'
          }`}
        >
          Tất cả ({events.length})
        </button>
        <button
          onClick={() => setFilterType('retreat')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            filterType === 'retreat'
              ? 'bg-[#875200] text-white shadow-2xs'
              : 'bg-white text-[#43474e] border border-[#c4c6cf] hover:bg-[#f1f4f6]'
          }`}
        >
          Tĩnh tâm & Linh thao
        </button>
        <button
          onClick={() => setFilterType('meeting')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            filterType === 'meeting'
              ? 'bg-[#1a365d] text-white shadow-2xs'
              : 'bg-white text-[#43474e] border border-[#c4c6cf] hover:bg-[#f1f4f6]'
          }`}
        >
          Họp Ban Giám đốc
        </button>
        <button
          onClick={() => setFilterType('liturgy')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            filterType === 'liturgy'
              ? 'bg-[#ba1a1a] text-white shadow-2xs'
              : 'bg-white text-[#43474e] border border-[#c4c6cf] hover:bg-[#f1f4f6]'
          }`}
        >
          Phụng vụ & Lễ trọng
        </button>
        <button
          onClick={() => setFilterType('exam')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            filterType === 'exam'
              ? 'bg-[#6b5f00] text-white shadow-2xs'
              : 'bg-white text-[#43474e] border border-[#c4c6cf] hover:bg-[#f1f4f6]'
          }`}
        >
          Khảo thí & Thi cử
        </button>
      </div>

      {/* Main Layout: List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Events Grid */}
        <div className="lg:col-span-2 space-y-4">
          {filteredEvents.map((evt) => {
            const isSelected = selectedEvent?.id === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`bg-white rounded-2xl p-5 shadow-xs border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-[#002045] ring-2 ring-[#002045]/10 shadow-md'
                    : 'border-[#e0e3e5] hover:border-[#adc7f7]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-3 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: evt.color || '#002045' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[16px] text-[#002045]">
                        {evt.title}
                      </h3>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase ${getBadgeStyle(
                          evt.type
                        )}`}
                      >
                        {evt.type === 'retreat'
                          ? 'Tĩnh tâm'
                          : evt.type === 'meeting'
                          ? 'Hội họp'
                          : evt.type === 'liturgy'
                          ? 'Phụng vụ'
                          : 'Học vụ'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#74777f] mt-1.5 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#1a365d]" />
                        {evt.date} ({evt.time})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1a365d]" />
                        {evt.location}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="text-[12px] font-bold text-[#002045] hover:underline self-end sm:self-center shrink-0">
                  Xem chi tiết →
                </button>
              </div>
            );
          })}
        </div>

        {/* Right 1 Column: Detail Box */}
        <div className="space-y-6">
          {selectedEvent ? (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border uppercase ${getBadgeStyle(
                    selectedEvent.type
                  )}`}
                >
                  {selectedEvent.type}
                </span>
                <span className="text-[12px] text-[#74777f] font-semibold">
                  {selectedEvent.date}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#002045] mb-3">
                {selectedEvent.title}
              </h2>

              <p className="text-[14px] text-[#43474e] leading-relaxed mb-6">
                {selectedEvent.description || 'Chương trình được tổ chức theo quy chế đào tạo Đại chủng viện.'}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#e0e3e5] text-[13px]">
                <div className="flex items-center gap-3 text-[#181c1e]">
                  <Clock className="w-4 h-4 text-[#002045]" />
                  <span><strong>Thời gian:</strong> {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[#181c1e]">
                  <MapPin className="w-4 h-4 text-[#002045]" />
                  <span><strong>Địa điểm:</strong> {selectedEvent.location}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-[#74777f] border border-[#e0e3e5]">
              Chọn một sự kiện để xem chi tiết
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#e0e3e5] animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#e0e3e5]">
              <h3 className="font-bold text-[18px] text-[#002045]">
                Thêm Sự kiện / Lịch mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f1f4f6] text-[#74777f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Tiêu đề sự kiện *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tĩnh tâm tháng 12..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Ngày diễn ra
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Khung giờ
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 - 11:30"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Loại sự kiện
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
                  >
                    <option value="retreat">Tĩnh tâm & Linh thao</option>
                    <option value="meeting">Họp Ban Giám đốc</option>
                    <option value="liturgy">Phụng vụ & Thánh lễ</option>
                    <option value="exam">Khảo thí & Học vụ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Nhà nguyện Chính..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Mô tả / Ghi chú
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi chú chi tiết cho quý thầy và ban phụ trách..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[13px] font-bold hover:bg-[#f1f4f6]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white text-[13px] font-bold shadow-sm"
                >
                  Lưu sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
