import React from 'react';
import { X, HelpCircle, BookOpen, Users, GraduationCap, CalendarDays, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              Hướng dẫn Sử dụng Hệ thống Quản lý Chủng sinh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-[13px] text-[#181c1e]">
          <div className="p-3.5 bg-[#f7fafc] rounded-2xl border border-[#e0e3e5] space-y-1">
            <h4 className="font-bold text-[#002045] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1a365d]" />
              1. Quản lý Danh sách & Hồ sơ Chủng sinh
            </h4>
            <p className="text-[#43474e] leading-relaxed">
              Cho phép tra cứu theo Tên Thánh, Họ tên, Mã số, Lớp, Khóa, Giáo phận. Bạn có thể nhấn trực tiếp vào bất kỳ dòng nào để xem Hồ sơ chi tiết (Thông tin cá nhân, Bí tích đã lãnh, Học vấn, Tiến trình tu học).
            </p>
          </div>

          <div className="p-3.5 bg-[#f7fafc] rounded-2xl border border-[#e0e3e5] space-y-1">
            <h4 className="font-bold text-[#002045] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#1a365d]" />
              2. Quản lý Đào tạo & Thực tập Mục vụ
            </h4>
            <p className="text-[#43474e] leading-relaxed">
              Theo dõi tiến độ 12 khóa học đang diễn ra, xem phân bổ 45 chủng sinh về 15 Giáo xứ mục vụ, và theo dõi bảng điểm GPA, nhận xét của Ban Cố vấn.
            </p>
          </div>

          <div className="p-3.5 bg-[#f7fafc] rounded-2xl border border-[#e0e3e5] space-y-1">
            <h4 className="font-bold text-[#002045] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#1a365d]" />
              3. Lịch Phụng vụ & Sự kiện
            </h4>
            <p className="text-[#43474e] leading-relaxed">
              Quản lý các sự kiện Tĩnh tâm tháng, Linh thao, Họp Ban Giám đốc, Lễ kính và Khảo thí học vụ.
            </p>
          </div>

          <div className="p-3.5 bg-[#f7fafc] rounded-2xl border border-[#e0e3e5] space-y-1">
            <h4 className="font-bold text-[#002045] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1a365d]" />
              4. In hồ sơ & Xuất báo cáo
            </h4>
            <p className="text-[#43474e] leading-relaxed">
              Hệ thống tích hợp sẵn các mẫu In hồ sơ lý lịch chủng sinh tiêu chuẩn và Xuất dữ liệu Excel/CSV chỉ với một chạm.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f7fafc] border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#002045] text-white rounded-xl text-[13px] font-bold hover:bg-[#1a365d]"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
