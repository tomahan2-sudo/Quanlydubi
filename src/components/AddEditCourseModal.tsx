import React, { useEffect, useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface AddEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  editingCourse: Course | null;
}

const EMPTY: Omit<Course, 'id'> = {
  code: '',
  name: '',
  instructor: '',
  level: '',
  currentWeek: 0,
  totalWeeks: 12,
  credits: 3,
  semester: 'HK I',
};

export const AddEditCourseModal: React.FC<AddEditCourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCourse,
}) => {
  const [form, setForm] = useState<Omit<Course, 'id'>>(EMPTY);

  useEffect(() => {
    setForm(editingCourse ? { ...editingCourse } : EMPTY);
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ id: editingCourse ? editingCourse.id : `course-${Date.now()}`, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              {editingCourse ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Tên môn học</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Thần học Tín lý I..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Mã môn</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="TH101"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Cấp học</label>
              <input
                type="text"
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                placeholder="Triết I, Thần II..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Giáo sư</label>
              <input
                type="text"
                value={form.instructor}
                onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                placeholder="Cha Giuse Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Tuần hiện tại</label>
              <input
                type="number"
                min={0}
                value={form.currentWeek}
                onChange={(e) => setForm((f) => ({ ...f, currentWeek: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Tổng số tuần</label>
              <input
                type="number"
                min={1}
                value={form.totalWeeks}
                onChange={(e) => setForm((f) => ({ ...f, totalWeeks: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Tín chỉ</label>
              <input
                type="number"
                min={0}
                value={form.credits}
                onChange={(e) => setForm((f) => ({ ...f, credits: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Học kỳ</label>
              <input
                type="text"
                value={form.semester}
                onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
                placeholder="HK I"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[13px] font-bold hover:bg-[#f1f4f6]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#002045] text-white rounded-xl text-[13px] font-bold hover:bg-[#1a365d]"
            >
              {editingCourse ? 'Lưu thay đổi' : 'Thêm môn học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
