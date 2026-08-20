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
  UserCheck,
  Crown,
  Globe,
  SlidersHorizontal,
  Link2,
  Check,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppSettings, RectorProfile } from '../types';
import { api, getBaseApiUrl, setCustomApiUrl, DEFAULT_LIVE_URL } from '../lib/api';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void | Promise<void>;
  dbConnected: boolean;
  onResetData: () => void;
  rector: RectorProfile;
  onOpenRectorModal: () => void;
  onManualSync?: () => void;
  isSyncing?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  dbConnected,
  onResetData,
  rector,
  onOpenRectorModal,
  onManualSync,
  isSyncing,
}) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Live URL & Connectivity testing state
  const [targetApiUrl, setTargetApiUrl] = useState<string>(
    settings.apiUrl || getBaseApiUrl() || DEFAULT_LIVE_URL
  );
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    ok: boolean;
    latencyMs?: number;
    message?: string;
  }>({ tested: false, ok: false });
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setForm(settings);
    if (settings.apiUrl) {
      setTargetApiUrl(settings.apiUrl);
    }
  }, [settings]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await api.testConnection(targetApiUrl);
      setTestResult({
        tested: true,
        ok: res.ok,
        latencyMs: res.latencyMs,
        message: res.message,
      });
    } catch (err: any) {
      setTestResult({
        tested: true,
        ok: false,
        message: 'Lỗi khi kiểm tra: ' + (err?.message || 'Không thể kết nối'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleApplyApiUrl = (url: string) => {
    setTargetApiUrl(url);
    setCustomApiUrl(url);
    setForm(prev => ({ ...prev, apiUrl: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // persist custom API URL to localStorage & settings
      setCustomApiUrl(targetApiUrl);
      const updatedSettings: AppSettings = {
        ...form,
        apiUrl: targetApiUrl,
      };
      await onSaveSettings(updatedSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Cài đặt Hệ thống & Quản trị
          </h1>
          <p className="text-[14px] text-[#74777f] mt-1 font-normal">
            Cấu hình thông tin Đại chủng viện, phân quyền Cha Giám Đốc và liên kết trực tiếp website tự động update.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRectorModal}
          className="px-5 py-2.5 rounded-2xl bg-[#002045] hover:bg-[#1a365d] text-white text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Crown className="w-4 h-4 text-[#ffddba]" />
          <span>Mục Cha Giám Đốc (Super Admin)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-[14px] font-bold">
            Đã lưu thành công mọi thay đổi cấu hình hệ thống và liên kết trực tiếp!
          </span>
        </div>
      )}

      {/* SECTION 1: Cha Giám Đốc Profile Banner */}
      <div className="bg-gradient-to-br from-[#002045] via-[#002855] to-[#1a365d] text-white rounded-3xl p-6 shadow-md border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-radial from-[#ffddba]/15 to-transparent rounded-full pointer-events-none -mr-20 -mt-20 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={onOpenRectorModal}>
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-[#ffddba] shadow-xl bg-white/10 shrink-0">
                <img
                  src={rector.avatarUrl}
                  alt={rector.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffddba] text-[#002045] text-[11px] font-black uppercase flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin - Quyền cao nhất</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#adc7f7] text-[11px] font-medium border border-white/15">
                  {rector.diocese}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                {rector.saintName} {rector.fullName}
              </h2>
              <p className="text-[13px] text-[#adc7f7] font-medium">
                {rector.title}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[12px] text-white/80">
                <span>Email: <strong className="text-white">{rector.email}</strong></span>
                <span>•</span>
                <span>ĐT: <strong className="text-white">{rector.phone}</strong></span>
                <span>•</span>
                <span>Ký tên: <strong className="text-[#ffddba]">{rector.signatureText}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenRectorModal}
              className="px-5 py-2.5 rounded-xl bg-[#ffddba] hover:bg-[#ffe6cc] text-[#002045] font-bold text-[13px] shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Đổi hình, tên & quyền Cha Giám Đốc</span>
            </button>
            <p className="text-[11px] text-[#adc7f7] text-center md:text-right">
              Đầy đủ 10/10 module phân quyền tối cao
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Direct Integration & Seminary Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* SECTION 2: Liên kết trực tiếp & Tự động Update: https://quanlydubi.vercel.app */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#f1f4f6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#002045] text-white flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#adc7f7]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#002045]">
                    Liên Kết Trực Tiếp & Tự Động Cập Nhật
                  </h3>
                  <p className="text-[12px] text-[#74777f]">
                    Đồng bộ dữ liệu trực tiếp với trang web <span className="font-mono text-[#002045] font-bold">https://quanlydubi.vercel.app</span>
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto ${
                dbConnected 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{dbConnected ? 'Đã kết nối máy chủ' : 'Chế độ lưu cục bộ'}</span>
              </span>
            </div>

            {/* Target URL input */}
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1 flex items-center justify-between">
                  <span>Địa chỉ máy chủ kết nối (API URL / Web Endpoint)</span>
                  <span className="text-[11px] text-[#74777f] font-normal">Mặc định: https://quanlydubi.vercel.app</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777f]" />
                    <input
                      type="url"
                      value={targetApiUrl}
                      onChange={(e) => setTargetApiUrl(e.target.value)}
                      placeholder="https://quanlydubi.vercel.app"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[13.5px] font-mono text-[#002045] focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/10 outline-none font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-4 py-2.5 rounded-xl bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[#002045] font-bold text-[13px] flex items-center gap-1.5 border border-[#c4c6cf] transition-colors cursor-pointer shrink-0"
                  >
                    {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-600" />}
                    <span>{isTesting ? 'Đang test...' : 'Kiểm tra kết nối'}</span>
                  </button>
                </div>

                {/* Quick select presets */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11.5px] text-[#74777f]">Chọn nhanh:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyApiUrl('https://quanlydubi.vercel.app')}
                    className="px-2.5 py-1 rounded-lg bg-[#e8effd] hover:bg-[#d6e3ff] text-[11px] font-mono text-[#002045] font-bold transition-colors cursor-pointer"
                  >
                    https://quanlydubi.vercel.app (Chính thức)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyApiUrl(window.location.origin)}
                    className="px-2.5 py-1 rounded-lg bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[11px] font-mono text-[#43474e] transition-colors cursor-pointer"
                  >
                    {window.location.origin} (Cùng nguồn máy)
                  </button>
                </div>
              </div>

              {/* Test Result Message Box */}
              {testResult.tested && (
                <div className={`p-3.5 rounded-2xl border text-[13px] flex items-start gap-2.5 animate-in fade-in ${
                  testResult.ok 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  {testResult.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">
                      {testResult.ok ? 'Kết nối đến máy chủ thành công!' : 'Trạng thái kiểm tra kết nối:'}
                    </p>
                    <p className="text-[12px] opacity-90 mt-0.5">
                      {testResult.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Auto Sync & Interval Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Auto Sync Switch */}
                <div className="p-4 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5] flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">Tự động Cập nhật (Auto Sync)</p>
                    <p className="text-[11px] text-[#74777f]">Tự động đồng bộ với https://quanlydubi.vercel.app</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.autoSync ?? true}
                      onChange={(e) => setForm(f => ({ ...f, autoSync: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#c4c6cf] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002045]"></div>
                  </label>
                </div>

                {/* Interval selector */}
                <div className="p-4 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5] flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#002045]" />
                      <span>Chu kỳ cập nhật</span>
                    </p>
                    <p className="text-[11px] text-[#74777f]">Tần suất quét dữ liệu mới</p>
                  </div>
                  <select
                    value={form.syncIntervalSeconds ?? 30}
                    onChange={(e) => setForm(f => ({ ...f, syncIntervalSeconds: Number(e.target.value) }))}
                    className="px-3 py-1.5 rounded-xl border border-[#c4c6cf] bg-white text-[12px] font-bold text-[#002045] outline-none"
                  >
                    <option value={10}>10 giây</option>
                    <option value={30}>30 giây (Chuẩn)</option>
                    <option value={60}>1 phút</option>
                    <option value={300}>5 phút</option>
                  </select>
                </div>
              </div>

              {/* Manual sync action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-[12px] text-[#74777f]">
                  Lần đồng bộ gần nhất: <strong className="text-[#002045]">{form.lastSyncedAt || 'Vừa xong'}</strong>
                </p>

                <button
                  type="button"
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white text-[12.5px] font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Đang cập nhật...' : 'Cập nhật dữ liệu ngay'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seminary Details */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] space-y-5">
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
                  Cha Giám đốc đương nhiệm
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
                  Niên khóa đào tạo hiện tại
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
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#1a365d]" />
              <span>Chương trình & Khung đào tạo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[13px]">
              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Năm Dự Bị & Tu Đức (1-2 năm)</p>
                <p className="text-[#74777f] mt-0.5">Đặt nền tảng thiêng liêng, kỷ luật và phân định ơn gọi ban đầu.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Giai đoạn Triết học (2 năm)</p>
                <p className="text-[#74777f] mt-0.5">Huấn luyện tư duy logic, triết học Kitô giáo, nhân học và tiếng Latinh.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Năm Thực tập Mục vụ (1 năm)</p>
                <p className="text-[#74777f] mt-0.5">Trực tiếp dấn thân phục vụ giáo xứ, dạy giáo lý và sinh hoạt cộng đoàn.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f7fafc] border border-[#e0e3e5]">
                <p className="font-bold text-[#002045]">Giai đoạn Thần học (4 năm)</p>
                <p className="text-[#74777f] mt-0.5">Nghiên cứu Tín lý, Luân lý, Kinh Thánh và tiến tới Chức Thánh.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Roles, Backups & Save */}
        <div className="space-y-6">
          {/* Security & Roles */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1a365d]" />
              <span>Phân Quyền & Vai Trò</span>
            </h3>

            <div className="space-y-3">
              <div 
                onClick={onOpenRectorModal}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#e8effd] border border-[#adc7f7] cursor-pointer hover:bg-[#d6e3ff]/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#002045]/20 shrink-0">
                    <img src={rector.avatarUrl} alt={rector.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">{rector.saintName} {rector.fullName}</p>
                    <p className="text-[11px] text-emerald-800 font-bold">Toàn quyền cao nhất (Super Admin)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-black uppercase">
                  Tối cao
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5]">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#74777f]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">Ban Đào tạo & Giáo sư</p>
                    <p className="text-[11px] text-[#74777f]">Nhập điểm & Nhận xét môn học</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#e5e9eb] text-[#43474e] rounded text-[11px] font-bold">
                  Phân quyền
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#74777f]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#181c1e]">Quý Cha xứ Mục vụ hè</p>
                    <p className="text-[11px] text-[#74777f]">Gửi phiếu đánh giá thực tập hè</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#e5e9eb] text-[#43474e] rounded text-[11px] font-bold">
                  Biểu mẫu
                </span>
              </div>
            </div>
          </div>

          {/* Database & Reset */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] space-y-4">
            <h3 className="text-[17px] font-bold text-[#002045] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#1a365d]" />
              <span>Cơ sở Dữ liệu & Lưu trữ</span>
            </h3>

            <div className="p-4 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5] space-y-2 text-[12.5px] text-[#43474e]">
              <div className="flex items-center justify-between">
                <span>Trạng thái kết nối:</span>
                <strong className={dbConnected ? 'text-emerald-700' : 'text-amber-700'}>
                  {dbConnected ? 'Trực tuyến (Cloud)' : 'Bộ nhớ cục bộ (Local)'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Hệ quản trị:</span>
                <strong className="text-[#002045]">PostgreSQL / Vercel</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Tự động cập nhật:</span>
                <strong className="text-emerald-700">Đang bật (Mỗi 30s)</strong>
              </div>
            </div>

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
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-[#002045] hover:bg-[#1a365d] disabled:opacity-60 text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#ffddba]" />
            <span>{isSaving ? 'Đang lưu cài đặt...' : 'Lưu Cấu Hình & Liên Kết'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
