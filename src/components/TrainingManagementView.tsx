import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Footprints, 
  BarChart3, 
  AlertTriangle, 
  MapPin, 
  Building2, 
  Search, 
  Filter, 
  CheckSquare, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Course, PastoralAssignment, Seminarian } from '../types';

interface TrainingManagementViewProps {
  courses: Course[];
  pastorals: PastoralAssignment[];
  seminarians: Seminarian[];
  onOpenReportModal: () => void;
  onOpenExportModal: () => void;
  onOpenMapModal: () => void;
  onSelectSeminarian: (sem: Seminarian) => void;
}

export const TrainingManagementView: React.FC<TrainingManagementViewProps> = ({
  courses,
  pastorals,
  seminarians,
  onOpenReportModal,
  onOpenExportModal,
  onOpenMapModal,
  onSelectSeminarian,
}) => {
  const [gradeSearchTerm, setGradeSearchTerm] = useState('');
  const [gradePage, setGradePage] = useState(1);

  // Filter seminarians for grades table
  const filteredGrades = seminarians.filter(
    (s) =>
      gradeSearchTerm === '' ||
      s.fullName.toLowerCase().includes(gradeSearchTerm.toLowerCase()) ||
      s.stage.toLowerCase().includes(gradeSearchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Quản lý Đào tạo & Mục vụ
          </h1>
          <p className="text-[14px] text-[#74777f] mt-1 font-normal">
            Tổng quan tình hình học tập và thực tập mục vụ năm học 2024-2025
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="export-data-btn"
            onClick={onOpenExportModal}
            className="px-4 py-2 rounded-xl text-[#002045] border border-[#c4c6cf] hover:bg-[#f1f4f6] text-[13px] font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1a365d]" />
            <span>Xuất Dữ Liệu</span>
          </button>
          <button
            id="create-report-btn"
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-[#002045] text-white hover:bg-[#1a365d] text-[13px] font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Tạo Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#74777f]">
              Tổng số Khóa học
            </h3>
            <div className="w-8 h-8 rounded-full bg-[#d6e3ff] flex items-center justify-center text-[#002045]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
            12
          </div>
          <p className="text-[12px] font-bold text-[#1a365d] mt-2">
            Đang diễn ra trong kỳ này
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#74777f]">
              Chủng sinh thực tập
            </h3>
            <div className="w-8 h-8 rounded-full bg-[#ffddba] flex items-center justify-center text-[#875200]">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
            45
          </div>
          <p className="text-[12px] text-[#74777f] font-medium mt-2">
            Đã phân bổ về 15 giáo xứ
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#74777f]">
              Điểm trung bình
            </h3>
            <div className="w-8 h-8 rounded-full bg-[#fae361]/50 flex items-center justify-center text-[#6b5f00]">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#002045] tracking-tight">
            8.4
          </div>
          <p className="text-[12px] text-[#74777f] font-medium mt-2">
            Toàn chủng viện
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#74777f]">
              Cần chú ý
            </h3>
            <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#ba1a1a] tracking-tight">
            3
          </div>
          <p className="text-[12px] font-bold text-[#ba1a1a] mt-2">
            Báo cáo đánh giá trễ hạn
          </p>
        </div>
      </div>

      {/* Bento Grid: Active Courses (Col 2) & Pastoral Assignments (Col 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Courses Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-[#e0e3e5] p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[18px] font-bold text-[#002045]">
                Khóa đào tạo đang diễn ra
              </h3>
              <span className="text-[12px] text-[#74777f] font-semibold">
                Học kỳ I (2024-2025)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e0e3e5] text-[12px] font-bold text-[#74777f] uppercase">
                    <th className="py-3 px-3">Tên Môn Học</th>
                    <th className="py-3 px-3">Giáo Sư</th>
                    <th className="py-3 px-3">Cấp Học</th>
                    <th className="py-3 px-3">Tiến Độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]">
                  {courses.slice(0, 4).map((c) => {
                    const percentage = Math.round((c.currentWeek / c.totalWeeks) * 100);

                    return (
                      <tr key={c.id} className="hover:bg-[#f7fafc] transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[14px] text-[#181c1e]">
                            {c.name}
                          </div>
                          <span className="text-[11px] text-[#74777f] font-medium">{c.code}</span>
                        </td>
                        <td className="py-3.5 px-3 text-[13px] text-[#43474e] font-medium">
                          {c.instructor}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#d6e3ff]/60 text-[#002045] text-[11px] font-bold">
                            {c.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 min-w-[120px]">
                          <div className="w-full bg-[#e5e9eb] rounded-full h-2 mb-1.5 overflow-hidden">
                            <div
                              className="bg-[#002045] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[#74777f] font-semibold">
                            Tuần {c.currentWeek}/{c.totalWeeks} ({percentage}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Pastoral Assignments */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#e0e3e5] p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[18px] font-bold text-[#002045]">
                Thực tập Mục vụ
              </h3>
              <span className="text-[12px] font-semibold text-[#875200] bg-[#ffddba]/40 px-2 py-0.5 rounded-full">
                15 Giáo xứ
              </span>
            </div>

            <div className="space-y-3.5">
              {pastorals.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#f7fafc] hover:bg-[#f1f4f6] border border-[#e0e3e5] transition-colors"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-[14px] text-[#181c1e]">
                      {p.locationName}
                    </h4>
                    {p.type === 'church' ? (
                      <MapPin className="w-4 h-4 text-[#002045]" />
                    ) : (
                      <Building2 className="w-4 h-4 text-[#002045]" />
                    )}
                  </div>
                  <p className="text-[12px] text-[#74777f] mb-2.5 font-medium">
                    {p.pastor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#e5e9eb] text-[#43474e] px-2 py-0.5 rounded text-[11px] font-bold">
                      {p.count} Chủng sinh
                    </span>
                    <span className="bg-[#ffddba] text-[#875200] px-2 py-0.5 rounded text-[11px] font-bold">
                      {p.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            id="view-pastoral-map-btn"
            onClick={onOpenMapModal}
            className="mt-4 w-full py-2.5 rounded-xl text-[13px] font-bold text-[#002045] border border-[#002045] hover:bg-[#d6e3ff]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Xem bản đồ phân bổ</span>
          </button>
        </div>
      </div>

      {/* Bottom Table: Theo dõi Điểm số & Đánh giá */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#e0e3e5] p-6 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#002045]">
              Theo dõi Điểm số & Đánh giá
            </h3>
            <p className="text-[13px] text-[#74777f] font-normal">
              Kỳ I - Năm học 2024-2025
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
              <input
                type="text"
                value={gradeSearchTerm}
                onChange={(e) => setGradeSearchTerm(e.target.value)}
                placeholder="Tìm kiếm chủng sinh..."
                className="w-full pl-9 pr-3 py-2 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[13px] text-[#181c1e] focus:bg-white focus:border-[#002045] outline-none"
              />
            </div>
            <button
              onClick={() => setGradeSearchTerm('')}
              className="p-2 border border-[#c4c6cf] rounded-xl hover:bg-[#f1f4f6] text-[#43474e] transition-colors cursor-pointer"
              title="Lọc"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f1f4f6] border-y border-[#e0e3e5] text-[12px] font-bold text-[#74777f] uppercase">
                <th className="py-3 px-4">Chủng sinh</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4 text-center">Triết học</th>
                <th className="py-3 px-4 text-center">Thần học</th>
                <th className="py-3 px-4 text-center">Kinh Thánh</th>
                <th className="py-3 px-4 text-center">Nhận xét Cố vấn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5]">
              {filteredGrades.slice(0, 5).map((sem) => (
                <tr
                  key={sem.id}
                  onClick={() => onSelectSeminarian(sem)}
                  className="hover:bg-[#f7fafc] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a365d] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                        {sem.fullName
                          .split(' ')
                          .slice(-2)
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="font-bold text-[14px] text-[#181c1e] hover:text-[#002045]">
                        {sem.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[13px] text-[#43474e] font-medium">
                    {sem.stage}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {sem.grades?.philosophy ? (
                      <span className="px-2.5 py-1 bg-[#d6e3ff] rounded-md text-[#002045] font-bold text-[12px]">
                        {sem.grades.philosophy}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#e5e9eb] rounded-md text-[#74777f] text-[12px]">
                        -
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {sem.grades?.theology ? (
                      <span className="px-2.5 py-1 bg-[#fae361]/40 rounded-md text-[#6b5f00] font-bold text-[12px]">
                        {sem.grades.theology}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#e5e9eb] rounded-md text-[#74777f] text-[12px]">
                        -
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {sem.grades?.scripture ? (
                      <span className="px-2.5 py-1 bg-[#d6e3ff] rounded-md text-[#002045] font-bold text-[12px]">
                        {sem.grades.scripture}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#e5e9eb] rounded-md text-[#74777f] text-[12px]">
                        -
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {sem.hasAdvisorReview ? (
                      <span
                        className="inline-flex items-center justify-center text-[#875200] hover:scale-110 transition-transform"
                        title="Đã có nhận xét"
                      >
                        <CheckSquare className="w-5 h-5" />
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center justify-center text-[#ba1a1a] hover:scale-110 transition-transform"
                        title="Chưa có nhận xét"
                      >
                        <AlertCircle className="w-5 h-5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Small Footer */}
        <div className="flex justify-between items-center pt-2 text-[13px] text-[#74777f]">
          <span>Hiển thị 5 trên {seminarians.length} chủng sinh</span>
          <div className="flex items-center gap-1">
            <span>Trang 1 của 5</span>
            <button className="p-1 hover:bg-[#f1f4f6] rounded cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#f1f4f6] rounded cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
