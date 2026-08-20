import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  FilterX, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Printer,
  FileCheck
} from 'lucide-react';
import { Seminarian } from '../types';
import { SeminarianReviewModal } from './SeminarianReviewModal';

interface SeminarianListViewProps {
  seminarians: Seminarian[];
  onSelectSeminarian: (sem: Seminarian) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (sem: Seminarian) => void;
  onDeleteSeminarian: (id: string) => void;
}

export const SeminarianListView: React.FC<SeminarianListViewProps> = ({
  seminarians,
  onSelectSeminarian,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteSeminarian,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDiocese, setSelectedDiocese] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewingSeminarian, setReviewingSeminarian] = useState<Seminarian | null>(null);
  const itemsPerPage = 8;

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBatch('');
    setSelectedDiocese('');
    setSelectedStage('');
    setCurrentPage(1);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return seminarians.filter((sem) => {
      const matchSearch =
        searchTerm === '' ||
        sem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sem.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sem.saintName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sem.parish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sem.homeParish && sem.homeParish.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sem.admissionParish && sem.admissionParish.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sem.gmail && sem.gmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sem.email && sem.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchBatch =
        selectedBatch === '' || sem.batch.toLowerCase() === selectedBatch.toLowerCase();

      const matchDiocese =
        selectedDiocese === '' || sem.diocese.toLowerCase() === selectedDiocese.toLowerCase();

      const matchStage =
        selectedStage === '' || sem.stage.toLowerCase().includes(selectedStage.toLowerCase());

      return matchSearch && matchBatch && matchDiocese && matchStage;
    });
  }, [seminarians, searchTerm, selectedBatch, selectedDiocese, selectedStage]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Stage badge color helper
  const getStageBadgeClass = (stage: string) => {
    if (stage.includes('Thần')) {
      return 'bg-[#002045]/10 text-[#002045] border border-[#002045]/20';
    }
    if (stage.includes('Thực tập')) {
      return 'bg-[#ffddba] text-[#875200] border border-[#ffb866]';
    }
    if (stage.includes('Triết')) {
      return 'bg-[#fae361]/30 text-[#6b5f00] border border-[#fae361]/50';
    }
    if (stage.includes('Phó tế')) {
      return 'bg-[#adc7f7] text-[#001b3c] border border-[#86a0cd] font-bold';
    }
    return 'bg-[#e5e9eb] text-[#43474e]';
  };

  // Status badge dot helper
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Đang học':
        return { dot: 'bg-[#6b5f00]', text: 'text-[#6b5f00]' };
      case 'Thực tập mục vụ':
        return { dot: 'bg-[#875200]', text: 'text-[#875200]' };
      case 'Nghỉ hè':
        return { dot: 'bg-[#74777f]', text: 'text-[#74777f]' };
      default:
        return { dot: 'bg-[#ba1a1a]', text: 'text-[#ba1a1a]' };
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Danh sách Chủng sinh
          </h1>
          <p className="text-[14px] text-[#74777f] mt-1 font-normal">
            Quản lý và theo dõi thông tin của <strong className="text-[#002045] font-semibold">{filteredList.length}</strong> chủng sinh.
          </p>
        </div>

        <button
          id="add-seminarian-btn"
          onClick={onOpenAddModal}
          className="bg-[#002045] text-white hover:bg-[#1a365d] px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm chủng sinh mới</span>
        </button>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e0e3e5] flex flex-col lg:flex-row gap-3.5 items-center">
        {/* Search */}
        <div className="relative w-full lg:w-1/3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777f]" />
          <input
            id="seminarian-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm theo tên, mã số, giáo xứ..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[14px] text-[#181c1e] focus:bg-white focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/10 outline-none transition-all placeholder-[#74777f]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          {/* Filter: Khóa */}
          <select
            id="filter-batch"
            value={selectedBatch}
            onChange={(e) => {
              setSelectedBatch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[13px] font-medium text-[#181c1e] focus:border-[#002045] outline-none cursor-pointer"
          >
            <option value="">Tất cả Khóa</option>
            <option value="Khóa 18">Khóa 18 (2018)</option>
            <option value="Khóa 19">Khóa 19 (2019)</option>
            <option value="Khóa 20">Khóa 20 (2020)</option>
            <option value="Khóa 21">Khóa 21 (2021)</option>
            <option value="Khóa 22">Khóa 22 (2022)</option>
          </select>

          {/* Filter: Giáo phận */}
          <select
            id="filter-diocese"
            value={selectedDiocese}
            onChange={(e) => {
              setSelectedDiocese(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[13px] font-medium text-[#181c1e] focus:border-[#002045] outline-none cursor-pointer"
          >
            <option value="">Tất cả Giáo phận</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hải Phòng">Hải Phòng</option>
            <option value="Bắc Ninh">Bắc Ninh</option>
            <option value="Phát Diệm">Phát Diệm</option>
            <option value="Bùi Chu">Bùi Chu</option>
            <option value="Hưng Hóa">Hưng Hóa</option>
          </select>

          {/* Filter: Giai đoạn */}
          <select
            id="filter-stage"
            value={selectedStage}
            onChange={(e) => {
              setSelectedStage(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl text-[13px] font-medium text-[#181c1e] focus:border-[#002045] outline-none cursor-pointer"
          >
            <option value="">Tất cả Giai đoạn</option>
            <option value="Tu đức">Tu đức</option>
            <option value="Triết">Triết học</option>
            <option value="Thần">Thần học</option>
            <option value="Thực tập">Thực tập mục vụ</option>
            <option value="Phó tế">Phó tế</option>
          </select>

          {/* Clear Filters Button */}
          {(searchTerm || selectedBatch || selectedDiocese || selectedStage) && (
            <button
              id="clear-filters-btn"
              onClick={handleClearFilters}
              className="px-3.5 py-2.5 text-[#002045] font-semibold text-[13px] hover:bg-[#d6e3ff]/40 rounded-xl transition-colors ml-auto flex items-center gap-1.5 cursor-pointer"
            >
              <FilterX className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Batch Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1a365d] text-white px-5 py-3 rounded-xl flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-150">
          <span className="text-[13px] font-medium">
            Đã chọn <strong>{selectedIds.length}</strong> chủng sinh
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Đang chuẩn bị in danh sách ${selectedIds.length} chủng sinh đã chọn...`);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In danh sách</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} chủng sinh đã chọn?`)) {
                  selectedIds.forEach((id) => onDeleteSeminarian(id));
                  setSelectedIds([]);
                }
              }}
              className="px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa mục đã chọn</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-xs overflow-hidden border border-[#e0e3e5]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f1f4f6] border-b border-[#e0e3e5]">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedList.length > 0 &&
                      selectedIds.length === paginatedList.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-[#002045] focus:ring-[#002045] border-[#c4c6cf] w-4 h-4 cursor-pointer"
                    aria-label="Chọn tất cả"
                  />
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider">
                  Họ tên & Avatar
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider">
                  Khóa
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider">
                  Giáo phận
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider">
                  Giai đoạn
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="p-4 text-[12px] font-bold text-[#74777f] uppercase tracking-wider text-right w-28">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e0e3e5]">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#74777f]">
                    <p className="text-[15px] font-medium">Không tìm thấy chủng sinh nào phù hợp.</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-3 text-[13px] text-[#002045] font-bold underline cursor-pointer"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedList.map((sem, idx) => {
                  const statusInfo = getStatusInfo(sem.status);
                  const isChecked = selectedIds.includes(sem.id);

                  return (
                    <tr
                      key={sem.id}
                      className={`hover:bg-[#f7fafc] transition-all group cursor-pointer ${
                        isChecked ? 'bg-[#d6e3ff]/20' : idx % 2 === 1 ? 'bg-[#f7fafc]/40' : 'bg-white'
                      }`}
                      onClick={() => onSelectSeminarian(sem)}
                    >
                      {/* Checkbox */}
                      <td
                        className="p-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(sem.id)}
                          className="rounded text-[#002045] focus:ring-[#002045] border-[#c4c6cf] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {sem.avatarUrl ? (
                            <img
                              src={sem.avatarUrl}
                              alt={sem.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-[#c4c6cf]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#adc7f7]/40 text-[#002045] font-bold text-sm flex items-center justify-center border border-[#adc7f7]">
                              {sem.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[14px] text-[#181c1e] group-hover:text-[#002045] transition-colors">
                              {sem.fullName}
                            </div>
                            <div className="text-[12px] text-[#74777f] font-medium">
                              {sem.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="p-4 text-[14px] text-[#181c1e] font-medium">
                        {sem.batch}
                      </td>

                      {/* Diocese */}
                      <td className="p-4 text-[14px] text-[#181c1e] font-medium">
                        {sem.diocese}
                      </td>

                      {/* Stage Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${getStageBadgeClass(
                            sem.stage
                          )}`}
                        >
                          {sem.stage}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${statusInfo.dot}`}
                          />
                          <span
                            className={`text-[13px] font-semibold ${statusInfo.text}`}
                          >
                            {sem.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setReviewingSeminarian(sem)}
                            className="p-1.5 rounded-full hover:bg-[#e8effd] text-[#002045] transition-colors cursor-pointer"
                            title="Review hồ sơ & Xuất Word/PDF/In A4"
                          >
                            <FileCheck className="w-4 h-4 text-[#002045]" />
                          </button>
                          <button
                            onClick={() => onSelectSeminarian(sem)}
                            className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#43474e] hover:text-[#002045] transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(sem)}
                            className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#43474e] hover:text-[#875200] transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Xác nhận xóa hồ sơ chủng sinh ${sem.fullName}?`)) {
                                onDeleteSeminarian(sem.id);
                              }
                            }}
                            className="p-1.5 rounded-full hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors cursor-pointer"
                            title="Xóa hồ sơ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#e0e3e5] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#74777f]">
            Hiển thị <span className="font-bold text-[#181c1e]">{filteredList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
            <span className="font-bold text-[#181c1e]">{Math.min(currentPage * itemsPerPage, filteredList.length)}</span> trong số{' '}
            <span className="font-bold text-[#181c1e]">{filteredList.length}</span> chủng sinh
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === num
                      ? 'bg-[#002045] text-white shadow-2xs'
                      : 'border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Dossier Modal for selected seminarian from list */}
      <SeminarianReviewModal
        isOpen={Boolean(reviewingSeminarian)}
        onClose={() => setReviewingSeminarian(null)}
        seminarian={reviewingSeminarian}
      />
    </div>
  );
};
