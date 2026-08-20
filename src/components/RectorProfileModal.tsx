import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Camera, 
  Upload, 
  ShieldCheck, 
  Check, 
  Save, 
  Sparkles, 
  Crown, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Key, 
  SlidersHorizontal,
  PenTool,
  Image as ImageIcon
} from 'lucide-react';
import { RectorProfile, RectorPermissions } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface RectorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  rector: RectorProfile;
  onSave: (updated: RectorProfile) => void;
}

// Preset ecclesiastical avatars
const PRESET_AVATARS = [
  {
    name: 'Mặc định (Linh mục áo chùng đen)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI-HJLLKFxOY8kIHFjYQvSGaa3K3VisUaN-7LgtEFHvR9kBoOFQpkW0AJjBDb9lo0eIEzv28Z-zbvQViXvS9dn50NvHQ1_Tel0uN60yUf5zzq62FNDD4aP0Cf9W3gjbSOXuqj717gQ4fZl_dYHz8icxY36VQMbjPWzmSEFEXpouOFGz11TzpjCA3nKTOJMl3l7BZraV_Y6WKhkvtBQlMvkrJkN7ILyZa178cxG-HWWVujgmqas6Mzv',
  },
  {
    name: 'Chân dung Cha Giám đốc trang trọng 1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chân dung Cha Giám đốc trang trọng 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chân dung Cha Giám đốc trang trọng 3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chân dung Cha Giám đốc trang trọng 4',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
  },
];

const SAINT_NAME_SUGGESTIONS = [
  'Giuse',
  'Phêrô',
  'Phaolô',
  'Đaminh',
  'Gioan Baotixita',
  'Augustinô',
  'Phanxicô Xaviê',
  'Tôma',
  'Inhaxiô',
  'Anrê',
  'Micae',
  'Vinh Sơn'
];

const TITLE_SUGGESTIONS = [
  'Linh mục Giám đốc Đại Chủng Viện',
  'Đức Cha Giám đốc Đại Chủng Viện',
  'Cha Tổng Đại diện kiêm Giám đốc ĐCV',
  'Linh mục Trưởng Ban Đào Tạo & Giám Đốc',
  'Đức Viện Phụ Giám Đốc',
];

export const RectorProfileModal: React.FC<RectorProfileModalProps> = ({
  isOpen,
  onClose,
  rector,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'avatar' | 'permissions' | 'signature'>('profile');
  
  // Profile State
  const [saintName, setSaintName] = useState(rector.saintName);
  const [fullName, setFullName] = useState(rector.fullName);
  const [title, setTitle] = useState(rector.title);
  const [avatarUrl, setAvatarUrl] = useState(rector.avatarUrl);
  const [email, setEmail] = useState(rector.email);
  const [phone, setPhone] = useState(rector.phone);
  const [diocese, setDiocese] = useState(rector.diocese);
  const [appointedDate, setAppointedDate] = useState(rector.appointedDate || '01/09/2020');
  const [roleTitle, setRoleTitle] = useState(rector.roleTitle || 'Toàn quyền Quản trị cao nhất (Super Administrator)');
  const [signatureText, setSignatureText] = useState(rector.signatureText || `Lm. ${rector.saintName} ${rector.fullName}`);
  
  // Permissions State
  const [permissions, setPermissions] = useState<RectorPermissions>(rector.permissions || {
    superAdmin: true,
    approveSeminarians: true,
    manageEvaluations: true,
    editRecords: true,
    academicManagement: true,
    pastoralAssignment: true,
    systemSettings: true,
    databaseMaster: true,
    securityAudit: true,
    signOfficialDocuments: true,
  });

  // Modal Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePermission = (key: keyof RectorPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGrantAllPermissions = () => {
    setPermissions({
      superAdmin: true,
      approveSeminarians: true,
      manageEvaluations: true,
      editRecords: true,
      academicManagement: true,
      pastoralAssignment: true,
      systemSettings: true,
      databaseMaster: true,
      securityAudit: true,
      signOfficialDocuments: true,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RectorProfile = {
      saintName: saintName.trim(),
      fullName: fullName.trim(),
      title: title.trim(),
      avatarUrl: avatarUrl,
      email: email.trim(),
      phone: phone.trim(),
      diocese: diocese.trim(),
      appointedDate: appointedDate.trim(),
      roleTitle: roleTitle.trim(),
      signatureText: signatureText.trim(),
      permissions: permissions,
    };

    onSave(updated);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#f1f4f6] rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-[#c4c6cf] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#002045] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffddba]/20 text-[#ffddba] border border-[#ffddba]/30 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[17px] sm:text-[19px] text-white">
                  Mục Cha Giám Đốc & Quyền Quản Trị
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ffddba] text-[#002045] text-[11px] font-black uppercase flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </span>
              </div>
              <p className="text-[12px] text-[#adc7f7]">
                Tùy chỉnh hình ảnh, tên thánh, họ tên và phân quyền truy cập cao nhất của Cha Giám đốc
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-white border-b border-[#e0e3e5] flex gap-2 overflow-x-auto text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#002045] text-[#002045]'
                : 'border-transparent text-[#74777f] hover:text-[#002045]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Thông tin & Chức danh</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'avatar'
                ? 'border-[#002045] text-[#002045]'
                : 'border-transparent text-[#74777f] hover:text-[#002045]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Đổi hình ảnh đại diện</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'border-[#002045] text-[#002045]'
                : 'border-transparent text-[#74777f] hover:text-[#002045]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Quyền truy cập cao nhất</span>
          </button>

          <button
            onClick={() => setActiveTab('signature')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'signature'
                ? 'border-[#002045] text-[#002045]'
                : 'border-transparent text-[#74777f] hover:text-[#002045]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Ký tên & Văn bản</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Preview Card */}
          <div className="bg-gradient-to-r from-[#002045] to-[#1a365d] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm border border-white/10">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('avatar')}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-[#ffddba] shadow-md bg-white/10 shrink-0">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ffddba]/20 text-[#ffddba] border border-[#ffddba]/30 text-[11px] font-bold">
                  {title}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Quyền tối cao 100%</span>
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {saintName} {fullName}
              </h4>
              <p className="text-[13px] text-[#adc7f7]">
                {diocese} • Đại Chủng Viện Thánh Giuse
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[12px] text-white/80">
                <span>Email: <strong>{email}</strong></span>
                <span>ĐT: <strong>{phone}</strong></span>
              </div>
            </div>
          </div>

          {/* TAB 1: Profile & Name */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f4f6]">
                <h4 className="font-bold text-[15px] text-[#002045] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#002045]" />
                  <span>Thông tin Cha Giám đốc</span>
                </h4>
                <span className="text-[12px] text-[#74777f]">Hiển thị tại tất cả các báo cáo và giao diện</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Saint Name */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Tên Thánh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={saintName}
                    onChange={(e) => setSaintName(e.target.value)}
                    placeholder="Ví dụ: Giuse, Phêrô, Gioan B."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/10 outline-none"
                  />
                  {/* Saint Name suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SAINT_NAME_SUGGESTIONS.slice(0, 6).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSaintName(s)}
                        className="px-2 py-0.5 rounded-md bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[11px] text-[#43474e] font-medium transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Tuấn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/10 outline-none font-bold"
                  />
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Chức danh / Tước vị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Linh mục Giám đốc Đại Chủng Viện"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] focus:ring-2 focus:ring-[#002045]/10 outline-none"
                  />
                  {/* Title suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {TITLE_SUGGESTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTitle(t)}
                        className="px-2.5 py-1 rounded-lg bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[11px] text-[#002045] font-medium transition-colors cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diocese */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Giáo phận phụ trách
                  </label>
                  <input
                    type="text"
                    value={diocese}
                    onChange={(e) => setDiocese(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                  />
                </div>

                {/* Appointed Date */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Ngày bổ nhiệm / Nhậm chức
                  </label>
                  <input
                    type="text"
                    value={appointedDate}
                    onChange={(e) => setAppointedDate(e.target.value)}
                    placeholder="01/09/2020"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Email quản trị
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                    Số điện thoại liên lạc
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Avatar & Photo */}
          {activeTab === 'avatar' && (
            <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f4f6]">
                <h4 className="font-bold text-[15px] text-[#002045] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#002045]" />
                  <span>Thay đổi hình ảnh đại diện của Cha Giám đốc</span>
                </h4>
              </div>

              {/* Action buttons to change photo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-[#002045]/40 hover:border-[#002045] hover:bg-[#e8effd] flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#002045] text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Tải ảnh từ máy tính</p>
                    <p className="text-[11px] text-[#74777f]">JPG, PNG, WEBP</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-600 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-emerald-800">Chụp ảnh trực tiếp</p>
                    <p className="text-[11px] text-[#74777f]">Qua Webcam / Camera máy</p>
                  </div>
                </button>

                <div className="p-4 rounded-2xl bg-[#f7fafc] border border-[#e0e3e5] flex flex-col justify-center gap-2">
                  <label className="text-[12px] font-bold text-[#181c1e]">Dán liên kết ảnh (URL):</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg border border-[#c4c6cf] text-[12px] text-[#181c1e] focus:border-[#002045] outline-none"
                  />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Preset avatars selection */}
              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-2.5 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#002045]" />
                  <span>Hoặc chọn từ bộ sưu tập ảnh chân dung mẫu:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        avatarUrl === preset.url
                          ? 'border-[#002045] bg-[#d6e3ff]/40 ring-2 ring-[#002045]'
                          : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-[#c4c6cf] shadow-xs">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#181c1e] line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Permissions & Super Admin */}
          {activeTab === 'permissions' && (
            <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f4f6]">
                <div>
                  <h4 className="font-bold text-[15px] text-[#002045] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Quyền Truy Cập Cao Nhất (Super Administrator)</span>
                  </h4>
                  <p className="text-[12px] text-[#74777f]">
                    Cha Giám Đốc sở hữu toàn quyền quản trị cao nhất đối với mọi dữ liệu trong hệ thống
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGrantAllPermissions}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kích hoạt trọn bộ quyền cao nhất</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Super Admin */}
                <div 
                  onClick={() => handleTogglePermission('superAdmin')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.superAdmin
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.superAdmin}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Toàn quyền Quản trị Tối cao (Super Admin)</p>
                    <p className="text-[11.5px] text-[#535f70]">Cấp độ bảo mật cao nhất, miễn trừ mọi giới hạn kiểm duyệt.</p>
                  </div>
                </div>

                {/* 2. Approve Seminarians */}
                <div 
                  onClick={() => handleTogglePermission('approveSeminarians')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.approveSeminarians
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.approveSeminarians}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Phê duyệt Tuyển sinh & Tiến cử Chức Thánh</p>
                    <p className="text-[11.5px] text-[#535f70]">Quyết nghị tiếp nhận, chuyển lớp, cử đi mục vụ và đề bạt chức Phó tế, Linh mục.</p>
                  </div>
                </div>

                {/* 3. Manage Evaluations */}
                <div 
                  onClick={() => handleTogglePermission('manageEvaluations')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.manageEvaluations
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.manageEvaluations}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Phê chuẩn Đánh giá 4 Chiều kích & Bảng điểm</p>
                    <p className="text-[11.5px] text-[#535f70]">Xem và chuẩn y đánh giá Thiêng liêng, Nhân bản, Tri thức, Mục vụ của các Cha xứ.</p>
                  </div>
                </div>

                {/* 4. Edit Records */}
                <div 
                  onClick={() => handleTogglePermission('editRecords')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.editRecords
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.editRecords}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Toàn quyền Tạo, Chỉnh sửa & Xóa Hồ sơ</p>
                    <p className="text-[11.5px] text-[#535f70]">Không bị giới hạn quyền truy xuất hoặc chỉnh sửa thông tin cá nhân chủng sinh.</p>
                  </div>
                </div>

                {/* 5. Academic Management */}
                <div 
                  onClick={() => handleTogglePermission('academicManagement')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.academicManagement
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.academicManagement}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Quản lý Môn học & Phân công Giáo sư</p>
                    <p className="text-[11.5px] text-[#535f70]">Chỉ định linh mục linh hướng, giáo sư giảng dạy và thời khóa biểu.</p>
                  </div>
                </div>

                {/* 6. Pastoral Assignment */}
                <div 
                  onClick={() => handleTogglePermission('pastoralAssignment')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.pastoralAssignment
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.pastoralAssignment}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Phân bổ Thực tập Mục vụ & Giáo xứ hè</p>
                    <p className="text-[11.5px] text-[#535f70]">Bổ nhiệm địa bàn thực tập giáo xứ và gửi thông tri đến quý Cha xứ.</p>
                  </div>
                </div>

                {/* 7. Sign Official Documents */}
                <div 
                  onClick={() => handleTogglePermission('signOfficialDocuments')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.signOfficialDocuments
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.signOfficialDocuments}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Ký số & Đóng dấu Hồ sơ A4, Word, PDF</p>
                    <p className="text-[11.5px] text-[#535f70]">Tên và chức danh tự động gắn vào văn thư xuất bản chính thức.</p>
                  </div>
                </div>

                {/* 8. Database Master */}
                <div 
                  onClick={() => handleTogglePermission('databaseMaster')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    permissions.databaseMaster
                      ? 'border-[#002045] bg-[#e8effd]'
                      : 'border-[#e0e3e5] hover:bg-[#f7fafc]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.databaseMaster}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-[#002045] focus:ring-[#002045]"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#002045]">Quản trị Cơ sở Dữ liệu & Sao lưu</p>
                    <p className="text-[11.5px] text-[#535f70]">Xuất trích xuất toàn bộ dữ liệu, mã hóa và phục hồi hệ thống.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Signature & Letterhead */}
          {activeTab === 'signature' && (
            <div className="bg-white rounded-2xl p-5 border border-[#e0e3e5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f4f6]">
                <h4 className="font-bold text-[15px] text-[#002045] flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#002045]" />
                  <span>Ký tên & Bút tích Phê duyệt trên Văn bản A4/Word</span>
                </h4>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#181c1e] mb-1">
                  Dòng chữ ký hiển thị dưới con dấu Đại Chủng Viện
                </label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Ví dụ: Lm. Giuse Nguyễn Văn Tuấn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[14px] text-[#181c1e] focus:border-[#002045] outline-none font-bold"
                />
              </div>

              {/* Signature Preview Box */}
              <div className="p-6 bg-[#fafafa] border-2 border-dashed border-[#c4c6cf] rounded-2xl text-center space-y-2">
                <p className="text-[12px] text-[#74777f] uppercase tracking-wider font-bold">
                  Mô phỏng chữ ký cuối văn thư hồ sơ chủng sinh
                </p>
                <div className="h-16 flex items-center justify-center">
                  <span className="font-serif italic text-2xl text-[#002045] underline decoration-[#002045]/40 font-bold">
                    {signatureText}
                  </span>
                </div>
                <p className="text-[13px] font-bold text-[#002045] uppercase">
                  {title}
                </p>
                <p className="text-[11px] text-[#74777f]">
                  (Đã xác thực chữ ký điện tử chuẩn Giáo phận)
                </p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSavedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-[14px] font-bold">
                Đã lưu thành công thông tin và phân quyền cao nhất của Cha Giám Đốc!
              </span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#e0e3e5] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white text-[13px] font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#ffddba]" />
              <span>Lưu Thông Tin Cha Giám Đốc</span>
            </button>
          </div>
        </form>
      </div>

      {/* Camera Capture Modal for Direct Photo */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(photoUrl) => {
          setAvatarUrl(photoUrl);
          setIsCameraOpen(false);
        }}
      />
    </div>
  );
};
