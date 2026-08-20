import React, { useState } from 'react';
import { X, FileText, Printer, CheckCircle2, Award, Calendar, BookOpen } from 'lucide-react';
import { Seminarian } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminarians: Seminarian[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  seminarians,
}) => {
  const [reportType, setReportType] = useState('academic');
  const [term, setTerm] = useState('Học kỳ I (2024-2025)');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              Báo cáo Đào tạo & Mục vụ Tổng hợp
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto print-container">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                Loại báo cáo
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
              >
                <option value="academic">Báo cáo Kết quả Học tập & Bảng điểm</option>
                <option value="pastoral">Báo cáo Phân bổ Thực tập Mục vụ</option>
                <option value="formation">Báo cáo Tiến trình Huấn luyện Linh đạo</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                Kỳ đào tạo
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none"
              >
                <option value="Học kỳ I (2024-2025)">Học kỳ I (2024-2025)</option>
                <option value="Học kỳ II (2024-2025)">Học kỳ II (2024-2025)</option>
                <option value="Toàn niên khóa 2024-2025">Toàn niên khóa 2024-2025</option>
              </select>
            </div>
          </div>

          {/* Printable Report Document Preview */}
          <div className="p-6 md:p-8 border border-[#e0e3e5] rounded-2xl bg-white space-y-6 shadow-xs">
            {/* Header Document */}
            <div className="text-center space-y-1 border-b border-[#002045]/20 pb-4">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#74777f]">
                TỔNG GIÁO PHẬN HÀ NỘI
              </h4>
              <h3 className="text-[16px] md:text-[18px] font-bold text-[#002045] uppercase">
                ĐẠI CHỦNG VIỆN THÁNH GIUSE
              </h3>
              <p className="text-[13px] font-bold text-[#875200] pt-2">
                BẢNG TỔNG HỢP TIẾN TRÌNH ĐÀO TẠO CHỦNG SINH
              </p>
              <p className="text-[12px] text-[#74777f] italic">{term}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#f7fafc] rounded-xl border border-[#e0e3e5]">
                <p className="text-[11px] text-[#74777f] font-semibold">TỔNG CHỦNG SINH</p>
                <p className="text-xl font-bold text-[#002045]">248</p>
              </div>
              <div className="p-3 bg-[#f7fafc] rounded-xl border border-[#e0e3e5]">
                <p className="text-[11px] text-[#74777f] font-semibold">ĐIỂM TRUNG BÌNH</p>
                <p className="text-xl font-bold text-[#875200]">8.4 / 10</p>
              </div>
              <div className="p-3 bg-[#f7fafc] rounded-xl border border-[#e0e3e5]">
                <p className="text-[11px] text-[#74777f] font-semibold">THỰC TẬP MỤC VỤ</p>
                <p className="text-xl font-bold text-[#002045]">32 Thầy</p>
              </div>
            </div>

            {/* Table Sample */}
            <div className="border border-[#e0e3e5] rounded-xl overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f1f4f6] text-[#74777f] font-bold">
                  <tr>
                    <th className="p-2.5">Mã số</th>
                    <th className="p-2.5">Tên Thánh & Họ tên</th>
                    <th className="p-2.5">Giáo phận</th>
                    <th className="p-2.5">Lớp</th>
                    <th className="p-2.5 text-center">GPA</th>
                    <th className="p-2.5 text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]">
                  {seminarians.slice(0, 6).map((s) => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-mono text-[#74777f]">{s.code}</td>
                      <td className="p-2.5 font-bold text-[#181c1e]">{s.fullName}</td>
                      <td className="p-2.5">{s.diocese}</td>
                      <td className="p-2.5">{s.stage}</td>
                      <td className="p-2.5 text-center font-bold text-[#002045]">{s.grades?.gpa || '8.5'}</td>
                      <td className="p-2.5 text-center text-[#875200] font-semibold">Đạt chuẩn</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 pt-6 text-center text-[12px] text-[#181c1e]">
              <div>
                <p className="font-bold uppercase">GIÁM HỌC</p>
                <div className="h-16 flex items-center justify-center italic text-[#74777f]">
                  (Đã ký & duyệt)
                </div>
                <p className="font-semibold">Cha Phêrô Nguyễn Văn A</p>
              </div>
              <div>
                <p className="font-bold uppercase">LINH MỤC GIÁM ĐỐC</p>
                <div className="h-16 flex items-center justify-center italic text-[#74777f]">
                  (Đã ký & đóng dấu)
                </div>
                <p className="font-semibold">Cha Giuse Nguyễn Văn B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f7fafc] border-t border-[#e0e3e5] flex justify-between items-center no-print">
          <span className="text-[12px] text-[#74777f]">
            Sẵn sàng xuất file hoặc in ấn trực tiếp
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[13px] font-bold hover:bg-[#e0e3e5]"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#002045] text-white rounded-xl text-[13px] font-bold hover:bg-[#1a365d] flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>In báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
