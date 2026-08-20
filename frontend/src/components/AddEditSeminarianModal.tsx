import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  UserCheck, 
  Save, 
  Calendar, 
  User, 
  Church, 
  Users, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Home,
  Sun,
  Award,
  MessageSquare,
  Image as ImageIcon,
  Camera,
  Upload,
  Plus,
  Trash2,
  School,
  Layers,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { Seminarian, Stage, Status, PriorEducationItem, AcademicYearRecord } from '../types';
import { createDefaultAnnualRecords } from '../mockData';
import { CameraCaptureModal } from './CameraCaptureModal';

// Helper functions for date conversions
const convertVnDateToIso = (vnDate: string): string => {
  if (!vnDate) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(vnDate)) return vnDate;
  const parts = vnDate.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    if (y.length === 4) {
      return `${y}-${m}-${d}`;
    }
  }
  return '';
};

const convertIsoToVnDate = (isoDate: string): string => {
  if (!isoDate) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  }
  return isoDate;
};

// Reusable date field component with calendar button and direct manual typing
const DateInputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder = 'DD/MM/YYYY', required = false }) => {
  const pickerRef = useRef<HTMLInputElement>(null);
  const isoVal = convertVnDateToIso(value);

  const handleOpenPicker = () => {
    if (pickerRef.current) {
      try {
        if (typeof pickerRef.current.showPicker === 'function') {
          pickerRef.current.showPicker();
        } else {
          pickerRef.current.focus();
          pickerRef.current.click();
        }
      } catch {
        pickerRef.current.focus();
        pickerRef.current.click();
      }
    }
  };

  return (
    <div>
      <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] focus:ring-1 focus:ring-[#002045] outline-none font-medium bg-white text-[#181c1e]"
        />
        <button
          type="button"
          onClick={handleOpenPicker}
          className="px-3 py-2 rounded-xl border border-[#c4c6cf] bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[#002045] transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
          title="Bấm để mở lịch chọn ngày"
        >
          <Calendar className="w-4 h-4 text-[#002045]" />
        </button>
        {/* Native Date Input for trigger */}
        <input
          ref={pickerRef}
          type="date"
          value={isoVal}
          onChange={(e) => {
            if (e.target.value) {
              onChange(convertIsoToVnDate(e.target.value));
            }
          }}
          className="sr-only"
        />
      </div>
    </div>
  );
};

interface AddEditSeminarianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seminarian: Seminarian) => void;
  editingSeminarian?: Seminarian | null;
}

export const AddEditSeminarianModal: React.FC<AddEditSeminarianModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSeminarian,
}) => {
  // Tab state: 1: Cơ bản, 2: Bí tích & Liên lạc, 3: Gia đình, 4: Học vấn & Hội đoàn, 5: Đánh giá
  const [activeTab, setActiveTab] = useState<number>(1);

  // Tab 1: Cơ bản & Giáo phận
  const [fullName, setFullName] = useState('');
  const [saintName, setSaintName] = useState('Giuse');
  const [code, setCode] = useState('');
  const [batch, setBatch] = useState('Khóa 22');
  const [academicYear, setAcademicYear] = useState('Khóa 22 (2022-2030)');
  const [admissionYear, setAdmissionYear] = useState('2022');
  const [graduationYear, setGraduationYear] = useState('2030');
  const [diocese, setDiocese] = useState('Hà Nội');
  const [homeParish, setHomeParish] = useState('');
  const [admissionParish, setAdmissionParish] = useState('');
  const [stage, setStage] = useState<Stage>('Dự bị 1');
  const [status, setStatus] = useState<Status>('Đang học');
  // Avatar State & File Upload / Camera
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tab 2: Liên lạc & Bí tích
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gmail, setGmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [baptismDate, setBaptismDate] = useState('');
  const [baptismParish, setBaptismParish] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [confirmationBishop, setConfirmationBishop] = useState('');

  // Tab 3: Gia đình
  const [fatherName, setFatherName] = useState('');
  const [fatherBirth, setFatherBirth] = useState('');
  const [fatherJob, setFatherJob] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherBirth, setMotherBirth] = useState('');
  const [motherJob, setMotherJob] = useState('');
  const [familyAddress, setFamilyAddress] = useState('');
  const [siblingsCount, setSiblingsCount] = useState<number>(3);
  const [birthOrder, setBirthOrder] = useState('');
  const [familyNotes, setFamilyNotes] = useState('');

  // Tab 4: Học vấn & Hội đoàn (Hỗ trợ 2, 3 trường ĐH/CĐ/TC)
  const [priorEducationList, setPriorEducationList] = useState<PriorEducationItem[]>([
    {
      id: 'edu-1',
      degreeType: 'Đại học',
      institution: '',
      major: '',
      startYear: '',
      gradYear: '',
      ranking: 'Giỏi',
      notes: '',
    }
  ]);
  const [associations, setAssociations] = useState<string[]>([]);
  const [customAssociation, setCustomAssociation] = useState('');

  const handleAddEducation = () => {
    const newId = `edu-${Date.now()}`;
    setPriorEducationList([
      ...priorEducationList,
      {
        id: newId,
        degreeType: 'Đại học',
        institution: '',
        major: '',
        startYear: '',
        gradYear: '',
        ranking: 'Khá',
        notes: '',
      }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    if (priorEducationList.length <= 1) {
      setPriorEducationList([{
        id: 'edu-1',
        degreeType: 'Đại học',
        institution: '',
        major: '',
        startYear: '',
        gradYear: '',
        ranking: '',
        notes: '',
      }]);
      return;
    }
    setPriorEducationList(priorEducationList.filter((_, idx) => idx !== index));
  };

  const handleUpdateEducation = (index: number, field: keyof PriorEducationItem, value: string) => {
    const nextList = [...priorEducationList];
    nextList[index] = {
      ...nextList[index],
      [field]: value,
    };
    setPriorEducationList(nextList);
  };

  // Tab 5: Đánh giá Huấn luyện đa năm (Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết...)
  const [annualRecordsList, setAnnualRecordsList] = useState<AcademicYearRecord[]>([]);
  const [selectedEvalYearId, setSelectedEvalYearId] = useState<string>('du-bi-1');
  const [advisorNote, setAdvisorNote] = useState('');

  // Helper to get active year record for evaluation
  const activeEvalRecord = annualRecordsList.find(r => r.yearId === selectedEvalYearId) || annualRecordsList[0];

  const updateActiveEvalRecord = (updater: (rec: AcademicYearRecord) => AcademicYearRecord) => {
    setAnnualRecordsList(prev => prev.map(rec => {
      if (rec.yearId === (activeEvalRecord?.yearId || selectedEvalYearId)) {
        return updater(rec);
      }
      return rec;
    }));
  };

  const commonAssociations = [
    'Ban Giúp lễ', 
    'Huynh trưởng TNTT', 
    'Giáo lý viên', 
    'Ca đoàn', 
    'Ban Phụng vụ', 
    'Ban Bác ái / Caritas', 
    'Ban Truyền thông',
    'Legio Mariae'
  ];

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
  ];

  const toggleAssociation = (item: string) => {
    if (associations.includes(item)) {
      setAssociations(associations.filter(a => a !== item));
    } else {
      setAssociations([...associations, item]);
    }
  };

  const addCustomAssociation = () => {
    if (customAssociation.trim() && !associations.includes(customAssociation.trim())) {
      setAssociations([...associations, customAssociation.trim()]);
      setCustomAssociation('');
    }
  };

  // Populate or reset form whenever modal opens or editingSeminarian changes
  useEffect(() => {
    if (!isOpen) return;

    setActiveTab(1);

    if (editingSeminarian) {
      // Load all fields from existing seminarian
      setFullName(editingSeminarian.fullName || '');
      setSaintName(editingSeminarian.saintName || 'Giuse');
      setCode(editingSeminarian.code || '');
      setBatch(editingSeminarian.batch || 'Khóa 21');
      setAcademicYear(editingSeminarian.academicYear || `${editingSeminarian.batch} (2021-2029)`);
      setAdmissionYear(
        editingSeminarian.admissionYear || 
        editingSeminarian.seminaryAdmissionYear || 
        editingSeminarian.academicYear?.match(/\b(\d{4})\s*[-–]/)?.[1] || 
        '2021'
      );
      setGraduationYear(
        editingSeminarian.graduationYear || 
        editingSeminarian.seminaryGraduationYear || 
        editingSeminarian.academicYear?.match(/[-–]\s*(\d{4})\b/)?.[1] || 
        '2029'
      );
      setDiocese(editingSeminarian.diocese || 'Hà Nội');
      setHomeParish(editingSeminarian.homeParish || editingSeminarian.parish || '');
      setAdmissionParish(editingSeminarian.admissionParish || editingSeminarian.parish || '');
      setStage(editingSeminarian.stage || 'Triết II');
      setStatus(editingSeminarian.status || 'Đang học');
      setAvatarUrl(editingSeminarian.avatarUrl || '');

      setPhone(editingSeminarian.phone || '');
      setEmail(editingSeminarian.email || '');
      setGmail(editingSeminarian.gmail || '');
      setBirthDate(editingSeminarian.birthDate || '');
      setBirthPlace(editingSeminarian.birthPlace || '');
      setBaptismDate(editingSeminarian.baptismDate || '');
      setBaptismParish(editingSeminarian.baptismParish || '');
      setConfirmationDate(editingSeminarian.confirmationDate || '');
      setConfirmationBishop(editingSeminarian.confirmationBishop || '');

      setFatherName(editingSeminarian.familyInfo?.fatherName || '');
      setFatherBirth(editingSeminarian.familyInfo?.fatherBirth || '');
      setFatherJob(editingSeminarian.familyInfo?.fatherJob || '');
      setMotherName(editingSeminarian.familyInfo?.motherName || '');
      setMotherBirth(editingSeminarian.familyInfo?.motherBirth || '');
      setMotherJob(editingSeminarian.familyInfo?.motherJob || '');
      setFamilyAddress(editingSeminarian.familyInfo?.familyAddress || editingSeminarian.homeParish || '');
      setSiblingsCount(editingSeminarian.siblingsCount ?? (editingSeminarian.familyInfo?.siblingsCount ?? 3));
      setBirthOrder(editingSeminarian.birthOrder || '');
      setFamilyNotes(editingSeminarian.familyNotes || editingSeminarian.familyInfo?.notes || '');

      // Load Prior Education List (support multiple universities / colleges)
      if (editingSeminarian.priorEducationList && editingSeminarian.priorEducationList.length > 0) {
        setPriorEducationList(editingSeminarian.priorEducationList);
      } else if (editingSeminarian.priorEducation && editingSeminarian.priorEducation.institution) {
        setPriorEducationList([{
          id: 'edu-1',
          degreeType: 'Đại học',
          institution: editingSeminarian.priorEducation.institution,
          major: editingSeminarian.priorEducation.major,
          startYear: editingSeminarian.priorEducation.startYear || '2016',
          gradYear: editingSeminarian.priorEducation.gradYear || '2020',
          ranking: 'Giỏi',
          notes: 'Đã hoàn thành chương trình đào tạo',
        }]);
      } else {
        setPriorEducationList([{
          id: 'edu-1',
          degreeType: 'Đại học',
          institution: '',
          major: '',
          startYear: '',
          gradYear: '',
          ranking: 'Giỏi',
          notes: '',
        }]);
      }

      setAssociations(editingSeminarian.associations || ['Ban Giúp lễ', 'Giáo lý viên']);

      // Load annual records (Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết...)
      const defaultRecords = createDefaultAnnualRecords(
        editingSeminarian.fullName,
        editingSeminarian.homeParish || editingSeminarian.parish
      );
      const existingRecords = editingSeminarian.annualRecords && editingSeminarian.annualRecords.length > 0
        ? editingSeminarian.annualRecords
        : defaultRecords;
      setAnnualRecordsList(existingRecords);
      setSelectedEvalYearId(existingRecords[0]?.yearId || 'du-bi-1');

      setAdvisorNote(editingSeminarian.advisorNote || '');
    } else {
      // Clean reset for adding new seminarian
      const randomNum = Math.floor(100 + Math.random() * 900);
      setCode(`CS-2024-${randomNum}`);
      setFullName('');
      setSaintName('Giuse');
      setBatch('Khóa 22');
      setAdmissionYear('2022');
      setGraduationYear('2030');
      setAcademicYear('Khóa 22 (2022-2030)');
      setDiocese('Hà Nội');
      setHomeParish('');
      setAdmissionParish('');
      setStage('Dự bị 1');
      setStatus('Đang học');
      setAvatarUrl('');

      setPhone('');
      setEmail('');
      setGmail('');
      setBirthDate('');
      setBirthPlace('');
      setBaptismDate('');
      setBaptismParish('');
      setConfirmationDate('');
      setConfirmationBishop('');

      setFatherName('');
      setFatherBirth('');
      setFatherJob('');
      setMotherName('');
      setMotherBirth('');
      setMotherJob('');
      setFamilyAddress('');
      setSiblingsCount(3);
      setBirthOrder('Con thứ 2 trong gia đình');
      setFamilyNotes('');

      setPriorEducationList([
        {
          id: 'edu-1',
          degreeType: 'Đại học',
          institution: '',
          major: '',
          startYear: '',
          gradYear: '',
          ranking: 'Giỏi',
          notes: '',
        }
      ]);
      setAssociations(['Ban Giúp lễ', 'Giáo lý viên']);

      const defaultNewRecords = createDefaultAnnualRecords('Chủng sinh Mới', 'Giáo xứ');
      setAnnualRecordsList(defaultNewRecords);
      setSelectedEvalYearId('du-bi-1');

      setAdvisorNote('Chủng sinh có tinh thần đạo đức, khiêm tốn và chuyên cần trong học tập.');
    }
  }, [editingSeminarian, isOpen]);

  // Quick fill sample data helper
  const handleQuickFillSample = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setCode(`CS-2024-${randomNum}`);
    setFullName('Phanxicô Xaviê Trần Văn Đức');
    setSaintName('Phanxicô Xaviê');
    setBatch('Khóa 22');
    setAdmissionYear('2022');
    setGraduationYear('2030');
    setAcademicYear('Khóa 22 (2022-2030)');
    setDiocese('Hà Nội');
    setHomeParish('Giáo xứ Phủ Lý');
    setAdmissionParish('Giáo xứ Chính Tòa Hà Nội');
    setStage('Dự bị 1');
    setStatus('Đang học');
    setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300');

    setPhone('0982 123 456');
    setEmail('duc.tran@dcvhn.edu.vn');
    setGmail('duc.tran.seminary@gmail.com');
    setBirthDate('18/06/2000');
    setBirthPlace('Hà Nam');
    setBaptismDate('25/06/2000');
    setBaptismParish('Giáo xứ Phủ Lý');
    setConfirmationDate('15/08/2012');
    setConfirmationBishop('Đức Cha Giuse Vũ Văn Thiên');

    setFatherName('Giuse Trần Văn Tuấn');
    setFatherBirth('1972');
    setFatherJob('Giáo viên & Ban Hành giáo');
    setMotherName('Maria Nguyễn Thị Mai');
    setMotherBirth('1975');
    setMotherJob('Kinh doanh');
    setFamilyAddress('Giáo xứ Phủ Lý, TGP Hà Nội');
    setSiblingsCount(3);
    setBirthOrder('Con thứ 2 trong gia đình');
    setFamilyNotes('Gia đình Công giáo nề nếp, truyền thống đạo đức nhiều đời.');

    setPriorEducationList([
      {
        id: 'edu-1',
        degreeType: 'Đại học',
        institution: 'Đại học Sư phạm Hà Nội',
        major: 'Sư phạm Tiếng Anh',
        startYear: '2018',
        gradYear: '2022',
        ranking: 'Giỏi',
        notes: 'Bằng Cử nhân Sư phạm loại Giỏi, IELTS 7.5',
      },
      {
        id: 'edu-2',
        degreeType: 'Cao đẳng',
        institution: 'Cao đẳng Nghệ thuật Hà Nội',
        major: 'Âm nhạc & Chỉ huy Ca đoàn',
        startYear: '2019',
        gradYear: '2021',
        ranking: 'Xuất sắc',
        notes: 'Chuyên ban Thánh nhạc và đệm đàn phụng vụ',
      }
    ]);
    setAssociations(['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên', 'Ca đoàn']);

    const sampleRecords = createDefaultAnnualRecords('Phanxicô Xaviê Trần Văn Đức', 'Giáo xứ Phủ Lý');
    setAnnualRecordsList(sampleRecords);
    setSelectedEvalYearId('du-bi-1');

    setAdvisorNote('Chủng sinh có đời sống cầu nguyện sâu sắc, tính tình hiền hòa, hòa đồng với cộng đoàn.');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setActiveTab(1);
      alert('Vui lòng nhập Họ và tên Chủng sinh (ở Mục 1. Thông tin Cơ bản)');
      return;
    }

    const initialRecords = annualRecordsList.length > 0 
      ? annualRecordsList 
      : (editingSeminarian?.annualRecords || createDefaultAnnualRecords(fullName, homeParish || admissionParish || 'Giáo xứ'));

    const firstEdu = priorEducationList[0] || {
      institution: 'Đại học',
      major: 'Đại cương',
      startYear: '2018',
      gradYear: '2022',
    };

    const savedData: Seminarian = {
      id: editingSeminarian ? editingSeminarian.id : `sem-${Date.now()}`,
      code: code || `CS-2024-${Math.floor(100 + Math.random() * 900)}`,
      saintName: saintName.trim() || 'Giuse',
      fullName: fullName.trim(),
      batch: batch.trim() || 'Khóa 22',
      academicYear: academicYear || `${batch} (${admissionYear || '2022'}-${graduationYear || '2030'})`,
      admissionYear: admissionYear || '2022',
      graduationYear: graduationYear || '2030',
      seminaryAdmissionYear: admissionYear || '2022',
      seminaryGraduationYear: graduationYear || '2030',
      diocese: diocese.trim() || 'Hà Nội',
      parish: homeParish || admissionParish || 'Giáo xứ Chính Tòa',
      homeParish: homeParish || 'Giáo xứ quê hương',
      admissionParish: admissionParish || homeParish || 'Giáo xứ nhập',
      stage: stage || 'Dự bị 1',
      status: status || 'Đang học',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      birthDate: birthDate || '01/01/2000',
      birthPlace: birthPlace || 'Việt Nam',
      phone: phone || '0900 000 000',
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@dcv.edu.vn`,
      gmail: gmail || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      baptismDate: baptismDate || '01/01/2000',
      baptismParish: baptismParish || homeParish || 'Giáo xứ quê hương',
      confirmationDate: confirmationDate || '01/01/2012',
      confirmationBishop: confirmationBishop || 'Đức Giám Mục Giáo Phận',
      priorEducation: {
        institution: firstEdu.institution || 'Đại học',
        major: firstEdu.major || 'Đại cương',
        startYear: firstEdu.startYear || '2018',
        gradYear: firstEdu.gradYear || '2022',
      },
      priorEducationList: priorEducationList.filter(e => e.institution.trim() || e.major.trim()),
      associations: associations.length > 0 ? associations : ['Ban Giúp lễ'],
      siblingsCount: Number(siblingsCount) || 1,
      birthOrder: birthOrder || 'Con thứ trong gia đình',
      familyNotes: familyNotes || 'Gia đình truyền thống Công giáo đạo đức.',
      familyInfo: {
        fatherName: fatherName || 'Giuse (Thân phụ)',
        fatherBirth: fatherBirth || '1970',
        fatherJob: fatherJob || 'Lao động / Kinh doanh',
        motherName: motherName || 'Maria (Thân mẫu)',
        motherBirth: motherBirth || '1973',
        motherJob: motherJob || 'Nội trợ',
        siblingsCount: Number(siblingsCount) || 1,
        notes: familyNotes || 'Gia đình đạo đức',
        familyAddress: familyAddress || homeParish || 'Giáo phận',
      },
      timeline: editingSeminarian?.timeline || [
        { year: 'Dự kiến 2030', title: 'Linh mục', status: 'future' },
        { year: 'Hiện tại', title: `Đang tu học ${stage}`, status: 'current' },
        { year: '05/09/2023', title: 'Nhập học Đại chủng viện', status: 'completed' },
      ],
      grades: editingSeminarian?.grades || {
        philosophy: 8.5,
        theology: 8.6,
        scripture: 8.8,
        latin: 8.0,
        liturgy: 8.7,
        gpa: 8.5,
      },
      annualRecords: initialRecords,
      hasAdvisorReview: true,
      advisorNote: advisorNote || 'Chủng sinh có tinh thần đạo đức và học tập chuyên cần.',
    };

    onSave(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-4 shadow-2xl border border-[#e0e3e5] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#002045] flex items-center justify-center text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-[#002045] leading-tight">
                {editingSeminarian ? 'Chỉnh sửa Hồ sơ Chủng sinh' : 'Thêm Chủng sinh Mới'}
              </h3>
              <p className="text-[12px] text-[#535f70]">
                {editingSeminarian ? editingSeminarian.fullName : 'Điền đầy đủ thông tin hoặc bấm Nạp mẫu để nhập nhanh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingSeminarian && (
              <button
                type="button"
                onClick={handleQuickFillSample}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8effd] hover:bg-[#d4e3fc] text-[#002045] font-bold text-[12px] rounded-xl border border-[#002045]/20 transition-colors cursor-pointer"
                title="Tự động điền dữ liệu mẫu thực tế"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#002045]" />
                <span>Nạp dữ liệu mẫu</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#74777f] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 bg-[#f8fafc] border-b border-[#e0e3e5] flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 1
                ? 'bg-[#002045] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:bg-[#e8effd] hover:text-[#002045] border border-[#e0e3e5]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Cơ bản & Giáo phận</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 2
                ? 'bg-[#002045] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:bg-[#e8effd] hover:text-[#002045] border border-[#e0e3e5]'
            }`}
          >
            <Church className="w-3.5 h-3.5" />
            <span>2. Bí tích & Liên lạc</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 3
                ? 'bg-[#002045] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:bg-[#e8effd] hover:text-[#002045] border border-[#e0e3e5]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Gia đình & Thân nhân</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(4)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 4
                ? 'bg-[#002045] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:bg-[#e8effd] hover:text-[#002045] border border-[#e0e3e5]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>4. Học vấn & Hội đoàn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(5)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 5
                ? 'bg-[#002045] text-white shadow-xs'
                : 'bg-white text-[#535f70] hover:bg-[#e8effd] hover:text-[#002045] border border-[#e0e3e5]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. Đánh giá Huấn luyện</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: CƠ BẢN & GIÁO PHẬN */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-[#e8effd]/50 p-3 rounded-2xl border border-[#002045]/15 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#002045]">
                  Mục 1: Thông tin Định danh Chủng sinh & Giáo phận
                </span>
                <span className="text-[11px] text-[#535f70] font-medium">Bắt buộc Họ và tên</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Tên Thánh *
                  </label>
                  <input
                    type="text"
                    required
                    value={saintName}
                    onChange={(e) => setSaintName(e.target.value)}
                    placeholder="Giuse, Phêrô, Gioan..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Họ và tên chủng sinh * <span className="text-red-500 font-normal">(Bắt buộc)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#002045]/40 text-[13px] focus:border-[#002045] outline-none font-bold bg-white text-[#002045]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Mã số Chủng sinh
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS-2024-101"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Khóa đào tạo (Gõ hoặc chọn) *
                  </label>
                  <input
                    type="text"
                    list="batch-list"
                    value={batch}
                    onChange={(e) => {
                      const newBatch = e.target.value;
                      setBatch(newBatch);
                      setAcademicYear(`${newBatch} (${admissionYear || '2022'}-${graduationYear || '2030'})`);
                    }}
                    placeholder="Khóa 21, Khóa 22, Tiền Chủng Viện..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                  <datalist id="batch-list">
                    <option value="Khóa 18" />
                    <option value="Khóa 19" />
                    <option value="Khóa 20" />
                    <option value="Khóa 21" />
                    <option value="Khóa 22" />
                    <option value="Khóa 23" />
                    <option value="Khóa 24" />
                    <option value="Khóa 25" />
                    <option value="Tiền Chủng Viện" />
                    <option value="Lớp Dự Tu Giáo Phận" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1 flex items-center justify-between">
                    <span>Năm nhập học Chủng Viện</span>
                    <span className="text-[11px] font-normal text-[#535f70]">(Nhập trường)</span>
                  </label>
                  <input
                    type="text"
                    value={admissionYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdmissionYear(val);
                      setAcademicYear(`${batch} (${val}-${graduationYear})`);
                    }}
                    placeholder="Ví dụ: 2022"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1 flex items-center justify-between">
                    <span>Năm ra trường Chủng Viện</span>
                    <span className="text-[11px] font-normal text-[#535f70]">(Ra trường/Dự kiến)</span>
                  </label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGraduationYear(val);
                      setAcademicYear(`${batch} (${admissionYear}-${val})`);
                    }}
                    placeholder="Ví dụ: 2030"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Giáo phận (Gõ hoặc chọn) *
                  </label>
                  <input
                    type="text"
                    list="diocese-list"
                    value={diocese}
                    onChange={(e) => setDiocese(e.target.value)}
                    placeholder="Hà Nội, Bùi Chu, Bắc Ninh..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                  <datalist id="diocese-list">
                    {/* Giáo tỉnh Hà Nội */}
                    <option value="Hà Nội" />
                    <option value="Bắc Ninh" />
                    <option value="Bùi Chu" />
                    <option value="Hải Phòng" />
                    <option value="Hưng Hóa" />
                    <option value="Lạng Sơn và Cao Bằng" />
                    <option value="Phát Diệm" />
                    <option value="Thái Bình" />
                    <option value="Thanh Hóa" />
                    <option value="Vinh" />
                    <option value="Hà Tĩnh" />
                    {/* Giáo tỉnh Huế */}
                    <option value="Huế" />
                    <option value="Ban Mê Thuột" />
                    <option value="Đà Nẵng" />
                    <option value="Kon Tum" />
                    <option value="Nha Trang" />
                    <option value="Quy Nhơn" />
                    {/* Giáo tỉnh Sài Gòn */}
                    <option value="Sài Gòn (TP.HCM)" />
                    <option value="Bà Rịa" />
                    <option value="Cần Thơ" />
                    <option value="Đà Lạt" />
                    <option value="Long Xuyên" />
                    <option value="Mỹ Tho" />
                    <option value="Phan Thiết" />
                    <option value="Phú Cường" />
                    <option value="Vĩnh Long" />
                    <option value="Xuân Lộc" />
                    {/* Dòng tu */}
                    <option value="Dòng Tên (SJ)" />
                    <option value="Dòng Đa Minh (OP)" />
                    <option value="Dòng Don Bosco (SDB)" />
                    <option value="Dòng Chúa Cứu Thế (CSsR)" />
                    <option value="Dòng Xitô Thánh Gia" />
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Giáo xứ quê nhà *
                  </label>
                  <input
                    type="text"
                    value={homeParish}
                    onChange={(e) => setHomeParish(e.target.value)}
                    placeholder="Giáo xứ Kẻ Sở, Phủ Lý..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Giáo xứ nhập *
                  </label>
                  <input
                    type="text"
                    value={admissionParish}
                    onChange={(e) => setAdmissionParish(e.target.value)}
                    placeholder="Giáo xứ Chính Tòa, Cửa Bắc..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Trạng thái (Gõ hoặc chọn)
                  </label>
                  <input
                    type="text"
                    list="status-list"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    placeholder="Đang học, Thực tập mục vụ..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                  <datalist id="status-list">
                    <option value="Đang học" />
                    <option value="Thực tập mục vụ" />
                    <option value="Nghỉ hè" />
                    <option value="Tạm hoãn" />
                    <option value="Du học" />
                    <option value="Đã tốt nghiệp" />
                    <option value="Đã xuất khóa" />
                  </datalist>
                </div>
              </div>

              {/* GIAI ĐOẠN HIỆN TẠI - Khung Nổi Bật theo yêu cầu */}
              <div className="p-4 bg-[#e8effd] border border-[#002045]/20 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#002045] animate-pulse"></span>
                    <label className="text-[13px] font-bold text-[#002045]">
                      ĐANG HỌC GIAI ĐOẠN NÀO HIỆN TẠI:
                    </label>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-[#002045] text-white text-[12px] font-bold rounded-lg self-start sm:self-auto shadow-xs">
                    {stage}
                  </span>
                </div>
                <input
                  type="text"
                  list="stage-list"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  placeholder="Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết I, Triết II..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#002045]/40 text-[14px] font-bold text-[#002045] focus:border-[#002045] outline-none shadow-xs"
                />
                <datalist id="stage-list">
                  <option value="Dự bị 1" />
                  <option value="Dự bị 2" />
                  <option value="Dự bị 3" />
                  <option value="Tu đức" />
                  <option value="Triết I" />
                  <option value="Triết II" />
                  <option value="Triết III" />
                  <option value="Thần I" />
                  <option value="Thần II" />
                  <option value="Thần III" />
                  <option value="Thần IV" />
                  <option value="Thực tập" />
                  <option value="Phó tế" />
                </datalist>
              </div>

              {/* Avatar Selection & Capture */}
              <div className="p-4 bg-[#f8fafc] border border-[#c4c6cf] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] font-bold text-[#002045] uppercase tracking-wide flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#002045]" />
                    <span>Ảnh đại diện chủng sinh</span>
                  </label>
                  <span className="text-[11px] text-[#535f70]">Hỗ trợ thư viện ảnh & Chụp trực tiếp</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview Box */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#002045]/30 bg-[#e8effd] flex items-center justify-center shadow-xs">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <User className="w-8 h-8 text-[#002045]/40 mx-auto mb-1" />
                          <span className="text-[10px] text-[#535f70] font-medium block leading-tight">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        title="Xóa ảnh hiện tại"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md cursor-pointer transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Two Primary Action Buttons */}
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Button 1: Thêm từ thư viện ảnh */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2.5 bg-white hover:bg-[#e8effd] text-[#002045] border-2 border-[#002045]/30 hover:border-[#002045] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                      >
                        <FolderOpen className="w-4 h-4 text-[#002045]" />
                        <span>Thêm từ thư viện ảnh</span>
                      </button>

                      {/* Button 2: Chụp hình trực tiếp qua Camera */}
                      <button
                        type="button"
                        onClick={() => setIsCameraModalOpen(true)}
                        className="px-3.5 py-2.5 bg-[#002045] hover:bg-[#1a365d] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <span>Chụp hình (Camera)</span>
                      </button>
                    </div>

                    {/* Quick URL Input & Sample Avatars */}
                    <div className="pt-1 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={avatarUrl.startsWith('data:') ? '(Ảnh chụp / Tải lên từ máy)' : avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="Hoặc dán URL ảnh https://..."
                          readOnly={avatarUrl.startsWith('data:')}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#c4c6cf] text-[11px] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {sampleAvatars.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatarUrl(url)}
                            title={`Ảnh mẫu ${idx + 1}`}
                            className={`w-6 h-6 rounded-md overflow-hidden border transition-all cursor-pointer ${
                              avatarUrl === url ? 'border-[#002045] ring-2 ring-[#002045]/30' : 'border-[#c4c6cf] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BÍ TÍCH & LIÊN LẠC */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-[#e8effd]/50 p-3 rounded-2xl border border-[#002045]/15 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#002045]">
                  Mục 2: Ngày sinh, Ngày Bí tích & Thông tin Liên lạc
                </span>
                <span className="text-[11px] text-[#535f70] font-medium">Bấm 📅 hoặc gõ DD/MM/YYYY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Số điện thoại liên lạc
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Gmail cá nhân *
                  </label>
                  <input
                    type="email"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="chungsinh@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Email Chủng viện
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chungsinh@dcv.edu.vn"
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>
              </div>

              <hr className="border-[#e0e3e5]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Ngày sinh & Nơi sinh */}
                <DateInputField
                  label="Ngày sinh"
                  value={birthDate}
                  onChange={setBirthDate}
                  placeholder="15/03/1998"
                />

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Nơi sinh (Tỉnh / Thành phố)
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Hà Nam, Hà Nội, Nam Định..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                {/* Ngày Rửa tội & Gx. Rửa tội */}
                <DateInputField
                  label="Ngày Rửa tội"
                  value={baptismDate}
                  onChange={setBaptismDate}
                  placeholder="20/03/1998"
                />

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Giáo xứ Rửa tội
                  </label>
                  <input
                    type="text"
                    value={baptismParish}
                    onChange={(e) => setBaptismParish(e.target.value)}
                    placeholder="Giáo xứ Kẻ Sở, Phủ Lý..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>

                {/* Ngày Thêm sức & ĐGM ban */}
                <DateInputField
                  label="Ngày Thêm sức"
                  value={confirmationDate}
                  onChange={setConfirmationDate}
                  placeholder="12/06/2010"
                />

                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Đức Giám Mục ban Thêm sức
                  </label>
                  <input
                    type="text"
                    value={confirmationBishop}
                    onChange={(e) => setConfirmationBishop(e.target.value)}
                    placeholder="Đức Cha Giuse Ngô Quang Kiệt..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GIA ĐÌNH & THÂN NHÂN */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-[#e8effd]/50 p-3 rounded-2xl border border-[#002045]/15 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#002045]">
                  Mục 3: Gia đình, Thân phụ mẫu & Anh chị em ruột
                </span>
                <span className="text-[11px] text-[#535f70] font-medium">Hoàn cảnh gia đạo</span>
              </div>

              {/* Thân phụ */}
              <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e0e3e5]">
                <h5 className="text-[12px] font-bold text-[#002045] mb-2 uppercase tracking-wide">
                  Thông tin Thân phụ (Bố)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Họ tên Bố
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Giuse Nguyễn Văn Minh"
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Năm sinh
                    </label>
                    <input
                      type="text"
                      value={fatherBirth}
                      onChange={(e) => setFatherBirth(e.target.value)}
                      placeholder="1970"
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Nghề nghiệp / Công tác
                    </label>
                    <input
                      type="text"
                      value={fatherJob}
                      onChange={(e) => setFatherJob(e.target.value)}
                      placeholder="Nông nghiệp / Ban hành giáo..."
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                </div>
              </div>

              {/* Thân mẫu */}
              <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e0e3e5]">
                <h5 className="text-[12px] font-bold text-[#002045] mb-2 uppercase tracking-wide">
                  Thông tin Thân mẫu (Mẹ)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Họ tên Mẹ
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Maria Trần Thị Hoa"
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Năm sinh
                    </label>
                    <input
                      type="text"
                      value={motherBirth}
                      onChange={(e) => setMotherBirth(e.target.value)}
                      placeholder="1973"
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                      Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      value={motherJob}
                      onChange={(e) => setMotherJob(e.target.value)}
                      placeholder="Nội trợ / Kinh doanh..."
                      className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                    />
                  </div>
                </div>
              </div>

              {/* Anh chị em & Địa chỉ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Số lượng anh em ruột *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={siblingsCount}
                      onChange={(e) => setSiblingsCount(parseInt(e.target.value) || 1)}
                      className="w-24 px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-bold text-center bg-white text-[#181c1e]"
                    />
                    <span className="text-[12px] text-[#535f70] font-medium">anh em</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                    Thứ bậc trong gia đình
                  </label>
                  <input
                    type="text"
                    value={birthOrder}
                    onChange={(e) => setBirthOrder(e.target.value)}
                    placeholder="Con thứ 2 / 3 anh em ruột..."
                    className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                  Địa chỉ gia đình
                </label>
                <input
                  type="text"
                  value={familyAddress}
                  onChange={(e) => setFamilyAddress(e.target.value)}
                  placeholder="Xóm 3, Giáo xứ Kẻ Sở, Thanh Liêm, Hà Nam..."
                  className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#181c1e] mb-1">
                  Ghi chú về hoàn cảnh gia đình & truyền thống đạo đức
                </label>
                <textarea
                  rows={2}
                  value={familyNotes}
                  onChange={(e) => setFamilyNotes(e.target.value)}
                  placeholder="Gia đình nề nếp đạo đức, cha mẹ nhiệt thành công tác giáo xứ, siêng năng phụng vụ..."
                  className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: HỌC VẤN & HỘI ĐOÀN (HỖ TRỢ 2, 3 TRƯỜNG ĐẠI HỌC / CAO ĐẲNG / TRUNG CẤP) */}
          {activeTab === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-[#e8effd]/50 p-3 rounded-2xl border border-[#002045]/15 flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-[#002045] block">
                    Mục 4: Học vấn trước khi nhập Chủng viện & Hội đoàn đã sinh hoạt
                  </span>
                  <span className="text-[11px] text-[#535f70]">
                    Có thể thêm 2 hoặc 3 trường Đại học, Cao đẳng, Trung cấp đã từng theo học
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 bg-[#002045] text-white hover:bg-[#1a365d] text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm trường học</span>
                </button>
              </div>

              {/* Danh sách các trường Đại học, Cao đẳng, Trung cấp */}
              <div className="space-y-3">
                {priorEducationList.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-4 bg-[#f8fafc] rounded-2xl border border-[#c4c6cf] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#002045] text-white text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-[12px] font-bold text-[#002045] uppercase tracking-wide">
                          Trường đào tạo #{idx + 1}: {edu.institution || 'Chưa nhập tên trường'}
                        </h5>
                      </div>

                      {priorEducationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="text-red-600 hover:text-red-800 text-[11px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa trường này</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Bậc / Hệ đào tạo
                        </label>
                        <select
                          value={edu.degreeType || 'Đại học'}
                          onChange={(e) => handleUpdateEducation(idx, 'degreeType', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-semibold bg-white text-[#002045]"
                        >
                          <option value="Đại học">Đại học (Cử nhân / Kỹ sư)</option>
                          <option value="Cao đẳng">Cao đẳng</option>
                          <option value="Trung cấp">Trung cấp chuyên nghiệp</option>
                          <option value="Sau đại học">Thạc sĩ / Sau đại học</option>
                          <option value="Chứng chỉ">Chứng chỉ chuyên môn</option>
                          <option value="Khác">Hệ đào tạo khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Tên Trường ĐH / CĐ / TC *
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                          placeholder="ĐH Bách Khoa, Sư phạm, Ngoại thương..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Chuyên ngành học *
                        </label>
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) => handleUpdateEducation(idx, 'major', e.target.value)}
                          placeholder="CNTT, Sư phạm Tiếng Anh, Âm nhạc..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Xếp loại tốt nghiệp
                        </label>
                        <input
                          type="text"
                          list="ranking-list"
                          value={edu.ranking || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'ranking', e.target.value)}
                          placeholder="Xuất sắc, Giỏi, Khá..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                        <datalist id="ranking-list">
                          <option value="Xuất sắc" />
                          <option value="Giỏi" />
                          <option value="Khá" />
                          <option value="Trung bình khá" />
                        </datalist>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Năm nhập học
                        </label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => handleUpdateEducation(idx, 'startYear', e.target.value)}
                          placeholder="2016"
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Năm tốt nghiệp / ra trường
                        </label>
                        <input
                          type="text"
                          value={edu.gradYear}
                          onChange={(e) => handleUpdateEducation(idx, 'gradYear', e.target.value)}
                          placeholder="2020"
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Ghi chú bằng cấp / chứng chỉ
                        </label>
                        <input
                          type="text"
                          value={edu.notes || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'notes', e.target.value)}
                          placeholder="IELTS 7.5, Bằng cử nhân chính quy..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button thêm trường học */}
              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full py-2.5 bg-white border-2 border-dashed border-[#002045]/40 hover:border-[#002045] hover:bg-[#e8effd]/50 text-[#002045] rounded-2xl text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm trường Đại học / Cao đẳng / Trung cấp khác</span>
              </button>

              {/* Các hội đoàn đã tham gia */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[12px] font-bold text-[#181c1e]">
                    Các Hội đoàn đã tham gia tại Giáo xứ & Giáo phận
                  </label>
                  <span className="text-[11px] text-[#535f70]">Bấm chọn hoặc gõ thêm</span>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonAssociations.map((item) => {
                    const isSelected = associations.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAssociation(item)}
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#002045] text-white shadow-xs'
                            : 'bg-[#f1f4f6] text-[#43474e] hover:bg-[#e0e3e5] border border-[#c4c6cf]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {item}
                      </button>
                    );
                  })}
                </div>

                {/* Custom association add */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customAssociation}
                    onChange={(e) => setCustomAssociation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAssociation();
                      }
                    }}
                    placeholder="Gõ tên hội đoàn khác (VD: Giới trẻ giáo xứ, Ban Lễ sinh, Legio Mariae...)"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                  />
                  <button
                    type="button"
                    onClick={addCustomAssociation}
                    className="px-4 py-2 bg-[#f1f4f6] hover:bg-[#e0e3e5] text-[#002045] font-bold text-[12px] rounded-xl border border-[#c4c6cf] transition-colors cursor-pointer"
                  >
                    + Thêm hội đoàn
                  </button>
                </div>

                {/* Summary of selected associations */}
                {associations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center mt-2">
                    <span className="text-[11px] text-[#535f70] font-medium mr-1">
                      Đã chọn ({associations.length}):
                    </span>
                    {associations.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8effd] text-[#002045] font-semibold text-[11px] rounded-lg border border-[#002045]/20"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => toggleAssociation(item)}
                          className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ĐÁNH GIÁ & HUẤN LUYỆN THEO NĂM (DỰ BỊ 1, 2, 3, TU ĐỨC, TRIẾT...) */}
          {activeTab === 5 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-[#e8effd]/50 p-3 rounded-2xl border border-[#002045]/15 flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-[#002045] block">
                    Mục 5: Đánh giá Huấn luyện cho từng năm (Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết...)
                  </span>
                  <span className="text-[11px] text-[#535f70]">
                    Chọn từng năm đào tạo bên dưới để xem và chỉnh sửa đánh giá chi tiết
                  </span>
                </div>
              </div>

              {/* Bộ chọn năm học / giai đoạn huấn luyện (Dự bị 1, 2, 3...) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#535f70] uppercase tracking-wider">
                  Chọn năm đào tạo để nhập đánh giá:
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#f1f4f6] rounded-2xl border border-[#e0e3e5]">
                  {annualRecordsList.map((rec) => {
                    const isSelected = (rec.yearId === selectedEvalYearId);
                    return (
                      <button
                        key={rec.yearId}
                        type="button"
                        onClick={() => setSelectedEvalYearId(rec.yearId)}
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#002045] text-white shadow-sm scale-102'
                            : 'bg-white text-[#43474e] hover:bg-[#e0e3e5] border border-[#c4c6cf]'
                        }`}
                      >
                        {rec.yearName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Khung nội dung đánh giá của Năm được chọn */}
              {activeEvalRecord && (
                <div className="space-y-4 border-t border-[#e0e3e5] pt-3">
                  <div className="p-3 bg-[#e8effd] border border-[#002045]/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#002045]" />
                      <span className="text-[13px] font-bold text-[#002045]">
                        Đang chỉnh sửa đánh giá: {activeEvalRecord.yearName} ({activeEvalRecord.schoolYear})
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#002045] text-white text-[11px] font-bold rounded-lg">
                      Xếp loại: {activeEvalRecord.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                    </span>
                  </div>

                  {/* 1. Nhận xét của Cha xứ nhà */}
                  <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#adc7f7] space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[13px] font-bold text-[#002045] flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#002045]" />
                        <span>1. Nhận xét của Cha xứ nhà (Giáo xứ quê hương)</span>
                      </h5>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#d6e3ff] text-[#002045]">
                        {activeEvalRecord.homeParishEvaluation?.ranking || 'Gương mẫu'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Tên Cha xứ nhà nhận xét *
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.homeParishEvaluation?.pastorName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              homeParishEvaluation: {
                                ...rec.homeParishEvaluation,
                                pastorName: val,
                                parishName: rec.homeParishEvaluation?.parishName || homeParish || 'Giáo xứ quê nhà',
                                ranking: rec.homeParishEvaluation?.ranking || 'Gương mẫu',
                                evaluation: rec.homeParishEvaluation?.evaluation || '',
                                period: rec.homeParishEvaluation?.period || `Năm ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          placeholder="Cha xứ Phêrô Nguyễn Văn Hữu..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Giáo xứ quê nhà *
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.homeParishEvaluation?.parishName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              homeParishEvaluation: {
                                ...rec.homeParishEvaluation,
                                pastorName: rec.homeParishEvaluation?.pastorName || 'Cha xứ nhà',
                                parishName: val,
                                ranking: rec.homeParishEvaluation?.ranking || 'Gương mẫu',
                                evaluation: rec.homeParishEvaluation?.evaluation || '',
                                period: rec.homeParishEvaluation?.period || `Năm ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          placeholder="Giáo xứ Kẻ Sở, Phủ Lý..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Xếp loại của Cha xứ nhà
                        </label>
                        <input
                          type="text"
                          list="home-ranking-list-tab5"
                          value={activeEvalRecord.homeParishEvaluation?.ranking || 'Gương mẫu'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              homeParishEvaluation: {
                                ...rec.homeParishEvaluation,
                                pastorName: rec.homeParishEvaluation?.pastorName || 'Cha xứ nhà',
                                parishName: rec.homeParishEvaluation?.parishName || homeParish || 'Giáo xứ',
                                ranking: val,
                                evaluation: rec.homeParishEvaluation?.evaluation || '',
                                period: rec.homeParishEvaluation?.period || `Năm ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-bold bg-white text-[#002045]"
                        />
                        <datalist id="home-ranking-list-tab5">
                          <option value="Đặc biệt gương mẫu" />
                          <option value="Gương mẫu" />
                          <option value="Xuất sắc" />
                          <option value="Rất tốt" />
                          <option value="Tốt" />
                          <option value="Đạt yêu cầu" />
                        </datalist>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                        Lời nhận xét chi tiết của Cha xứ nhà ({activeEvalRecord.yearName})
                      </label>
                      <textarea
                        rows={2}
                        value={activeEvalRecord.homeParishEvaluation?.evaluation || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveEvalRecord(rec => ({
                            ...rec,
                            homeParishEvaluation: {
                              ...rec.homeParishEvaluation,
                              pastorName: rec.homeParishEvaluation?.pastorName || 'Cha xứ nhà',
                              parishName: rec.homeParishEvaluation?.parishName || homeParish || 'Giáo xứ',
                              ranking: rec.homeParishEvaluation?.ranking || 'Gương mẫu',
                              evaluation: val,
                              period: rec.homeParishEvaluation?.period || `Năm ${rec.schoolYear}`,
                            }
                          }));
                        }}
                        placeholder="Nhận xét về nếp sống, đạo đức gia đình, sự gắn bó với giáo xứ quê hương và gương sáng phục vụ..."
                        className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                      />
                    </div>
                  </div>

                  {/* 2. Nhận xét của Cha xứ giúp */}
                  <div className="p-4 bg-[#fffdfa] rounded-2xl border border-[#ffddba] space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[13px] font-bold text-[#875200] flex items-center gap-2">
                        <Sun className="w-4 h-4 text-[#875200]" />
                        <span>2. Nhận xét của Cha xứ giúp (Mục vụ hè / Thực tập)</span>
                      </h5>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ffddba] text-[#875200]">
                        {activeEvalRecord.summerParishEvaluation?.ranking || 'Xuất sắc'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Tên Cha xứ giúp nhận xét *
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.summerParishEvaluation?.pastorName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              summerParishEvaluation: {
                                ...rec.summerParishEvaluation,
                                pastorName: val,
                                parishName: rec.summerParishEvaluation?.parishName || 'Giáo xứ giúp hè',
                                ranking: rec.summerParishEvaluation?.ranking || 'Xuất sắc',
                                evaluation: rec.summerParishEvaluation?.evaluation || '',
                                period: rec.summerParishEvaluation?.period || `Mục vụ hè ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          placeholder="Cha xứ Giuse Phạm Văn Lâm..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Giáo xứ giúp hè / thực tập *
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.summerParishEvaluation?.parishName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              summerParishEvaluation: {
                                ...rec.summerParishEvaluation,
                                pastorName: rec.summerParishEvaluation?.pastorName || 'Cha xứ giúp',
                                parishName: val,
                                ranking: rec.summerParishEvaluation?.ranking || 'Xuất sắc',
                                evaluation: rec.summerParishEvaluation?.evaluation || '',
                                period: rec.summerParishEvaluation?.period || `Mục vụ hè ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          placeholder="Giáo xứ Đồng Trì, Thạch Bích..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Xếp loại mục vụ hè
                        </label>
                        <input
                          type="text"
                          list="summer-ranking-list-tab5"
                          value={activeEvalRecord.summerParishEvaluation?.ranking || 'Xuất sắc'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              summerParishEvaluation: {
                                ...rec.summerParishEvaluation,
                                pastorName: rec.summerParishEvaluation?.pastorName || 'Cha xứ giúp',
                                parishName: rec.summerParishEvaluation?.parishName || 'Giáo xứ',
                                ranking: val,
                                evaluation: rec.summerParishEvaluation?.evaluation || '',
                                period: rec.summerParishEvaluation?.period || `Mục vụ hè ${rec.schoolYear}`,
                              }
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-bold bg-white text-[#875200]"
                        />
                        <datalist id="summer-ranking-list-tab5">
                          <option value="Xuất sắc" />
                          <option value="Giỏi" />
                          <option value="Khá" />
                          <option value="Đạt yêu cầu" />
                        </datalist>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                        Lời nhận xét chi tiết của Cha xứ giúp hè ({activeEvalRecord.yearName})
                      </label>
                      <textarea
                        rows={2}
                        value={activeEvalRecord.summerParishEvaluation?.evaluation || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveEvalRecord(rec => ({
                            ...rec,
                            summerParishEvaluation: {
                              ...rec.summerParishEvaluation,
                              pastorName: rec.summerParishEvaluation?.pastorName || 'Cha xứ giúp',
                              parishName: rec.summerParishEvaluation?.parishName || 'Giáo xứ',
                              ranking: rec.summerParishEvaluation?.ranking || 'Xuất sắc',
                              evaluation: val,
                              period: rec.summerParishEvaluation?.period || `Mục vụ hè ${rec.schoolYear}`,
                            }
                          }));
                        }}
                        placeholder="Nhận xét về thái độ làm việc, giảng dạy giáo lý, phụ trách lễ sinh, tinh thần hy sinh phục vụ giáo xứ..."
                        className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                      />
                    </div>
                  </div>

                  {/* 3. Nhận xét của Ban Đào Tạo */}
                  <div className="p-4 bg-[#f0f9f8] rounded-2xl border border-[#bce8e3] space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[13px] font-bold text-[#005f5a] flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#005f5a]" />
                        <span>3. Nhận xét của Ban Đào Tạo ({activeEvalRecord.yearName})</span>
                      </h5>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#bce8e3] text-[#005f5a]">
                        {activeEvalRecord.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Cha Đặc trách / Ban Đào Tạo *
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.formationBoardEvaluation?.directorOrFormatorName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              formationBoardEvaluation: {
                                ...rec.formationBoardEvaluation,
                                directorOrFormatorName: val,
                                period: rec.formationBoardEvaluation?.period || `Niên khóa ${rec.schoolYear}`,
                                ranking: rec.formationBoardEvaluation?.ranking || 'Xuất sắc',
                                recommendation: rec.formationBoardEvaluation?.recommendation || '',
                                evaluation: rec.formationBoardEvaluation?.evaluation || '',
                              }
                            }));
                          }}
                          placeholder="Ban Đào tạo Đại Chủng Viện..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Niên khóa
                        </label>
                        <input
                          type="text"
                          value={activeEvalRecord.formationBoardEvaluation?.period || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              formationBoardEvaluation: {
                                ...rec.formationBoardEvaluation,
                                directorOrFormatorName: rec.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo',
                                period: val,
                                ranking: rec.formationBoardEvaluation?.ranking || 'Xuất sắc',
                                recommendation: rec.formationBoardEvaluation?.recommendation || '',
                                evaluation: rec.formationBoardEvaluation?.evaluation || '',
                              }
                            }));
                          }}
                          placeholder="Niên khóa 2023 - 2024..."
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                          Xếp loại năm học
                        </label>
                        <input
                          type="text"
                          list="board-ranking-list-tab5"
                          value={activeEvalRecord.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveEvalRecord(rec => ({
                              ...rec,
                              formationBoardEvaluation: {
                                ...rec.formationBoardEvaluation,
                                directorOrFormatorName: rec.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo',
                                period: rec.formationBoardEvaluation?.period || `Niên khóa ${rec.schoolYear}`,
                                ranking: val,
                                recommendation: rec.formationBoardEvaluation?.recommendation || '',
                                evaluation: rec.formationBoardEvaluation?.evaluation || '',
                              }
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-bold bg-white text-[#005f5a]"
                        />
                        <datalist id="board-ranking-list-tab5">
                          <option value="Xuất sắc" />
                          <option value="Giỏi" />
                          <option value="Khá" />
                          <option value="Đạt yêu cầu" />
                        </datalist>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                        Định hướng / Quyết nghị tiến cử của Ban Đào Tạo
                      </label>
                      <input
                        type="text"
                        value={activeEvalRecord.formationBoardEvaluation?.recommendation || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveEvalRecord(rec => ({
                            ...rec,
                            formationBoardEvaluation: {
                              ...rec.formationBoardEvaluation,
                              directorOrFormatorName: rec.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo',
                              period: rec.formationBoardEvaluation?.period || `Niên khóa ${rec.schoolYear}`,
                              ranking: rec.formationBoardEvaluation?.ranking || 'Xuất sắc',
                              recommendation: val,
                              evaluation: rec.formationBoardEvaluation?.evaluation || '',
                            }
                          }));
                        }}
                        placeholder="Đủ điều kiện chuyển tiếp sang năm học / giai đoạn tiếp theo..."
                        className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181c1e] mb-1">
                        Lời nhận xét tổng quát của Ban Đào Tạo về năm {activeEvalRecord.yearName}
                      </label>
                      <textarea
                        rows={2}
                        value={activeEvalRecord.formationBoardEvaluation?.evaluation || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveEvalRecord(rec => ({
                            ...rec,
                            formationBoardEvaluation: {
                              ...rec.formationBoardEvaluation,
                              directorOrFormatorName: rec.formationBoardEvaluation?.directorOrFormatorName || 'Ban Đào tạo',
                              period: rec.formationBoardEvaluation?.period || `Niên khóa ${rec.schoolYear}`,
                              ranking: rec.formationBoardEvaluation?.ranking || 'Xuất sắc',
                              recommendation: rec.formationBoardEvaluation?.recommendation || '',
                              evaluation: val,
                            }
                          }));
                        }}
                        placeholder="Đánh giá tổng kết về đời sống thiêng liêng, nhân bản, học lực tri thức và tinh thần phục vụ mục vụ trong năm học..."
                        className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Nhận xét chung của Cha Cố vấn / Linh hướng */}
              <div className="pt-2">
                <label className="block text-[12px] font-bold text-[#181c1e] mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#002045]" />
                  <span>4. Nhận xét chung của Cha Cố vấn / Cha Linh hướng</span>
                </label>
                <textarea
                  rows={2}
                  value={advisorNote}
                  onChange={(e) => setAdvisorNote(e.target.value)}
                  placeholder="Ghi chú đánh giá tu đức, tính cách, đạo đức, năng lực tông đồ và định hướng phát triển của chủng sinh..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c6cf] text-[13px] focus:border-[#002045] outline-none font-medium bg-white text-[#181c1e]"
                />
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-2xl border border-[#e0e3e5] flex items-center gap-2 text-[12px] text-[#535f70]">
                <Sparkles className="w-4 h-4 text-[#002045] shrink-0" />
                <span>
                  Các đánh giá cho <strong>Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết, Thần</strong> đều được tự động lưu trữ và đồng bộ vào học bạ chủng viện.
                </span>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Step back/next */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeTab > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[12px] font-bold hover:bg-[#f1f4f6] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Mục trước</span>
                </button>
              ) : (
                <div />
              )}

              {activeTab < 5 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#e8effd] text-[#002045] text-[12px] font-bold hover:bg-[#d4e3fc] flex items-center justify-center gap-1 border border-[#002045]/20 cursor-pointer"
                >
                  <span>Mục tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Save & Cancel */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#c4c6cf] text-[#43474e] text-[13px] font-bold hover:bg-[#f1f4f6] cursor-pointer text-center"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#002045] hover:bg-[#1a365d] text-white text-[13px] font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingSeminarian ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ chủng sinh'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setAvatarUrl(dataUrl);
          setIsCameraModalOpen(false);
        }}
        title="Chụp ảnh đại diện chủng sinh"
      />
    </div>
  );
};
