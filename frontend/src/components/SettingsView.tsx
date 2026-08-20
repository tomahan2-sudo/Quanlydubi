import React, { useState, useEffect } from 'react';
import {
  Building,
  ShieldCheck,
  Database,
  GraduationCap,
  Save,
  RefreshCw,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void | Promise<void>;
  dbConnected: boolean;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  dbConnected,
  onResetData,
}) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Keep the form in sync if settings load/change from outside (e.g. after
  // the initial fetch from the database resolves).
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
          Cài đặt Hệ thống
        </h1>
        <p className="text-[14px] text-[#74777f] mt-1 font-normal">
          Cấu hình thông tin Đại chủng viện, niên khóa đào tạo và phân quyền quản trị.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#d6e3ff]/60 border border-[#86a0cd] text-[#001b3c] rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#002045]" />
          <span className="text-[14px] font-bold">
            Đã lưu thành công mọi thay đổi cấu hình hệ thống!
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Seminary Info & Academics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seminary Details */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-5">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#1a365d]" />
              <span>Thông tin Đại Chủng viện</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Tên cơ sở đào tạo
                </label>
                <input
                  type="text"
                  value={form.seminaryName}
                  onChange={(e) => setForm((f) => ({ ...f, seminaryName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Cha Giám đốc
                </label>
                <input
                  type="text"
                  value={form.rectorName}
                  onChange={(e) => setForm((f) => ({ ...f, rectorName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Thuộc Giáo phận / Giáo tỉnh
                </label>
                <input
                  type="text"
                  value={form.diocese}
                  onChange={(e) => setForm((f) => ({ ...f, diocese: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Niên khóa hiện tại
                </label>
                <input
                  type="text"
                  value={form.currentYear}
                  onChange={(e) => setForm((f) => ({ ...f, currentYear: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Địa chỉ trụ sở chính
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic Structure */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#1a365d]" />
              <span>Chương trình & Khung đào tạo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[13px]">
              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Năm Tu Đức (1 năm)</p>
                <p className="text-[#74777f] mt-0.5">Đặt nền tảng thiêng liêng, kỷ luật và phân định ơn gọi.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Giai đoạn Triết học (2-3 năm)</p>
                <p className="text-[#74777f] mt-0.5">Huấn luyện tư duy, triết học Kitô giáo, nhân học và tiếng Latinh.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Thực tập Mục vụ (1 năm)</p>
                <p className="text-[#74777f] mt-0.5">Trực tiếp phục vụ giáo xứ, dạy giáo lý và sinh hoạt cộng đoàn.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Giai đoạn Thần học (4 năm)</p>
                <p className="text-[#74777f] mt-0.5">Nghiên cứu Tín lý, Luân lý, Kinh Thánh và chuẩn bị chịu chức Thánh.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Roles & Backups */}
        <div className="space-y-6">
          {/* Security & Roles */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1a365d]" />
              <span>Tài khoản Quản trị</span>
            </h3>

            <p className="text-[12px] text-[#74777f] leading-relaxed">
              Hệ thống chưa có đăng nhập/phân quyền thật — mọi người mở ứng dụng đều có toàn quyền chỉnh sửa.
              Danh sách dưới đây chỉ mang tính minh họa cho định hướng phân quyền trong tương lai.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#002045]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">Cha Giám đốc</p>
                    <p className="text-[11px] text-[#74777f]">Toàn quyền (Super Admin)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#d6e3ff] text-[#002045] rounded text-[11px] font-bold">
                  Kích hoạt
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#74777f]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">Ban Giám mục & Cố vấn</p>
                    <p className="text-[11px] text-[#74777f]">Xem học bạ & Nhận xét</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#e5e9eb] text-[#43474e] rounded text-[11px] font-bold">
                  Chưa triển khai
                </span>
              </div>
            </div>
          </div>

          {/* Database & Reset */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#1a365d]" />
              <span>Dữ liệu & Đồng bộ</span>
            </h3>

            {dbConnected ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#d6e3ff]/50 border border-[#86a0cd]">
                <CheckCircle2 className="w-4 h-4 text-[#002045] shrink-0" />
                <p className="text-[12px] text-[#001b3c] font-semibold leading-relaxed">
                  Đã kết nối Vercel Postgres — dữ liệu lưu trên server, dùng chung cho mọi thiết bị.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[12px] text-[#74777f] leading-relaxed">
                  Chưa kết nối cơ sở dữ liệu — dữ liệu chỉ lưu tạm trong trình duyệt này (localStorage),
                  không dùng chung được giữa các thiết bị. Xem README.md để kết nối Vercel Postgres.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Khôi phục lại dữ liệu mẫu ban đầu của Đại chủng viện?')) {
                      onResetData();
                      alert('Đã khôi phục dữ liệu ban đầu thành công!');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Khôi phục dữ liệu mặc định</span>
                </button>
              </>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-[#002045] hover:bg-[#1a365d] disabled:opacity-60 text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
