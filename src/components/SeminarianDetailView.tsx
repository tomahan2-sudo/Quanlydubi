import React, { useState } from 'react';
import { 
  ChevronRight, 
  Printer, 
  Edit3, 
  BadgeCheck, 
  GraduationCap, 
  Church, 
  MapPin, 
  User, 
  Droplet, 
  History, 
  BookOpen, 
  HeartHandshake, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Sparkles, 
  Award, 
  Users, 
  Layers, 
  Flag, 
  FileText, 
  Mail, 
  Sun, 
  Home, 
  CheckCircle2, 
  BookmarkCheck, 
  Compass, 
  X, 
  Save, 
  Check,
  Plus,
  Trash2,
  School,
  FileCheck,
  Download,
  Eye
} from 'lucide-react';
import { Seminarian, AcademicYearRecord } from '../types';
import { createDefaultAnnualRecords } from '../mockData';
import { SeminarianReviewModal } from './SeminarianReviewModal';

interface SeminarianDetailViewProps {
  seminarian: Seminarian;
  onBack: () => void;
  onOpenEditModal: (sem: Seminarian) => void;
  onUpdateSeminarian?: (updated: Seminarian) => void;
}

export const SeminarianDetailView: React.FC<SeminarianDetailViewProps> = ({
  seminarian,
  onBack,
  onOpenEditModal,
  onUpdateSeminarian,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'family' | 'academic' | 'spiritual' | 'notes'>('academic');
  const [selectedYearId, setSelectedYearId] = useState<string>('du-bi-1');

  // Year record edit modal state
  const [isEditRecordModalOpen, setIsEditRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AcademicYearRecord | null>(null);

  // Review & Print Dossier Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const associationsList = seminarian.associations && seminarian.associations.length > 0 
    ? seminarian.associations 
    : ['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên'];

  const siblings = seminarian.siblingsCount !== undefined 
    ? seminarian.siblingsCount 
    : (seminarian.familyInfo?.siblingsCount || 3);

  // Annual records for academic years (Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết I...)
  const annualRecords: AcademicYearRecord[] = seminarian.annualRecords && seminarian.annualRecords.length > 0
    ? seminarian.annualRecords
    : createDefaultAnnualRecords(seminarian.fullName, seminarian.homeParish || seminarian.parish);

  const currentYearRecord = annualRecords.find(r => r.yearId === selectedYearId) || annualRecords[0];

  const handleOpenEditYearModal = (rec: AcademicYearRecord) => {
    // Deep clone to avoid accidental direct mutation before save
    setEditingRecord(JSON.parse(JSON.stringify(rec)));
    setIsEditRecordModalOpen(true);
  };

  const handleSaveYearRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    // Recalculate GPA
    const totalScore = editingRecord.subjects.reduce((sum, s) => sum + (s.score * s.credits), 0);
    const totalCredits = editingRecord.subjects.reduce((sum, s) => sum + s.credits, 0);
    const gpa = totalCredits > 0 ? Number((totalScore / totalCredits).toFixed(1)) : editingRecord.gpa;

    const finalRecord: AcademicYearRecord = {
      ...editingRecord,
      gpa,
      creditsTotal: totalCredits || editingRecord.creditsTotal,
    };

    const updatedRecords = annualRecords.map(r => r.yearId === finalRecord.yearId ? finalRecord : r);

    const updatedSeminarian: Seminarian = {
      ...seminarian,
      annualRecords: updatedRecords,
    };

    if (onUpdateSeminarian) {
      onUpdateSeminarian(updatedSeminarian);
    }

    setIsEditRecordModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 animate-in fade-in duration-200 print-container">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div className="flex items-center gap-2 text-[#74777f]">
          <button
            onClick={onBack}
            className="text-[14px] hover:text-[#002045] font-medium transition-colors cursor-pointer"
          >
            Danh sách chủng sinh
          </button>
          <ChevronRight className="w-4 h-4 text-[#c4c6cf]" />
          <span className="text-[14px] font-bold text-[#002045]">
            Hồ sơ chi tiết
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="review-dossier-btn"
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#002045] text-white hover:bg-[#1a365d] text-[13px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-[#ffddba]" />
            <span>Review & Xuất Hồ Sơ A4 (Word/PDF)</span>
          </button>
          <button
            id="print-profile-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-[#c4c6cf] text-[#181c1e] hover:bg-[#f1f4f6] text-[13px] font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#43474e]" />
            <span>In nhanh</span>
          </button>
          <button
            id="edit-profile-btn"
            onClick={() => onOpenEditModal(seminarian)}
            className="px-4 py-2 rounded-xl bg-[#f1f4f6] text-[#002045] hover:bg-[#e0e3e5] border border-[#c4c6cf] text-[13px] font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-[#e0e3e5] relative overflow-hidden">
        {/* Soft Ambient decorative background blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d6e3ff]/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          {/* Avatar Portrait */}
          <div className="w-28 h-36 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-md border-4 border-white shrink-0 bg-[#f1f4f6]">
            {seminarian.avatarUrl ? (
              <img
                src={seminarian.avatarUrl}
                alt={seminarian.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-3xl">
                {seminarian.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Profile Core Data */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
                {seminarian.fullName}
              </h1>
              
              {/* Highlight current stage badge */}
              <span className="px-3 py-1 rounded-full bg-[#002045] text-white text-[12px] font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
                <Layers className="w-3.5 h-3.5 text-[#ffddba]" />
                <span>Giai đoạn: {seminarian.stage}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-[#ffddba] text-[#875200] text-[11px] md:text-[12px] font-bold tracking-wide uppercase border border-[#ffb866]">
                {seminarian.status === 'Đang học' ? 'ĐANG TU HỌC' : seminarian.status.toUpperCase()}
              </span>
            </div>

            <p className="text-[14px] text-[#74777f] font-medium mb-4">
              Tên Thánh: <strong className="text-[#002045] font-semibold">{seminarian.saintName}</strong> • Gmail: <strong className="text-[#002045]">{seminarian.gmail || seminarian.email}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5 pt-3 border-t border-[#e0e3e5]/80">
              <div className="flex items-center gap-2.5 text-[#43474e]">
                <BadgeCheck className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Mã số: <strong className="text-[#181c1e] font-semibold">{seminarian.code}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#43474e]">
                <GraduationCap className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Khóa: <strong className="text-[#181c1e] font-semibold">{seminarian.batch || 'Khóa 21'}</strong> ({seminarian.admissionYear || '2021'} - {seminarian.graduationYear || '2029'})
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#43474e]">
                <Church className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Giáo phận: <strong className="text-[#181c1e] font-semibold">{seminarian.diocese}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#43474e]">
                <MapPin className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Gx. Quê nhà: <strong className="text-[#181c1e] font-semibold">{seminarian.homeParish || seminarian.parish}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#43474e]">
                <Church className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Gx. Nhập: <strong className="text-[#181c1e] font-semibold">{seminarian.admissionParish || seminarian.parish}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#43474e]">
                <Phone className="w-4 h-4 text-[#002045] shrink-0" />
                <span className="text-[13px]">
                  Điện thoại: <strong className="text-[#181c1e] font-semibold">{seminarian.phone}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROMINENT STAGE BOX - KHUNG HIỆN RÕ ĐANG HỌC GIAI ĐOẠN NÀO HIỆN TẠI */}
        <div className="mt-6 pt-5 border-t border-[#e0e3e5] bg-[#f8faff] -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-5 md:px-8 border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002045] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[#535f70] uppercase tracking-wider">
                  Giai đoạn đào tạo hiện tại:
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[17px] font-bold text-[#002045]">
                {seminarian.stage} • {seminarian.academicYear}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-[#535f70] font-medium mr-1">Hội đoàn đã tham gia:</span>
            {associationsList.slice(0, 3).map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white border border-[#c4c6cf] text-[#002045] text-[11px] font-semibold rounded-lg shadow-2xs">
                {item}
              </span>
            ))}
            {associationsList.length > 3 && (
              <span className="px-2 py-0.5 bg-[#e0e3e5] text-[#43474e] text-[11px] font-bold rounded-lg">
                +{associationsList.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left (Tabs & Content), Right (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Tabs & Detail Bento Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-[#c4c6cf] gap-2 md:gap-6 no-print">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-3 px-2 text-[14px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'border-[#002045] text-[#002045]'
                  : 'border-transparent text-[#74777f] hover:text-[#002045]'
              }`}
            >
              Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab('family')}
              className={`py-3 px-2 text-[14px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'family'
                  ? 'border-[#002045] text-[#002045]'
                  : 'border-transparent text-[#74777f] hover:text-[#002045]'
              }`}
            >
              Gia đình & Anh em ruột
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`py-3 px-2 text-[14px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'academic'
                  ? 'border-[#002045] text-[#002045]'
                  : 'border-transparent text-[#74777f] hover:text-[#002045]'
              }`}
            >
              Kết quả học tập
            </button>

            <button
              onClick={() => setActiveTab('spiritual')}
              className={`py-3 px-2 text-[14px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'spiritual'
                  ? 'border-[#002045] text-[#002045]'
                  : 'border-transparent text-[#74777f] hover:text-[#002045]'
              }`}
            >
              Tiến trình linh đạo
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-2 text-[14px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-[#002045] text-[#002045]'
                  : 'border-transparent text-[#74777f] hover:text-[#002045]'
              }`}
            >
              Nhận xét
            </button>
          </div>

          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {/* Row 1: Bento 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Block 1: Cơ bản */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
                  <h3 className="text-[17px] font-bold text-[#002045] mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1a365d]" />
                    <span>Thông tin cơ bản</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Tên Thánh</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.saintName}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Họ và tên</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.fullName}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Khóa đào tạo</p>
                      <p className="text-[14px] font-bold text-[#002045]">{seminarian.batch || 'Khóa 21'}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Niên khóa đào tạo</p>
                      <p className="text-[14px] font-bold text-[#002045]">{seminarian.academicYear}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#e8effd] border border-[#002045]/20">
                      <p className="text-[11.5px] font-bold text-[#002045] uppercase mb-0.5">Năm nhập học Chủng Viện</p>
                      <p className="text-[15px] font-extrabold text-[#002045]">
                        {seminarian.admissionYear || seminarian.seminaryAdmissionYear || '2021'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#fff7e6] border border-[#875200]/20">
                      <p className="text-[11.5px] font-bold text-[#875200] uppercase mb-0.5">Năm ra trường Chủng Viện</p>
                      <p className="text-[15px] font-extrabold text-[#875200]">
                        {seminarian.graduationYear || seminarian.seminaryGraduationYear || '2029'} (Dự kiến)
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Ngày sinh</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.birthDate}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Nơi sinh</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.birthPlace}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Số điện thoại</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.phone}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Gmail cá nhân</p>
                      <p className="text-[14px] font-bold text-[#002045] truncate" title={seminarian.gmail || seminarian.email}>
                        {seminarian.gmail || seminarian.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Giáo phận</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.diocese}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Giáo xứ quê nhà</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.homeParish || seminarian.parish}</p>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Giáo xứ nhập</p>
                      <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.admissionParish || seminarian.parish}</p>
                    </div>
                  </div>
                </div>

                {/* Block 2: Bí tích đã lãnh */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
                  <h3 className="text-[17px] font-bold text-[#002045] mb-5 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-[#1a365d]" />
                    <span>Bí tích đã lãnh</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Rửa tội</p>
                      <div className="flex justify-between items-baseline">
                        <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.baptismDate}</p>
                        <span className="text-[13px] text-[#74777f] font-medium">{seminarian.baptismParish}</span>
                      </div>
                    </div>

                    <hr className="border-[#e0e3e5]" />

                    <div>
                      <p className="text-[12px] font-semibold text-[#74777f] mb-0.5">Thêm sức</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between items-baseline gap-1">
                        <p className="text-[14px] font-bold text-[#181c1e]">{seminarian.confirmationDate}</p>
                        <span className="text-[12px] text-[#74777f] font-medium text-right">{seminarian.confirmationBishop}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 3: Các Hội đoàn đã tham gia (Mục Mới) */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
                <h3 className="text-[17px] font-bold text-[#002045] mb-4 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-[#1a365d]" />
                  <span>Các hội đoàn đã tham gia</span>
                </h3>

                <p className="text-[13px] text-[#535f70] mb-3">
                  Hoạt động mục vụ, giáo xứ và đoàn thể Công giáo trước và trong thời gian tu học:
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {associationsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 bg-[#f1f4f6] hover:bg-[#e8effd] border border-[#c4c6cf] hover:border-[#002045]/40 rounded-xl text-[13px] font-bold text-[#002045] flex items-center gap-2 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#002045]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block 4: Học vấn trước Chủng viện (Năm nhập học & năm ra trường, hỗ trợ nhiều trường ĐH/CĐ/TC) */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
                    <History className="w-5 h-5 text-[#1a365d]" />
                    <span>Học vấn trước khi gia nhập Chủng viện</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e8effd] text-[#002045] text-[12px] font-bold">
                    {(seminarian.priorEducationList && seminarian.priorEducationList.length > 0)
                      ? `${seminarian.priorEducationList.length} trường đào tạo`
                      : '1 trường đào tạo'}
                  </span>
                </div>

                <div className="space-y-3">
                  {(seminarian.priorEducationList && seminarian.priorEducationList.length > 0
                    ? seminarian.priorEducationList
                    : [
                        {
                          id: '1',
                          degreeType: seminarian.priorEducation?.degree || 'Đại học',
                          institution: seminarian.priorEducation?.institution || 'Chưa cập nhật',
                          major: seminarian.priorEducation?.major || 'Chưa cập nhật',
                          startYear: seminarian.priorEducation?.startYear || '2016',
                          gradYear: seminarian.priorEducation?.gradYear || '2020',
                          ranking: 'Giỏi',
                        }
                      ]
                  ).map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-4 rounded-xl bg-[#f8fafc] border border-[#e0e3e5] hover:border-[#adc7f7] transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#002045] text-white text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[13px] font-bold text-[#002045]">
                            {edu.degreeType || 'Đại học'}: {edu.institution}
                          </span>
                        </div>
                        {edu.ranking && (
                          <span className="px-2.5 py-0.5 rounded-md bg-[#d1e7dd] text-[#0f5132] text-[11px] font-bold">
                            Xếp loại: {edu.ranking}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#74777f] mb-0.5">Trường đào tạo</p>
                          <p className="text-[13.5px] font-bold text-[#181c1e]">{edu.institution}</p>
                        </div>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#74777f] mb-0.5">Chuyên ngành học</p>
                          <p className="text-[13.5px] font-bold text-[#181c1e]">{edu.major}</p>
                        </div>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#74777f] mb-0.5">Năm nhập học</p>
                          <p className="text-[13.5px] font-bold text-[#002045]">{edu.startYear || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#74777f] mb-0.5">Năm tốt nghiệp / ra trường</p>
                          <p className="text-[13.5px] font-bold text-[#002045]">{edu.gradYear || '—'}</p>
                        </div>
                      </div>

                      {edu.notes && (
                        <div className="text-[12px] text-[#535f70] bg-white p-2 rounded-lg border border-[#e0e3e5]">
                          <strong className="text-[#002045]">Ghi chú / Chứng chỉ:</strong> {edu.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GIA ĐÌNH & TIỂU SỬ */}
          {activeTab === 'family' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-6">
              <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#1a365d]" />
                <span>Hoàn cảnh gia đình & Anh em ruột</span>
              </h3>

              {/* Sibling & Order Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#e8effd] border border-[#002045]/20 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#002045] text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#535f70] uppercase">Số lượng anh em ruột</p>
                    <p className="text-[16px] font-bold text-[#002045]">{siblings} anh chị em trong nhà</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f7fafc] border border-[#e0e3e5] flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#f1f4f6] text-[#002045] flex items-center justify-center shrink-0 border border-[#c4c6cf]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#535f70] uppercase">Thứ tự trong gia đình</p>
                    <p className="text-[15px] font-bold text-[#181c1e]">{seminarian.birthOrder || 'Con thứ 2 trong gia đình'}</p>
                  </div>
                </div>
              </div>

              {/* Parents info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                  <p className="text-[12px] font-bold text-[#74777f] mb-1">THÔNG TIN THÂN PHỤ</p>
                  <p className="text-[15px] font-bold text-[#181c1e]">{seminarian.familyInfo?.fatherName || 'Giuse Nguyễn Văn Minh'}</p>
                  <p className="text-[13px] text-[#43474e] mt-1">Năm sinh: {seminarian.familyInfo?.fatherBirth || '1970'} • Nghề nghiệp: {seminarian.familyInfo?.fatherJob || 'Làm nông & Giáo lý viên'}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                  <p className="text-[12px] font-bold text-[#74777f] mb-1">THÔNG TIN THÂN MẪU</p>
                  <p className="text-[15px] font-bold text-[#181c1e]">{seminarian.familyInfo?.motherName || 'Maria Trần Thị Hoa'}</p>
                  <p className="text-[13px] text-[#43474e] mt-1">Năm sinh: {seminarian.familyInfo?.motherBirth || '1973'} • Nghề nghiệp: {seminarian.familyInfo?.motherJob || 'Nội trợ'}</p>
                </div>
              </div>

              {/* Family Notes */}
              <div className="p-4 rounded-xl bg-[#fef8e8] border border-[#ffddba]">
                <h4 className="text-[13px] font-bold text-[#875200] uppercase mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Ghi chú gia đình:</span>
                </h4>
                <p className="text-[13.5px] text-[#181c1e] leading-relaxed">
                  {seminarian.familyNotes || seminarian.familyInfo?.notes || 'Gia đình truyền thống Công giáo sốt sắng, nề nếp đạo đức, luôn đồng hành và khích lệ chủng sinh trong đời sống tận hiến phục vụ Giáo hội.'}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-bold text-[#74777f] mb-1">ĐỊA CHỈ GIA ĐÌNH</p>
                <p className="text-[14px] font-semibold text-[#181c1e]">{seminarian.familyInfo?.familyAddress || `${seminarian.homeParish || seminarian.parish}, ${seminarian.diocese}`}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#d6e3ff]/30 border border-[#adc7f7]/60">
                <h4 className="text-[13px] font-bold text-[#002045] mb-1">Tiểu sử ơn gọi:</h4>
                <p className="text-[13px] text-[#181c1e] leading-relaxed">
                  Được ươm mầm ơn gọi từ gia đình đạo đức và phong trào Thiếu Nhi Thánh Thể tại Giáo xứ {seminarian.homeParish || seminarian.parish}. Sau khi tốt nghiệp đại học, thầy đã trải qua thời gian dự tu tại Giáo phận {seminarian.diocese} và được Đức Giám mục tuyển chọn gửi vào Đại chủng viện.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: KẾT QUẢ HỌC TẬP & ĐÁNH GIÁ CÁC NĂM HỌC */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              {/* Year Navigation Filter / Selector Bar */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3e5]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                      <BookmarkCheck className="w-5 h-5 text-[#002045]" />
                      <span>Chọn Năm học / Giai đoạn Đào tạo:</span>
                    </h3>
                    <p className="text-[12.5px] text-[#74777f]">
                      Xem bảng điểm, nhận xét 4 chiều kích và đánh giá mục vụ của Quý Cha xứ qua các năm
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#74777f]">Tổng số năm lưu trữ:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d6e3ff] text-[#002045] text-[12px] font-bold">
                      {annualRecords.length} năm học
                    </span>
                  </div>
                </div>

                {/* Tabs for years: Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết I... */}
                <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#e0e3e5]/70">
                  {annualRecords.map((rec) => {
                    const isSelected = rec.yearId === currentYearRecord.yearId;
                    return (
                      <button
                        key={rec.yearId}
                        onClick={() => setSelectedYearId(rec.yearId)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-[#002045] text-white shadow-md ring-2 ring-[#002045]/20 scale-[1.02]'
                            : 'bg-[#f1f4f6] text-[#43474e] hover:bg-[#e0e3e5] hover:text-[#002045]'
                        }`}
                      >
                        <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-[#ffddba]' : 'text-[#74777f]'}`} />
                        <span>{rec.yearName.split('(')[0].trim()}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#e0e3e5] text-[#181c1e]'
                        }`}>
                          GPA {rec.gpa}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Year Header Banner */}
              <div className="bg-linear-to-r from-[#002045] to-[#1a365d] rounded-2xl p-6 text-white shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#ffddba] text-[#875200] text-[11px] font-bold uppercase tracking-wider">
                        HỒ SƠ NĂM HỌC
                      </span>
                      <span className="text-[13px] text-white/80 font-medium">
                        Niên khóa: {currentYearRecord.schoolYear}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                      {currentYearRecord.yearName}
                    </h2>
                    <p className="text-[13px] text-white/75 mt-1">
                      Chủng sinh: <strong>{seminarian.fullName}</strong> • Mã số: <strong>{seminarian.code}</strong> • Lớp: <strong>{seminarian.batch}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs border border-white/20">
                    <div className="text-center px-3 border-r border-white/20">
                      <p className="text-[11px] uppercase tracking-wider text-white/80 font-medium">Điểm TB (GPA)</p>
                      <p className="text-2xl md:text-3xl font-black text-[#ffddba] mt-0.5">{currentYearRecord.gpa}</p>
                    </div>
                    <div className="text-center px-3">
                      <p className="text-[11px] uppercase tracking-wider text-white/80 font-medium">Tổng số môn</p>
                      <p className="text-2xl md:text-3xl font-black text-white mt-0.5">{currentYearRecord.subjects.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION A: BẢNG ĐIỂM CÁC MÔN HỌC */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#002045]" />
                      <span>Bảng điểm các môn học: {currentYearRecord.yearName}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-[12.5px] text-[#74777f] mt-0.5">
                      <span>Tổng số tín chỉ: <strong className="text-[#181c1e]">{currentYearRecord.creditsTotal || 24} tín chỉ</strong></span>
                      <span>•</span>
                      <span>Thang điểm: <strong className="text-[#181c1e]">10.0</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditYearModal(currentYearRecord)}
                      className="px-3.5 py-2 bg-[#002045] text-white hover:bg-[#1a365d] text-[12px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Thêm môn học / Sửa điểm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditYearModal(currentYearRecord)}
                      className="px-3.5 py-2 bg-[#f1f4f6] text-[#002045] hover:bg-[#e0e3e5] text-[12px] font-bold rounded-xl border border-[#c4c6cf] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa nhận xét năm này</span>
                    </button>
                  </div>
                </div>

                <div className="border border-[#e0e3e5] rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#f1f4f6] text-[#535f70] font-bold border-b border-[#e0e3e5]">
                        <tr>
                          <th className="p-3.5">Mã môn</th>
                          <th className="p-3.5">Tên môn học</th>
                          <th className="p-3.5 text-center">Học kỳ</th>
                          <th className="p-3.5 text-center">Số TC</th>
                          <th className="p-3.5">Giáo sư phụ trách</th>
                          <th className="p-3.5 text-right font-bold">Số điểm</th>
                          <th className="p-3.5 text-center">Xếp loại</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e3e5] bg-white">
                        {currentYearRecord.subjects.map((sub, idx) => {
                          const isHigh = sub.score >= 9.0;
                          const isGood = sub.score >= 8.0 && sub.score < 9.0;
                          const rankingLabel = sub.score >= 9.0 ? 'Xuất sắc' : sub.score >= 8.0 ? 'Giỏi' : sub.score >= 7.0 ? 'Khá' : 'Đạt';

                          return (
                            <tr key={idx} className="hover:bg-[#f7fafc] transition-colors">
                              <td className="p-3.5 font-mono text-[12px] text-[#74777f] font-semibold">{sub.code}</td>
                              <td className="p-3.5 font-bold text-[#181c1e]">{sub.name}</td>
                              <td className="p-3.5 text-center">
                                <span className="px-2 py-0.5 bg-[#e8effd] text-[#002045] rounded-md text-[11px] font-semibold">
                                  {sub.semester || 'HK I'}
                                </span>
                              </td>
                              <td className="p-3.5 text-center font-semibold text-[#43474e]">{sub.credits}</td>
                              <td className="p-3.5 text-[#43474e] font-medium">{sub.instructor}</td>
                              <td className="p-3.5 text-right font-black text-[15px] text-[#002045]">
                                {sub.score.toFixed(1)}
                              </td>
                              <td className="p-3.5 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  isHigh
                                    ? 'bg-[#d1e7dd] text-[#0f5132]'
                                    : isGood
                                    ? 'bg-[#d6e3ff] text-[#002045]'
                                    : 'bg-[#e2e3e5] text-[#41464b]'
                                }`}>
                                  {rankingLabel}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-[#f8fafc] font-bold border-t border-[#e0e3e5] text-[13px]">
                        <tr>
                          <td colSpan={3} className="p-3.5 text-[#43474e]">Điểm Trung Bình Chung (GPA) Năm Học:</td>
                          <td className="p-3.5 text-center text-[#002045]">{currentYearRecord.creditsTotal || 24}</td>
                          <td className="p-3.5 text-[#74777f]">Tổng kết {currentYearRecord.subjects.length} môn học</td>
                          <td className="p-3.5 text-right text-lg font-black text-[#002045]">
                            {currentYearRecord.gpa.toFixed(1)} / 10
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="px-3 py-1 rounded-full bg-[#002045] text-white text-[11px] font-bold">
                              {currentYearRecord.gpa >= 8.5 ? 'Xuất sắc' : currentYearRecord.gpa >= 8.0 ? 'Giỏi' : 'Khá'}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION B: NHẬN XÉT ĐÁNH GIÁ 4 CHIỀU KÍCH ĐÀO TẠO */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#002045]" />
                    <span>Đánh giá Huấn luyện theo 4 Chiều Kích: {currentYearRecord.yearName}</span>
                  </h3>
                  <p className="text-[12.5px] text-[#74777f] mt-0.5">
                    Huấn luyện toàn diện ứng sinh linh mục theo định hướng của Giáo hội Công giáo (Ratio Fundamentalis)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Thiêng Liêng */}
                  <div className="p-4.5 rounded-2xl bg-[#eff5fc] border border-[#bed3f5] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#002045] text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#002045] uppercase tracking-wide">
                          Chiều kích Thiêng Liêng (Spiritual)
                        </h4>
                        <p className="text-[11px] text-[#535f70]">Cầu nguyện, Thánh lễ, Linh thao, Thánh Thể & Bí tích</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-[#181c1e] leading-relaxed pt-1 pl-1">
                      {currentYearRecord.evaluation.spiritual}
                    </p>
                  </div>

                  {/* 2. Nhân Bản */}
                  <div className="p-4.5 rounded-2xl bg-[#fdf8f0] border border-[#f3ddbe] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#875200] text-white flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#875200] uppercase tracking-wide">
                          Chiều kích Nhân Bản (Human)
                        </h4>
                        <p className="text-[11px] text-[#74777f]">Trưởng thành tâm lý, kỷ luật, hòa đồng, khiêm tốn & trung thực</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-[#181c1e] leading-relaxed pt-1 pl-1">
                      {currentYearRecord.evaluation.human}
                    </p>
                  </div>

                  {/* 3. Tri Thức */}
                  <div className="p-4.5 rounded-2xl bg-[#f0f9f8] border border-[#bce8e3] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#005f5a] text-white flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#005f5a] uppercase tracking-wide">
                          Chiều kích Tri Thức (Intellectual)
                        </h4>
                        <p className="text-[11px] text-[#535f70]">Khả năng nghiên cứu, đọc sách, tiếp thu giáo lý & thần học</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-[#181c1e] leading-relaxed pt-1 pl-1">
                      {currentYearRecord.evaluation.intellectual}
                    </p>
                  </div>

                  {/* 4. Mục Vụ */}
                  <div className="p-4.5 rounded-2xl bg-[#f7f3fb] border border-[#ded0f3] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#4b2875] text-white flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#4b2875] uppercase tracking-wide">
                          Chiều kích Mục Vụ (Pastoral)
                        </h4>
                        <p className="text-[11px] text-[#535f70]">Kỹ năng mục vụ, huấn giáo thiếu nhi, giới trẻ & dấn thân phục vụ</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-[#181c1e] leading-relaxed pt-1 pl-1">
                      {currentYearRecord.evaluation.pastoral}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION C: NHẬN XÉT CỦA QUÝ CHA XỨ & BAN ĐÀO TẠO CỦA NĂM HỌC */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#002045] flex items-center gap-2">
                      <Church className="w-5 h-5 text-[#002045]" />
                      <span>Đánh giá Huấn luyện & Nhận xét của Quý Cha Xứ, Ban Đào Tạo: {currentYearRecord.yearName}</span>
                    </h3>
                    <p className="text-[12.5px] text-[#74777f] mt-0.5">
                      Bản nhận xét toàn diện từ Cha xứ quê hương, Cha xứ giúp hè và Ban Đào Tạo Chủng viện trong năm học
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditYearModal(currentYearRecord)}
                    className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#e8effd] hover:bg-[#d4e3fc] text-[#002045] font-bold text-[12.5px] flex items-center gap-2 border border-[#002045]/20 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Cập nhật nhận xét năm này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* Card 1: Nhận xét của Cha xứ quê nhà */}
                  <div className="p-5 rounded-2xl bg-linear-to-b from-[#f0f4fa] to-[#e8effd] border border-[#adc7f7] shadow-2xs space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#d6e3ff] text-[#002045]">
                            <Home className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10.5px] font-bold text-[#002045] uppercase tracking-wider">
                              GIÁO XỨ QUÊ HƯƠNG
                            </span>
                            <h4 className="text-[14px] font-bold text-[#181c1e] leading-tight">
                              Nhận xét của Cha xứ nhà
                            </h4>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#002045] text-white text-[11px] font-bold rounded-md shrink-0">
                          {currentYearRecord.homeParishEvaluation?.ranking || 'Gương mẫu'}
                        </span>
                      </div>

                      {/* Thông tin Giáo xứ & Cha xứ nhà */}
                      <div className="p-2.5 bg-white/90 rounded-xl border border-[#adc7f7]/60 text-[12px] space-y-1">
                        <div>
                          <span className="font-bold text-[#74777f]">Giáo xứ: </span>
                          <strong className="text-[#002045]">{currentYearRecord.homeParishEvaluation?.parishName || seminarian.homeParish || seminarian.parish}</strong>
                        </div>
                        <div>
                          <span className="font-bold text-[#74777f]">Cha xứ: </span>
                          <strong className="text-[#181c1e]">{currentYearRecord.homeParishEvaluation?.pastorName || 'Cha xứ Phêrô Nguyễn Văn Hữu'}</strong>
                        </div>
                        <div className="text-[11px] text-[#74777f] pt-0.5">
                          Thời gian: {currentYearRecord.homeParishEvaluation?.period || `Năm phụng vụ ${currentYearRecord.schoolYear}`}
                        </div>
                      </div>

                      {/* Lời nhận xét chi tiết */}
                      <div className="p-3 bg-white rounded-xl border border-[#adc7f7]/80">
                        <p className="text-[13px] text-[#181c1e] leading-relaxed italic">
                          "{currentYearRecord.homeParishEvaluation?.evaluation || 'Thầy luôn giữ mối liên hệ mật thiết với Giáo xứ quê hương, khi về nghỉ lễ luôn sốt sắng phục vụ bàn thờ Chúa và là gương sáng đạo đức cho các bạn trẻ trong giáo xứ.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Nhận xét của Cha xứ giúp hè */}
                  <div className="p-5 rounded-2xl bg-linear-to-b from-[#fffbf0] to-[#fff7e6] border border-[#ffddba] shadow-2xs space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#ffddba] text-[#875200]">
                            <Sun className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10.5px] font-bold text-[#875200] uppercase tracking-wider">
                              MỤC VỤ HÈ / THỰC TẬP
                            </span>
                            <h4 className="text-[14px] font-bold text-[#181c1e] leading-tight">
                              Nhận xét của Cha xứ giúp
                            </h4>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#875200] text-white text-[11px] font-bold rounded-md shrink-0">
                          {currentYearRecord.summerParishEvaluation?.ranking || 'Xuất sắc'}
                        </span>
                      </div>

                      {/* Thông tin Giáo xứ & Cha xứ giúp */}
                      <div className="p-2.5 bg-white/90 rounded-xl border border-[#ffddba]/60 text-[12px] space-y-1">
                        <div>
                          <span className="font-bold text-[#74777f]">Giáo xứ giúp: </span>
                          <strong className="text-[#002045]">{currentYearRecord.summerParishEvaluation?.parishName || 'Giáo xứ Đồng Trì'}</strong>
                        </div>
                        <div>
                          <span className="font-bold text-[#74777f]">Cha xứ: </span>
                          <strong className="text-[#181c1e]">{currentYearRecord.summerParishEvaluation?.pastorName || 'Cha xứ Giuse Phạm Văn Lâm'}</strong>
                        </div>
                        <div className="text-[11px] text-[#74777f] pt-0.5">
                          Thời gian: {currentYearRecord.summerParishEvaluation?.period || 'Mục vụ hè (Tháng 6 - Tháng 8)'}
                        </div>
                      </div>

                      {/* Lời nhận xét chi tiết */}
                      <div className="p-3 bg-white rounded-xl border border-[#ffddba]/80">
                        <p className="text-[13px] text-[#181c1e] leading-relaxed italic">
                          "{currentYearRecord.summerParishEvaluation?.evaluation || 'Trong kỳ nghỉ hè, thầy đã nhiệt thành phụ trách Ban Lễ sinh và các lớp Giáo lý hè, đời sống gương mẫu, được cha xứ và bà con giáo dân hết lòng quý mến.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Nhận xét của Ban Đào Tạo của năm học */}
                  <div className="p-5 rounded-2xl bg-linear-to-b from-[#f0f9f8] to-[#e6f4f2] border border-[#bce8e3] shadow-2xs space-y-3.5 flex flex-col justify-between md:col-span-2 xl:col-span-1">
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#bce8e3] text-[#005f5a]">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10.5px] font-bold text-[#005f5a] uppercase tracking-wider">
                              BAN ĐÀO TẠO NĂM HỌC
                            </span>
                            <h4 className="text-[14px] font-bold text-[#181c1e] leading-tight">
                              Đánh giá của Ban Đào Tạo
                            </h4>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#005f5a] text-white text-[11px] font-bold rounded-md shrink-0">
                          {currentYearRecord.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                        </span>
                      </div>

                      {/* Thông tin Ban Đào Tạo & Tiến cử */}
                      <div className="p-2.5 bg-white/90 rounded-xl border border-[#bce8e3]/60 text-[12px] space-y-1">
                        <div>
                          <span className="font-bold text-[#74777f]">Đại diện: </span>
                          <strong className="text-[#005f5a]">{currentYearRecord.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo Đại Chủng Viện'}</strong>
                        </div>
                        <div>
                          <span className="font-bold text-[#74777f]">Quyết nghị: </span>
                          <strong className="text-[#181c1e]">{currentYearRecord.formationBoardEvaluation?.recommendation || 'Đủ điều kiện chuyển tiếp theo quy chế.'}</strong>
                        </div>
                        <div className="text-[11px] text-[#74777f] pt-0.5">
                          Niên khóa: {currentYearRecord.formationBoardEvaluation?.period || `Niên khóa ${currentYearRecord.schoolYear}`}
                        </div>
                      </div>

                      {/* Lời nhận xét chi tiết */}
                      <div className="p-3 bg-white rounded-xl border border-[#bce8e3]/80">
                        <p className="text-[13px] text-[#181c1e] leading-relaxed italic">
                          "{currentYearRecord.formationBoardEvaluation?.evaluation || 'Chủng sinh có tiến bộ vượt bậc về đời sống nội tâm, tinh thần huynh đệ hòa đồng, học lực vững vàng và trách nhiệm cao trong sứ vụ mục vụ tông đồ.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIẾN TRÌNH LINH ĐẠO */}
          {activeTab === 'spiritual' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-6">
              <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1a365d]" />
                <span>Tiến trình Huấn luyện & Linh hướng</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                  <h4 className="text-[14px] font-bold text-[#002045] mb-1">Linh hướng hàng tháng</h4>
                  <p className="text-[13px] text-[#43474e]">
                    Cha Linh hướng: <strong>Cha Giuse Đỗ Văn An</strong>. Thầy duy trì gặp gỡ định kỳ 2 tuần/lần, có tinh thần cởi mở và chân thành trong biện phân ơn gọi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                  <h4 className="text-[14px] font-bold text-[#002045] mb-1">Các kỳ Tĩnh tâm & Linh thao</h4>
                  <p className="text-[13px] text-[#43474e]">
                    Đã hoàn tất kỳ Linh thao Thánh Inhaxiô 30 ngày (năm Tu đức) và các tuần tĩnh tâm năm chuẩn bị lãnh nhận tác vụ Đọc sách & Giúp lễ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NHẬN XÉT */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-6">
              <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#1a365d]" />
                <span>Nhận xét của Ban Giám đốc & Cố vấn</span>
              </h3>

              <div className="p-5 rounded-2xl bg-[#ffddba]/20 border border-[#ffb866] text-[#181c1e]">
                <p className="text-[12px] font-bold text-[#875200] uppercase tracking-wider mb-2">
                  ĐÁNH GIÁ NĂM HỌC HIỆN TẠI
                </p>
                <p className="text-[14px] leading-relaxed italic">
                  "{seminarian.advisorNote || 'Thầy có đời sống gương mẫu, siêng năng cầu nguyện, hòa nhã với anh em và có trách nhiệm cao trong các công việc chung của Đại chủng viện.'}"
                </p>
                <div className="mt-4 pt-3 border-t border-[#ffb866]/40 flex justify-between items-center text-[12px] text-[#74777f]">
                  <span>Người nhận xét: <strong>Cha Cố vấn Đào tạo</strong></span>
                  <span>Cập nhật ngày 15/10/2024</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Timeline Widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] sticky top-20">
            <h3 className="text-[17px] font-bold text-[#002045] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1a365d]" />
              <span>Tiến trình tu học</span>
            </h3>

            {/* Vertical Timeline with exact circles */}
            <div className="relative border-l-2 border-[#e0e3e5] ml-3.5 space-y-7 pb-2">
              {seminarian.timeline.map((t, idx) => {
                const isFuture = t.status === 'future';
                const isCurrent = t.status === 'current';
                const isCompleted = t.status === 'completed';

                return (
                  <div key={idx} className="relative pl-6">
                    {/* Circle Node */}
                    {isFuture && (
                      <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#c4c6cf] -left-[9px] top-1" />
                    )}
                    {isCurrent && (
                      <div className="absolute w-4 h-4 rounded-full bg-[#002045] border-2 border-[#adc7f7] -left-[9px] top-1 shadow-[0_0_0_4px_rgba(214,227,255,0.7)]" />
                    )}
                    {isCompleted && (
                      <div className="absolute w-4 h-4 rounded-full bg-[#875200] border-2 border-white -left-[9px] top-1 shadow-2xs" />
                    )}

                    {/* Text */}
                    <p
                      className={`text-[12px] mb-0.5 ${
                        isCurrent
                          ? 'text-[#002045] font-bold'
                          : isFuture
                          ? 'text-[#74777f]'
                          : 'text-[#74777f]'
                      }`}
                    >
                      {t.year}
                    </p>
                    <p
                      className={`text-[14px] ${
                        isCurrent
                          ? 'text-[#002045] font-bold'
                          : 'text-[#181c1e] font-semibold'
                      }`}
                    >
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="text-[12px] text-[#74777f] mt-1 leading-snug">
                        {t.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CẬP NHẬT ĐÁNH GIÁ & BẢNG ĐIỂM NĂM HỌC */}
      {isEditRecordModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#adc7f7]/40">
            {/* Modal Header */}
            <div className="p-6 bg-linear-to-r from-[#002045] to-[#1a365d] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#ffddba] text-[#875200] text-[11px] font-bold uppercase">
                    CẬP NHẬT ĐÁNH GIÁ & HỌC VỤ
                  </span>
                  <span className="text-[12px] text-white/80">Niên khóa: {editingRecord.schoolYear}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {editingRecord.yearName} • {seminarian.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditRecordModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveYearRecord} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. ĐÁNH GIÁ 4 CHIỀU KÍCH */}
              <div className="p-5 rounded-2xl bg-[#f0f4fa] border border-[#adc7f7]/60 space-y-4">
                <h4 className="text-[15px] font-bold text-[#002045] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#002045]" />
                  <span>1. Đánh giá 4 Chiều Kích Huấn Luyện</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#002045] uppercase mb-1">
                      1. Chiều kích Nhân bản
                    </label>
                    <textarea
                      rows={2}
                      value={editingRecord.evaluation.human}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        evaluation: { ...editingRecord.evaluation, human: e.target.value }
                      })}
                      className="w-full text-[13px] p-3 rounded-xl border border-[#adc7f7] bg-white focus:ring-2 focus:ring-[#002045] outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1a365d] uppercase mb-1">
                      2. Chiều kích Thiêng liêng
                    </label>
                    <textarea
                      rows={2}
                      value={editingRecord.evaluation.spiritual}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        evaluation: { ...editingRecord.evaluation, spiritual: e.target.value }
                      })}
                      className="w-full text-[13px] p-3 rounded-xl border border-[#adc7f7] bg-white focus:ring-2 focus:ring-[#1a365d] outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#875200] uppercase mb-1">
                      3. Chiều kích Tri thức
                    </label>
                    <textarea
                      rows={2}
                      value={editingRecord.evaluation.intellectual}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        evaluation: { ...editingRecord.evaluation, intellectual: e.target.value }
                      })}
                      className="w-full text-[13px] p-3 rounded-xl border border-[#ffddba] bg-white focus:ring-2 focus:ring-[#875200] outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#4b2875] uppercase mb-1">
                      4. Chiều kích Mục vụ
                    </label>
                    <textarea
                      rows={2}
                      value={editingRecord.evaluation.pastoral}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        evaluation: { ...editingRecord.evaluation, pastoral: e.target.value }
                      })}
                      className="w-full text-[13px] p-3 rounded-xl border border-[#ded0f3] bg-white focus:ring-2 focus:ring-[#4b2875] outline-hidden resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. NHẬN XÉT CỦA CHA XỨ NHÀ */}
              <div className="p-5 rounded-2xl bg-[#f0f4fa] border border-[#adc7f7] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold text-[#002045] flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#002045]" />
                    <span>2. Nhận xét của Cha xứ quê nhà (Giáo xứ quê hương)</span>
                  </h4>
                  <select
                    value={editingRecord.homeParishEvaluation?.ranking || 'Gương mẫu'}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      homeParishEvaluation: {
                        parishName: editingRecord.homeParishEvaluation?.parishName || seminarian.homeParish || seminarian.parish,
                        pastorName: editingRecord.homeParishEvaluation?.pastorName || 'Cha xứ Phêrô Nguyễn Văn Hữu',
                        period: editingRecord.homeParishEvaluation?.period || `Năm phụng vụ ${editingRecord.schoolYear}`,
                        evaluation: editingRecord.homeParishEvaluation?.evaluation || '',
                        ranking: e.target.value
                      }
                    })}
                    className="text-[12px] font-bold p-1.5 px-3 rounded-lg border border-[#adc7f7] bg-white text-[#002045]"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Gương mẫu">Gương mẫu</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Giáo xứ quê nhà
                    </label>
                    <input
                      type="text"
                      value={editingRecord.homeParishEvaluation?.parishName || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        homeParishEvaluation: {
                          ranking: editingRecord.homeParishEvaluation?.ranking || 'Gương mẫu',
                          pastorName: editingRecord.homeParishEvaluation?.pastorName || '',
                          period: editingRecord.homeParishEvaluation?.period || '',
                          evaluation: editingRecord.homeParishEvaluation?.evaluation || '',
                          parishName: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#adc7f7] bg-white focus:ring-2 focus:ring-[#002045] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Tên Cha xứ nhà nhận xét
                    </label>
                    <input
                      type="text"
                      value={editingRecord.homeParishEvaluation?.pastorName || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        homeParishEvaluation: {
                          ranking: editingRecord.homeParishEvaluation?.ranking || 'Gương mẫu',
                          parishName: editingRecord.homeParishEvaluation?.parishName || '',
                          period: editingRecord.homeParishEvaluation?.period || '',
                          evaluation: editingRecord.homeParishEvaluation?.evaluation || '',
                          pastorName: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#adc7f7] bg-white focus:ring-2 focus:ring-[#002045] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                    Lời nhận xét của Cha xứ nhà
                  </label>
                  <textarea
                    rows={2}
                    value={editingRecord.homeParishEvaluation?.evaluation || ''}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      homeParishEvaluation: {
                        ranking: editingRecord.homeParishEvaluation?.ranking || 'Gương mẫu',
                        parishName: editingRecord.homeParishEvaluation?.parishName || '',
                        pastorName: editingRecord.homeParishEvaluation?.pastorName || '',
                        period: editingRecord.homeParishEvaluation?.period || '',
                        evaluation: e.target.value
                      }
                    })}
                    className="w-full text-[13px] p-3 rounded-xl border border-[#adc7f7] bg-white focus:ring-2 focus:ring-[#002045] outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* 3. NHẬN XÉT CỦA CHA XỨ GIÚP HÈ */}
              <div className="p-5 rounded-2xl bg-[#fffbf0] border border-[#ffddba] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold text-[#875200] flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#875200]" />
                    <span>3. Nhận xét của Cha xứ giúp (Mục vụ hè / Năm thực tập)</span>
                  </h4>
                  <select
                    value={editingRecord.summerParishEvaluation?.ranking || 'Xuất sắc'}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      summerParishEvaluation: {
                        parishName: editingRecord.summerParishEvaluation?.parishName || 'Giáo xứ Đồng Trì',
                        pastorName: editingRecord.summerParishEvaluation?.pastorName || 'Cha xứ Giuse Phạm Văn Lâm',
                        period: editingRecord.summerParishEvaluation?.period || 'Mục vụ hè (Tháng 6 - Tháng 8)',
                        evaluation: editingRecord.summerParishEvaluation?.evaluation || '',
                        ranking: e.target.value
                      }
                    })}
                    className="text-[12px] font-bold p-1.5 px-3 rounded-lg border border-[#ffddba] bg-white text-[#875200]"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                    <option value="Trung bình">Trung bình</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Giáo xứ giúp hè / thực tập
                    </label>
                    <input
                      type="text"
                      value={editingRecord.summerParishEvaluation?.parishName || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        summerParishEvaluation: {
                          ranking: editingRecord.summerParishEvaluation?.ranking || 'Xuất sắc',
                          pastorName: editingRecord.summerParishEvaluation?.pastorName || '',
                          period: editingRecord.summerParishEvaluation?.period || '',
                          evaluation: editingRecord.summerParishEvaluation?.evaluation || '',
                          parishName: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#ffddba] bg-white focus:ring-2 focus:ring-[#875200] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Tên Cha xứ nhận xét
                    </label>
                    <input
                      type="text"
                      value={editingRecord.summerParishEvaluation?.pastorName || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        summerParishEvaluation: {
                          ranking: editingRecord.summerParishEvaluation?.ranking || 'Xuất sắc',
                          parishName: editingRecord.summerParishEvaluation?.parishName || '',
                          period: editingRecord.summerParishEvaluation?.period || '',
                          evaluation: editingRecord.summerParishEvaluation?.evaluation || '',
                          pastorName: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#ffddba] bg-white focus:ring-2 focus:ring-[#875200] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                    Lời nhận xét của Cha xứ giúp hè
                  </label>
                  <textarea
                    rows={2}
                    value={editingRecord.summerParishEvaluation?.evaluation || ''}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      summerParishEvaluation: {
                        ranking: editingRecord.summerParishEvaluation?.ranking || 'Xuất sắc',
                        parishName: editingRecord.summerParishEvaluation?.parishName || '',
                        pastorName: editingRecord.summerParishEvaluation?.pastorName || '',
                        period: editingRecord.summerParishEvaluation?.period || '',
                        evaluation: e.target.value
                      }
                    })}
                    className="w-full text-[13px] p-3 rounded-xl border border-[#ffddba] bg-white focus:ring-2 focus:ring-[#875200] outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* 4. NHẬN XÉT CỦA BAN ĐÀO TẠO */}
              <div className="p-5 rounded-2xl bg-[#f0f9f8] border border-[#bce8e3] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold text-[#005f5a] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#005f5a]" />
                    <span>4. Đánh giá của Ban Đào Tạo của năm học</span>
                  </h4>
                  <select
                    value={editingRecord.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      formationBoardEvaluation: {
                        directorOrFormatorName: editingRecord.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo Đại Chủng Viện',
                        recommendation: editingRecord.formationBoardEvaluation?.recommendation || 'Đủ điều kiện chuyển tiếp theo quy chế.',
                        period: editingRecord.formationBoardEvaluation?.period || `Niên khóa ${editingRecord.schoolYear}`,
                        evaluation: editingRecord.formationBoardEvaluation?.evaluation || '',
                        ranking: e.target.value
                      }
                    })}
                    className="text-[12px] font-bold p-1.5 px-3 rounded-lg border border-[#bce8e3] bg-white text-[#005f5a]"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Tốt">Tốt</option>
                    <option value="Đạt yêu cầu">Đạt yêu cầu</option>
                    <option value="Cần rèn luyện thêm">Cần rèn luyện thêm</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Đại diện Ban Đào tạo / Cha Đặc trách
                    </label>
                    <input
                      type="text"
                      value={editingRecord.formationBoardEvaluation?.directorOrFormatorName || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        formationBoardEvaluation: {
                          ranking: editingRecord.formationBoardEvaluation?.ranking || 'Xuất sắc',
                          recommendation: editingRecord.formationBoardEvaluation?.recommendation || '',
                          period: editingRecord.formationBoardEvaluation?.period || '',
                          evaluation: editingRecord.formationBoardEvaluation?.evaluation || '',
                          directorOrFormatorName: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#bce8e3] bg-white focus:ring-2 focus:ring-[#005f5a] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                      Quyết nghị / Đề xuất tiến cử
                    </label>
                    <input
                      type="text"
                      value={editingRecord.formationBoardEvaluation?.recommendation || ''}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        formationBoardEvaluation: {
                          ranking: editingRecord.formationBoardEvaluation?.ranking || 'Xuất sắc',
                          directorOrFormatorName: editingRecord.formationBoardEvaluation?.directorOrFormatorName || '',
                          period: editingRecord.formationBoardEvaluation?.period || '',
                          evaluation: editingRecord.formationBoardEvaluation?.evaluation || '',
                          recommendation: e.target.value
                        }
                      })}
                      className="w-full text-[13px] p-2.5 rounded-xl border border-[#bce8e3] bg-white focus:ring-2 focus:ring-[#005f5a] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#74777f] uppercase mb-1">
                    Lời nhận xét của Ban Đào Tạo
                  </label>
                  <textarea
                    rows={2}
                    value={editingRecord.formationBoardEvaluation?.evaluation || ''}
                    onChange={(e) => setEditingRecord({
                      ...editingRecord,
                      formationBoardEvaluation: {
                        ranking: editingRecord.formationBoardEvaluation?.ranking || 'Xuất sắc',
                        directorOrFormatorName: editingRecord.formationBoardEvaluation?.directorOrFormatorName || '',
                        recommendation: editingRecord.formationBoardEvaluation?.recommendation || '',
                        period: editingRecord.formationBoardEvaluation?.period || '',
                        evaluation: e.target.value
                      }
                    })}
                    className="w-full text-[13px] p-3 rounded-xl border border-[#bce8e3] bg-white focus:ring-2 focus:ring-[#005f5a] outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* 5. ĐIỂM SỐ CÁC MÔN HỌC & THÊM MÔN HỌC MỚI CHO TỪNG NĂM */}
              <div className="p-5 rounded-2xl bg-white border border-[#e0e3e5] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-bold text-[#002045] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#002045]" />
                      <span>5. Bảng điểm môn học: {editingRecord.yearName} ({editingRecord.subjects.length} môn)</span>
                    </h4>
                    <p className="text-[11px] text-[#74777f] mt-0.5">
                      Thêm môn học mới, sửa điểm, số tín chỉ và giáo sư cho năm đào tạo này
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newSubject = {
                        code: `MH${(editingRecord.subjects.length + 1).toString().padStart(2, '0')}`,
                        name: 'Môn học mới',
                        credits: 2,
                        score: 8.5,
                        instructor: 'Giáo sư phụ trách',
                        semester: 'HK I',
                      };
                      setEditingRecord({
                        ...editingRecord,
                        subjects: [...editingRecord.subjects, newSubject],
                      });
                    }}
                    className="px-3.5 py-1.5 bg-[#002045] hover:bg-[#1a365d] text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm môn học</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {editingRecord.subjects.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e0e3e5] hover:border-[#adc7f7] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 flex-1">
                        <div>
                          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-0.5">
                            Mã môn
                          </label>
                          <input
                            type="text"
                            value={sub.code}
                            onChange={(e) => {
                              const newSubjects = [...editingRecord.subjects];
                              newSubjects[sIdx] = { ...sub, code: e.target.value };
                              setEditingRecord({ ...editingRecord, subjects: newSubjects });
                            }}
                            placeholder="TH01..."
                            className="w-full text-[12px] font-mono font-bold p-1.5 px-2.5 rounded-lg border border-[#c4c6cf] bg-white focus:border-[#002045] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-0.5">
                            Tên môn học *
                          </label>
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => {
                              const newSubjects = [...editingRecord.subjects];
                              newSubjects[sIdx] = { ...sub, name: e.target.value };
                              setEditingRecord({ ...editingRecord, subjects: newSubjects });
                            }}
                            placeholder="Nhập tên môn học..."
                            className="w-full text-[12px] font-bold p-1.5 px-2.5 rounded-lg border border-[#c4c6cf] bg-white focus:border-[#002045] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-0.5">
                            Số tín chỉ
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sub.credits}
                            onChange={(e) => {
                              const newCredits = parseInt(e.target.value) || 1;
                              const newSubjects = [...editingRecord.subjects];
                              newSubjects[sIdx] = { ...sub, credits: newCredits };
                              setEditingRecord({ ...editingRecord, subjects: newSubjects });
                            }}
                            className="w-full text-[12px] font-bold text-center p-1.5 rounded-lg border border-[#c4c6cf] bg-white focus:border-[#002045] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-0.5">
                            Học kỳ
                          </label>
                          <select
                            value={sub.semester || 'HK I'}
                            onChange={(e) => {
                              const newSubjects = [...editingRecord.subjects];
                              newSubjects[sIdx] = { ...sub, semester: e.target.value };
                              setEditingRecord({ ...editingRecord, subjects: newSubjects });
                            }}
                            className="w-full text-[12px] font-bold p-1.5 rounded-lg border border-[#c4c6cf] bg-white focus:border-[#002045] outline-none text-[#002045]"
                          >
                            <option value="HK I">HK I</option>
                            <option value="HK II">HK II</option>
                            <option value="Cả năm">Cả năm</option>
                            <option value="Hè">Khóa hè</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1 md:pt-0 border-t md:border-t-0 border-[#e0e3e5]">
                        <div>
                          <label className="block text-[10px] font-bold text-[#74777f] uppercase mb-0.5">
                            Điểm số (0-10)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={sub.score}
                            onChange={(e) => {
                              const newScore = parseFloat(e.target.value) || 0;
                              const newSubjects = [...editingRecord.subjects];
                              newSubjects[sIdx] = { ...sub, score: newScore };
                              setEditingRecord({ ...editingRecord, subjects: newSubjects });
                            }}
                            className="w-20 text-[14px] font-black text-center p-1.5 rounded-lg border-2 border-[#002045] bg-[#e8effd] text-[#002045] outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (editingRecord.subjects.length <= 1) return;
                            const newSubjects = editingRecord.subjects.filter((_, idx) => idx !== sIdx);
                            setEditingRecord({ ...editingRecord, subjects: newSubjects });
                          }}
                          disabled={editingRecord.subjects.length <= 1}
                          title="Xóa môn học này"
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            editingRecord.subjects.length <= 1
                              ? 'text-[#c4c6cf] cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#e8effd] rounded-xl border border-[#002045]/20 flex items-center justify-between text-[12px]">
                  <span className="text-[#535f70]">
                    Tổng số môn: <strong className="text-[#002045]">{editingRecord.subjects.length} môn</strong> • Tổng số tín chỉ:{' '}
                    <strong className="text-[#002045]">
                      {editingRecord.subjects.reduce((sum, s) => sum + s.credits, 0)} tín chỉ
                    </strong>
                  </span>
                  <span className="font-bold text-[#002045]">
                    Điểm TB (GPA dự kiến):{' '}
                    {(
                      editingRecord.subjects.reduce((sum, s) => sum + s.score * s.credits, 0) /
                      (editingRecord.subjects.reduce((sum, s) => sum + s.credits, 0) || 1)
                    ).toFixed(1)}{' '}
                    / 10
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#e0e3e5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditRecordModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#c4c6cf] text-[#43474e] font-semibold text-[13px] hover:bg-[#f7fafc] transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white font-bold text-[13px] shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu cập nhật năm này</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Dossier & Export Modal (A4 Print / Word / PDF) */}
      <SeminarianReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        seminarian={seminarian}
      />
    </div>
  );
};
