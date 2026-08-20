import React, { useMemo, useState } from 'react';
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
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { Course, PastoralAssignment, Seminarian } from '../types';
import { AddEditCourseModal } from './AddEditCourseModal';
import { AddEditPastoralModal } from './AddEditPastoralModal';

interface TrainingManagementViewProps {
  courses: Course[];
  pastorals: PastoralAssignment[];
  seminarians: Seminarian[];
  onOpenReportModal: () => void;
  onOpenExportModal: () => void;
  onOpenMapModal: () => void;
  onSelectSeminarian: (sem: Seminarian) => void;
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onSavePastoral: (assignment: PastoralAssignment) => void;
  onDeletePastoral: (id: string) => void;
}

const GRADES_PER_PAGE = 5;

export const TrainingManagementView: React.FC<TrainingManagementViewProps> = ({
  courses,
  pastorals,
  seminarians,
  onOpenReportModal,
  onOpenExportModal,
  onOpenMapModal,
  onSelectSeminarian,
  onSaveCourse,
  onDeleteCourse,
  onSavePastoral,
  onDeletePastoral,
}) => {
  const [gradeSearchTerm, setGradeSearchTerm] = useState('');
  const [gradePage, setGradePage] = useState(1);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isPastoralModalOpen, setIsPastoralModalOpen] = useState(false);
  const [editingPastoral, setEditingPastoral] = useState<PastoralAssignment | null>(null);

  // Filter seminarians for grades table
  const filteredGrades = seminarians.filter(
    (s) =>
      gradeSearchTerm === '' ||
      s.fullName.toLowerCase().includes(gradeSearchTerm.toLowerCase()) ||
      s.stage.toLowerCase().includes(gradeSearchTerm.toLowerCase())
  );

  const totalGradePages = Math.max(1, Math.ceil(filteredGrades.length / GRADES_PER_PAGE));
  const currentGradePage = Math.min(gradePage, totalGradePages);
  const pagedGrades = filteredGrades.slice(
    (currentGradePage - 1) * GRADES_PER_PAGE,
    currentGradePage * GRADES_PER_PAGE
  );

  // Real metrics computed from actual data, instead of hardcoded numbers.
  const metrics = useMemo(() => {
    const internshipCount = seminarians.filter((s) => s.status === 'Thực tập mục vụ').length;
    const parishCount = new Set(pastorals.map((p) => p.locationName)).size;

    const allGrades = seminarians.flatMap((s) => [
      s.grades?.philosophy,
      s.grades?.theology,
      s.grades?.scripture,
      s.grades?.latin,
      s.grades?.liturgy,
    ].filter((g): g is number => typeof g === 'number'));
    const avgGrade = allGrades.length
      ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1)
      : '—';

    const missingReviewCount = seminarians.filter((s) => !s.hasAdvisorReview).length;

    return { internshipCount, parishCount, avgGrade, missingReviewCount };
  }, [seminarians, pastorals]);

  const handleSaveCourseSubmit = (course: Course) => {
    onSaveCourse(course);
    setEditingCourse(null);
  };

  const handleSavePastoralSubmit = (assignment: PastoralAssignment) => {
    onSavePastoral(assignment);
    setEditingPastoral(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Quản lý Đào tạo & Mục vụ
          </h1>
          <p className="text-[14px] text-[#74777f] mt-1 font-normal">
            Tổng quan tình hình học tập và thực tập mục vụ
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
            {courses.length}
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
            {metrics.internshipCount}
          </div>
          <p className="text-[12px] text-[#74777f] font-medium mt-2">
            Đã phân bổ về {metrics.parishCount} giáo xứ
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
            {metrics.avgGrade}
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
            {metrics.missingReviewCount}
          </div>
          <p className="text-[12px] font-bold text-[#ba1a1a] mt-2">
            Chưa có nhận xét cố vấn
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
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setIsCourseModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#002045] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#1a365d] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm môn học</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e0e3e5] text-[12px] font-bold text-[#74777f] uppercase">
                    <th className="py-3 px-3">Tên Môn Học</th>
                    <th className="py-3 px-3">Giáo Sư</th>
                    <th className="py-3 px-3">Cấp Học</th>
                    <th className="py-3 px-3">Tiến Độ</th>
                    <th className="py-3 px-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5]">
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[13px] text-[#74777f]">
                        Chưa có khóa học nào. Nhấn "Thêm môn học" để bắt đầu.
                      </td>
                    </tr>
                  )}
                  {courses.map((c) => {
                    const percentage = c.totalWeeks > 0 ? Math.round((c.currentWeek / c.totalWeeks) * 100) : 0;

                    return (
                      <tr key={c.id} className="hover:bg-[#f7fafc] transition-colors group">
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
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingCourse(c);
                                setIsCourseModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#e5e9eb] text-[#43474e] cursor-pointer"
                              title="Sửa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Xóa môn học "${c.name}"?`)) onDeleteCourse(c.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#ffdad6] text-[#ba1a1a] cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
              <button
                onClick={() => {
                  setEditingPastoral(null);
                  setIsPastoralModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#002045] text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#1a365d] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {pastorals.length === 0 && (
                <p className="text-[13px] text-[#74777f] text-center py-4">
                  Chưa có phân công mục vụ nào.
                </p>
              )}
              {pastorals.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#f7fafc] hover:bg-[#f1f4f6] border border-[#e0e3e5] transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-[14px] text-[#181c1e]">
                      {p.locationName}
                    </h4>
                    <div className="flex items-center gap-1">
                      {p.type === 'church' ? (
                        <MapPin className="w-4 h-4 text-[#002045]" />
                      ) : (
                        <Building2 className="w-4 h-4 text-[#002045]" />
                      )}
                      <div className="hidden group-hover:flex items-center gap-1 ml-1">
                        <button
                          onClick={() => {
                            setEditingPastoral(p);
                            setIsPastoralModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-[#e5e9eb] text-[#43474e] cursor-pointer"
                          title="Sửa"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa phân công "${p.locationName}"?`)) onDeletePastoral(p.id);
                          }}
                          className="p-1 rounded hover:bg-[#ffdad6] text-[#ba1a1a] cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
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
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f]" />
              <input
                type="text"
                value={gradeSearchTerm}
                onChange={(e) => {
                  setGradeSearchTerm(e.target.value);
                  setGradePage(1);
                }}
                placeholder="Tìm kiếm chủng sinh..."
                className="w-full pl-9 pr-3 py-2 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[13px] text-[#181c1e] focus:bg-white focus:border-[#002045] outline-none"
              />
            </div>
            <button
              onClick={() => {
                setGradeSearchTerm('');
                setGradePage(1);
              }}
              className="p-2 border border-[#c4c6cf] rounded-xl hover:bg-[#f1f4f6] text-[#43474e] transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
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
              {pagedGrades.map((sem) => (
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
              {pagedGrades.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[13px] text-[#74777f]">
                    Không tìm thấy chủng sinh phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Small Footer */}
        <div className="flex justify-between items-center pt-2 text-[13px] text-[#74777f]">
          <span>
            Hiển thị {pagedGrades.length} trên {filteredGrades.length} chủng sinh
          </span>
          <div className="flex items-center gap-1">
            <span>Trang {currentGradePage} của {totalGradePages}</span>
            <button
              onClick={() => setGradePage((p) => Math.max(1, p - 1))}
              disabled={currentGradePage <= 1}
              className="p-1 hover:bg-[#f1f4f6] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGradePage((p) => Math.min(totalGradePages, p + 1))}
              disabled={currentGradePage >= totalGradePages}
              className="p-1 hover:bg-[#f1f4f6] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddEditCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourseSubmit}
        editingCourse={editingCourse}
      />

      <AddEditPastoralModal
        isOpen={isPastoralModalOpen}
        onClose={() => setIsPastoralModalOpen(false)}
        onSave={handleSavePastoralSubmit}
        editingAssignment={editingPastoral}
      />
    </div>
  );
};
