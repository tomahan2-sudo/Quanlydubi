import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2, Printer, FileCheck } from 'lucide-react';
import { Seminarian } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminarians: Seminarian[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  seminarians,
}) => {
  const [format, setFormat] = useState<'csv' | 'word' | 'json' | 'print'>('csv');
  const [isExported, setIsExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    if (format === 'csv') {
      const headers = [
        'Mã số', 
        'Tên Thánh', 
        'Họ và tên', 
        'Khóa', 
        'Giáo phận', 
        'Giáo xứ', 
        'Giáo xứ quê nhà', 
        'Giáo xứ nhập', 
        'Giai đoạn', 
        'Trạng thái', 
        'Điện thoại', 
        'Gmail', 
        'Email Chủng viện',
        'Trường ĐH/CĐ',
        'Chuyên ngành',
        'Năm nhập học ĐH',
        'Năm ra trường'
      ];
      const rows = seminarians.map((s) => [
        `"${s.code}"`,
        `"${s.saintName}"`,
        `"${s.fullName}"`,
        `"${s.batch}"`,
        `"${s.diocese}"`,
        `"${s.parish}"`,
        `"${s.homeParish || s.parish}"`,
        `"${s.admissionParish || s.parish}"`,
        `"${s.stage}"`,
        `"${s.status}"`,
        `"${s.phone}"`,
        `"${s.gmail || s.email}"`,
        `"${s.email}"`,
        `"${s.priorEducation?.institution || '—'}"`,
        `"${s.priorEducation?.major || '—'}"`,
        `"${s.priorEducation?.startYear || '2016'}"`,
        `"${s.priorEducation?.gradYear || '—'}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `danh_sach_chung_sinh_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'word') {
      const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Danh Sách Chủng Sinh</title>
<style>
  @page { size: 29.7cm 21.0cm; margin: 1.5cm; mso-page-orientation: landscape; }
  body { font-family: 'Times New Roman', serif; font-size: 11pt; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th, td { border: 1px solid #333; padding: 6px; text-align: left; }
  th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
  .text-center { text-align: center; }
</style>
</head>
<body>
  <h2 style="text-align: center; text-transform: uppercase;">ĐẠI CHỦNG VIỆN THÁNH GIUSE</h2>
  <h3 style="text-align: center; text-transform: uppercase;">DANH SÁCH TỔNG HỢP CHỦNG SINH (${seminarians.length} HỒ SƠ)</h3>
  <p style="text-align: center; font-style: italic;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
  <table>
    <thead>
      <tr>
        <th style="width: 4%;">STT</th>
        <th style="width: 10%;">Mã số</th>
        <th style="width: 18%;">Tên Thánh & Họ Tên</th>
        <th style="width: 8%;">Khóa</th>
        <th style="width: 12%;">Giáo Phận</th>
        <th style="width: 14%;">Giáo Xứ Gốc</th>
        <th style="width: 12%;">Lớp Hiện Tại</th>
        <th style="width: 10%;">Trạng Thái</th>
        <th style="width: 12%;">Số Điện Thoại</th>
      </tr>
    </thead>
    <tbody>
      ${seminarians.map((s, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td class="text-center font-bold">${s.code}</td>
          <td><b>${s.saintName} ${s.fullName}</b></td>
          <td class="text-center">${s.batch}</td>
          <td>${s.diocese}</td>
          <td>${s.homeParish || s.parish}</td>
          <td>${s.stage}</td>
          <td class="text-center">${s.status}</td>
          <td>${s.phone}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
      `;
      const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `danh_sach_chung_sinh_${new Date().toISOString().slice(0, 10)}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(seminarians, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `du_lieu_chung_sinh_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      window.print();
    }

    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              Xuất Dữ Liệu & Hồ Sơ Chủng Sinh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-[13px] text-[#74777f]">
            Chọn định dạng dữ liệu bạn muốn kết xuất từ hệ thống quản lý ({seminarians.length} hồ sơ):
          </p>

          <div className="space-y-2.5">
            <label
              onClick={() => setFormat('word')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                format === 'word'
                  ? 'border-[#002045] bg-[#d6e3ff]/30 ring-2 ring-[#002045]/10'
                  : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
              }`}
            >
              <FileCheck className="w-5 h-5 text-[#005f5a]" />
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#181c1e]">Văn bản Word (.doc / .docx)</p>
                <p className="text-[12px] text-[#74777f]">Định dạng bảng biểu chuẩn văn bản, dễ dàng chỉnh sửa & gửi email</p>
              </div>
            </label>

            <label
              onClick={() => setFormat('csv')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                format === 'csv'
                  ? 'border-[#002045] bg-[#d6e3ff]/30 ring-2 ring-[#002045]/10'
                  : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-[#002045]" />
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#181c1e]">Tập tin Excel / CSV (.csv)</p>
                <p className="text-[12px] text-[#74777f]">Tương thích với Microsoft Excel, Google Sheets</p>
              </div>
            </label>

            <label
              onClick={() => setFormat('print')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                format === 'print'
                  ? 'border-[#002045] bg-[#d6e3ff]/30 ring-2 ring-[#002045]/10'
                  : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
              }`}
            >
              <Printer className="w-5 h-5 text-[#002045]" />
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#181c1e]">In trực tiếp / Lưu PDF A4</p>
                <p className="text-[12px] text-[#74777f]">Chuẩn trang A4 tài liệu lưu trữ giáo phận</p>
              </div>
            </label>

            <label
              onClick={() => setFormat('json')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                format === 'json'
                  ? 'border-[#002045] bg-[#d6e3ff]/30 ring-2 ring-[#002045]/10'
                  : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
              }`}
            >
              <FileText className="w-5 h-5 text-[#74777f]" />
              <div className="flex-1">
                <p className="text-[14px] font-bold text-[#181c1e]">Tập tin JSON (.json)</p>
                <p className="text-[12px] text-[#74777f]">Dành cho sao lưu kỹ thuật số & tích hợp cơ sở dữ liệu</p>
              </div>
            </label>
          </div>

          {isExported && (
            <div className="p-3 bg-[#d6e3ff]/60 border border-[#86a0cd] text-[#001b3c] rounded-xl flex items-center gap-2 text-[13px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#002045]" />
              <span>Đã xuất dữ liệu thành công!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[13px] font-bold hover:bg-[#f1f4f6] cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white text-[13px] font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{format === 'print' ? 'Tiến hành In' : 'Tải xuống'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
