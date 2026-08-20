import React, { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { PastoralAssignment } from '../types';

interface AddEditPastoralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: PastoralAssignment) => void;
  editingAssignment: PastoralAssignment | null;
}

const EMPTY: Omit<PastoralAssignment, 'id'> = {
  locationName: '',
  pastor: '',
  count: 1,
  category: '',
  type: 'church',
  address: '',
  seminarians: [],
};

export const AddEditPastoralModal: React.FC<AddEditPastoralModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAssignment,
}) => {
  const [form, setForm] = useState<Omit<PastoralAssignment, 'id'>>(EMPTY);

  useEffect(() => {
    setForm(editingAssignment ? { ...editingAssignment } : EMPTY);
  }, [editingAssignment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.locationName.trim()) return;
    onSave({ id: editingAssignment ? editingAssignment.id : `pastoral-${Date.now()}`, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              {editingAssignment ? 'Sửa Phân công Mục vụ' : 'Thêm Phân công Mục vụ'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Tên Giáo xứ / Trung tâm</label>
              <input
                required
                type="text"
                value={form.locationName}
                onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
                placeholder="Giáo xứ Chính Tòa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Cha xứ / Người phụ trách</label>
              <input
                type="text"
                value={form.pastor}
                onChange={(e) => setForm((f) => ({ ...f, pastor: e.target.value }))}
                placeholder="Cha Giuse Phạm Văn E"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Số chủng sinh</label>
              <input
                type="number"
                min={0}
                value={form.count}
                onChange={(e) => setForm((f) => ({ ...f, count: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Loại</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'church' | 'center' }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none bg-white"
              >
                <option value="church">Giáo xứ</option>
                <option value="center">Trung tâm</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Phân loại</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Năm Tu Đức, Thực tập Xứ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] focus:border-[#002045] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#181c1e] mb-1">Địa chỉ</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Hà Nội..."
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
              {editingAssignment ? 'Lưu thay đổi' : 'Thêm phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
