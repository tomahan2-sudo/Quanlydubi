import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Home, 
  Sun, 
  Layers, 
  GraduationCap, 
  Check, 
  Copy, 
  Eye, 
  FileCheck,
  Calendar,
  Building,
  User,
  Church
} from 'lucide-react';
import { Seminarian, AcademicYearRecord, PriorEducationItem } from '../types';
import { createDefaultAnnualRecords } from '../mockData';

interface SeminarianReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  seminarian: Seminarian | null;
}

export const SeminarianReviewModal: React.FC<SeminarianReviewModalProps> = ({
  isOpen,
  onClose,
  seminarian,
}) => {
  const [docFormat, setDocFormat] = useState<'full' | 'summary' | 'grades'>('full');
  const [isCopied, setIsCopied] = useState(false);
  const [verifiedItems, setVerifiedItems] = useState<{ [key: string]: boolean }>({
    personal: true,
    sacrament: true,
    education: true,
    training: true,
    evaluation: true,
  });
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !seminarian) return null;

  const annualRecords: AcademicYearRecord[] = seminarian.annualRecords && seminarian.annualRecords.length > 0
    ? seminarian.annualRecords
    : createDefaultAnnualRecords(seminarian.fullName, seminarian.homeParish || seminarian.parish);

  const priorEducations: PriorEducationItem[] = seminarian.priorEducationList && seminarian.priorEducationList.length > 0
    ? seminarian.priorEducationList
    : [
        {
          id: '1',
          degreeType: seminarian.priorEducation?.degree || 'Đại học',
          institution: seminarian.priorEducation?.institution || 'Đại học Bách Khoa',
          major: seminarian.priorEducation?.major || 'Công nghệ thông tin',
          startYear: seminarian.priorEducation?.startYear || '2016',
          gradYear: seminarian.priorEducation?.gradYear || '2020',
          ranking: 'Khá',
        }
      ];

  // Analysis calculations
  const totalCompletedYears = annualRecords.length;
  const totalCredits = annualRecords.reduce((acc, y) => acc + (y.creditsTotal || y.subjects?.reduce((s, sub) => s + sub.credits, 0) || 0), 0);
  const averageGPA = (annualRecords.reduce((acc, y) => acc + (y.gpa || 8.0), 0) / (annualRecords.length || 1)).toFixed(2);
  const allVerified = Object.values(verifiedItems).every(v => v);

  const toggleVerify = (key: string) => {
    setVerifiedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Direct print trigger
  const handlePrint = () => {
    window.print();
  };

  // Copy textual summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `
=== LÝ LỊCH VÀ KẾT QUẢ HUẤN LUYỆN CHỦNG SINH ===
- Tên Thánh & Họ Tên: ${seminarian.saintName} ${seminarian.fullName}
- Mã số: ${seminarian.code} | Khóa: ${seminarian.batch} (${seminarian.academicYear})
- Giáo phận: ${seminarian.diocese} | Giáo xứ gốc: ${seminarian.homeParish || seminarian.parish}
- Giai đoạn đào tạo hiện tại: ${seminarian.stage} (${seminarian.status})
- Năm nhập học Chủng Viện: ${seminarian.seminaryAdmissionYear || seminarian.admissionYear || '2021'}
- Dự kiến hoàn thành Chủng Viện: ${seminarian.seminaryGraduationYear || seminarian.graduationYear || '2029'}

KẾT QUẢ ĐÀO TẠO & HỌC TẬP:
- Điểm trung bình tích lũy (GPA): ${averageGPA}/10.0 (${Number(averageGPA) >= 8.5 ? 'Xuất sắc' : Number(averageGPA) >= 7.5 ? 'Giỏi' : 'Khá'})
- Tổng số tín chỉ hoàn tất: ${totalCredits} tín chỉ
- Các năm đào tạo đã qua: ${annualRecords.map(r => `${r.yearName} (GPA ${r.gpa})`).join(', ')}

HỌC VẤN TRƯỚC KHI NHẬP VIỆN:
${priorEducations.map((edu, i) => `${i + 1}. ${edu.degreeType || 'Đại học'}: ${edu.institution} - Chuyên ngành ${edu.major} (${edu.startYear || '—'} - ${edu.gradYear})`).join('\n')}

ĐÁNH GIÁ TỔNG QUÁT:
- Cha xứ nhà (${annualRecords[0]?.homeParishEvaluation?.parishName || seminarian.homeParish || 'Giáo xứ'}): ${annualRecords[0]?.homeParishEvaluation?.ranking || 'Gương mẫu'}
- Ban Đào Tạo Đại Chủng viện: ${annualRecords[annualRecords.length - 1]?.formationBoardEvaluation?.ranking || 'Xuất sắc'} - ${annualRecords[annualRecords.length - 1]?.formationBoardEvaluation?.recommendation || 'Đạt tiêu chuẩn'}
`;
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Generate and download Word (.doc file)
  const handleExportWord = () => {
    setIsExportingWord(true);
    try {
      const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Hồ sơ Chủng sinh - ${seminarian.fullName}</title>
<style>
  @page {
    size: 21.0cm 29.7cm;
    margin: 2.0cm 2.0cm 2.0cm 2.0cm;
    mso-page-orientation: portrait;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.35;
    color: #000;
  }
  h1 { font-size: 16pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 10px 0 5px 0; }
  h2 { font-size: 13pt; font-weight: bold; margin: 12px 0 4px 0; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px; }
  h3 { font-size: 12pt; font-weight: bold; margin: 8px 0 2px 0; }
  .header-table { width: 100%; border: none; margin-bottom: 15px; }
  .header-table td { border: none; vertical-align: top; }
  table.data-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt; }
  table.data-table th, table.data-table td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
  table.data-table th { background-color: #f0f0f0; font-weight: bold; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
  .signature-table { width: 100%; border: none; margin-top: 30px; }
  .signature-table td { border: none; text-align: center; vertical-align: top; width: 50%; }
</style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 60%; text-align: center;">
        <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">GIÁO PHẬN ${seminarian.diocese.toUpperCase()}</div>
        <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">ĐẠI CHỦNG VIỆN THÁNH GIUSE</div>
        <div style="font-size: 10pt; font-style: italic;">Ban Đào Tạo & Giám Đốc Huấn Luyện</div>
        <div style="font-size: 10pt; margin-top: 4px;">***</div>
      </td>
      <td style="width: 40%; text-align: center;">
        <div style="font-size: 11pt; font-weight: bold;">HỘI THÁNH CÔNG GIÁO</div>
        <div style="font-size: 10pt; font-style: italic;">Ad Maiorem Dei Gloriam</div>
        <div style="font-size: 10pt; margin-top: 6px;">Mã hồ sơ: <span class="bold">${seminarian.code}</span></div>
      </td>
    </tr>
  </table>

  <h1>LÝ LỊCH VÀ HỒ SƠ HUẤN LUYỆN CHỦNG SINH</h1>
  <div style="text-align: center; font-style: italic; font-size: 11pt; margin-bottom: 15px;">
    (Curriculum Vitae et Ratio Formationis Sacerdotalis)
  </div>

  <h2>I. THÔNG TIN CÁ NHÂN & CÁC BÍ TÍCH</h2>
  <table style="width: 100%; border: none; margin-bottom: 10px;">
    <tr>
      <td style="width: 70%; border: none; vertical-align: top;">
        <p>• <b>Tên Thánh, Họ và Tên:</b> ${seminarian.saintName} ${seminarian.fullName}</p>
        <p>• <b>Ngày sinh:</b> ${seminarian.birthDate} | <b>Nơi sinh:</b> ${seminarian.birthPlace}</p>
        <p>• <b>Giáo phận:</b> ${seminarian.diocese} | <b>Giáo xứ quê nhà:</b> ${seminarian.homeParish || seminarian.parish}</p>
        <p>• <b>Giáo xứ nhập viện:</b> ${seminarian.admissionParish || seminarian.parish}</p>
        <p>• <b>Số điện thoại:</b> ${seminarian.phone} | <b>Email / Gmail:</b> ${seminarian.gmail || seminarian.email}</p>
        <p>• <b>Bí tích Rửa tội:</b> Ngày ${seminarian.baptismDate || '—'} tại GX ${seminarian.baptismParish || seminarian.parish} (Cha Rửa tội: ${seminarian.baptismPriest || '—'})</p>
        <p>• <b>Bí tích Thêm sức:</b> Ngày ${seminarian.confirmationDate || '—'} (Đức Giám mục: ${seminarian.confirmationBishop || '—'})</p>
        <p>• <b>Cha Linh hướng hiện tại:</b> ${seminarian.spiritualDirector || 'Ban Linh hướng Chủng Viện'}</p>
      </td>
      <td style="width: 30%; border: none; text-align: center; vertical-align: top;">
        <div style="border: 1px dashed #666; padding: 25px 10px; width: 110px; height: 140px; margin: 0 auto; font-size: 10pt; color: #555;">
          [ Ảnh Chân Dung 4x6 ]
        </div>
      </td>
    </tr>
  </table>

  <h2>II. HỌC VẤN TRƯỚC KHI GIA NHẬP CHỦNG VIỆN</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%;">STT</th>
        <th style="width: 20%;">Bậc Đào Tạo</th>
        <th style="width: 35%;">Tên Trường ĐH / CĐ / TC</th>
        <th style="width: 25%;">Chuyên Ngành Học</th>
        <th style="width: 15%;">Thời Gian / Xếp Loại</th>
      </tr>
    </thead>
    <tbody>
      ${priorEducations.map((edu, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>${edu.degreeType || 'Đại học'}</td>
          <td><b>${edu.institution}</b></td>
          <td>${edu.major}</td>
          <td class="text-center">${edu.startYear || '—'} - ${edu.gradYear} (${edu.ranking || 'Tốt nghiệp'})</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>III. TIẾN TRÌNH ĐÀO TẠO & HUẤN LUYỆN TẠI CHỦNG VIỆN</h2>
  <p>• <b>Khóa đào tạo:</b> ${seminarian.batch} (${seminarian.academicYear})</p>
  <p>• <b>Năm nhập học Chủng Viện:</b> ${seminarian.seminaryAdmissionYear || seminarian.admissionYear || '2021'} | <b>Dự kiến ra trường:</b> ${seminarian.seminaryGraduationYear || seminarian.graduationYear || '2029'}</p>
  <p>• <b>Giai đoạn hiện tại:</b> <span class="bold">${seminarian.stage}</span> (Trạng thái: ${seminarian.status})</p>
  
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Năm / Giai Đoạn Đào Tạo</th>
        <th style="width: 15%;">Niên Khóa</th>
        <th style="width: 15%;">Điểm GPA</th>
        <th style="width: 15%;">Số Tín Chỉ</th>
        <th style="width: 30%;">Đánh Giá / Quyết Nghị</th>
      </tr>
    </thead>
    <tbody>
      ${annualRecords.map(rec => `
        <tr>
          <td><b>${rec.yearName}</b></td>
          <td class="text-center">${rec.schoolYear}</td>
          <td class="text-center bold">${rec.gpa}/10.0</td>
          <td class="text-center">${rec.creditsTotal || 24} TC</td>
          <td>${rec.formationBoardEvaluation?.ranking || 'Xuất sắc'} - ${rec.formationBoardEvaluation?.recommendation || 'Đủ điều kiện chuyển tiếp'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>IV. ĐÁNH GIÁ 4 CHIỀU KÍCH & NHẬN XÉT HUẤN LUYỆN</h2>
  ${annualRecords.map(rec => `
    <div style="margin-bottom: 12px; padding: 6px; background-color: #fafafa; border-left: 3px solid #002045;">
      <h3 style="color: #002045;">1. Giai đoạn: ${rec.yearName} (${rec.schoolYear})</h3>
      <p><b>• Chiều kích Nhân bản & Thiêng liêng:</b> ${rec.evaluation?.human || 'Đời sống gương mẫu, kỷ luật tốt, sốt sắng kết hiệp với Chúa.'}</p>
      <p><b>• Chiều kích Tri thức & Mục vụ:</b> ${rec.evaluation?.intellectual || 'Học lực giỏi, tiếp thu vững vàng, hăng say phục vụ.'}</p>
      <p><b>• Nhận xét Cha xứ nhà (${rec.homeParishEvaluation?.pastorName || 'Cha xứ'} - GX ${rec.homeParishEvaluation?.parishName || seminarian.homeParish || 'quê hương'}):</b> <i>"${rec.homeParishEvaluation?.evaluation || 'Gương mẫu, gắn bó với cộng đoàn giáo xứ.'}"</i> (Xếp loại: <b>${rec.homeParishEvaluation?.ranking || 'Gương mẫu'}</b>)</p>
      <p><b>• Nhận xét Cha xứ giúp hè (${rec.summerParishEvaluation?.pastorName || 'Cha xứ'} - GX ${rec.summerParishEvaluation?.parishName || 'giúp hè'}):</b> <i>"${rec.summerParishEvaluation?.evaluation || 'Nhiệt tình phụ trách các đoàn thể, hòa nhã với giáo dân.'}"</i> (Xếp loại: <b>${rec.summerParishEvaluation?.ranking || 'Xuất sắc'}</b>)</p>
      <p><b>• Ban Đào Tạo Chủng viện:</b> <i>"${rec.formationBoardEvaluation?.evaluation || 'Đạt chỉ tiêu huấn luyện, đời sống tu trì trưởng thành.'}"</i></p>
    </div>
  `).join('')}

  <table class="signature-table">
    <tr>
      <td>
        <p><b>CHỦNG SINH TỰ KHAI</b></p>
        <p style="font-style: italic; font-size: 10pt;">(Ký và ghi rõ họ tên)</p>
        <div style="height: 60px;"></div>
        <p class="bold">${seminarian.fullName}</p>
      </td>
      <td>
        <p><i>Ngày ..... tháng ..... năm 20....</i></p>
        <p><b>TM. BAN ĐÀO TẠO ĐẠI CHỦNG VIỆN</b></p>
        <p style="font-style: italic; font-size: 10pt;">(Ký tên và đóng dấu)</p>
        <div style="height: 60px;"></div>
        <p class="bold">LINH MỤC GIÁM ĐỐC / ĐẶC TRÁCH</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const blob = new Blob(['\ufeff', docContent], {
        type: 'application/msword;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = seminarian.fullName.replace(/\s+/g, '_');
      link.download = `Ho_So_Chung_Sinh_${seminarian.code}_${safeName}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Generate and download PDF or trigger PDF print
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      window.print();
      setIsExportingPdf(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#f1f4f6] rounded-3xl max-w-5xl w-full max-h-[94vh] shadow-2xl border border-[#c4c6cf] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
        
        {/* Top Header Bar with Action Controls */}
        <div className="px-5 py-4 bg-[#002045] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15">
              <FileCheck className="w-5 h-5 text-[#ffddba]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[16px] sm:text-[18px] text-white">
                  Xem Trước & Xuất Bản Hồ Sơ Chủng Sinh (Khổ A4)
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#ffddba] text-[#002045] text-[11px] font-black uppercase">
                  A4 Print Ready
                </span>
              </div>
              <p className="text-[12px] text-[#adc7f7]">
                Chủng sinh: <strong>{seminarian.saintName} {seminarian.fullName}</strong> • Mã số: <strong>{seminarian.code}</strong> ({seminarian.stage})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto no-print">
            <button
              onClick={handleCopySummary}
              title="Sao chép tóm tắt kết quả hồ sơ"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Đã chép!' : 'Sao chép tóm tắt'}</span>
            </button>

            <button
              onClick={handleExportWord}
              disabled={isExportingWord}
              title="Tải về file Microsoft Word (.doc) để chỉnh sửa và gửi qua email"
              className="px-3.5 py-1.5 rounded-xl bg-[#005f5a] hover:bg-[#007a74] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingWord ? 'Đang xuất...' : 'Tải file Word (.doc)'}</span>
            </button>

            <button
              onClick={handlePrint}
              title="In trực tiếp ra khổ giấy A4 hoặc lưu thành PDF"
              className="px-3.5 py-1.5 rounded-xl bg-[#ffddba] hover:bg-[#ffe8d1] text-[#002045] text-[12px] font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In khổ A4 / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification & Analysis Summary Strip */}
        <div className="px-5 py-3 bg-[#e8effd] border-b border-[#adc7f7] flex flex-wrap items-center justify-between gap-3 text-[12px] no-print">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#002045] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#002045]" />
              <span>Kiểm tra hồ sơ trước khi in:</span>
            </span>

            <button
              onClick={() => toggleVerify('personal')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-all ${
                verifiedItems.personal ? 'bg-[#002045] text-white' : 'bg-white text-[#535f70] border border-[#c4c6cf]'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Lý lịch & Bí tích</span>
            </button>

            <button
              onClick={() => toggleVerify('education')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-all ${
                verifiedItems.education ? 'bg-[#002045] text-white' : 'bg-white text-[#535f70] border border-[#c4c6cf]'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Học vấn ĐH/CĐ ({priorEducations.length} trường)</span>
            </button>

            <button
              onClick={() => toggleVerify('training')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-all ${
                verifiedItems.training ? 'bg-[#002045] text-white' : 'bg-white text-[#535f70] border border-[#c4c6cf]'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Lộ trình {annualRecords.length} năm</span>
            </button>

            <button
              onClick={() => toggleVerify('evaluation')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-all ${
                verifiedItems.evaluation ? 'bg-[#002045] text-white' : 'bg-white text-[#535f70] border border-[#c4c6cf]'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Nhận xét Cha xứ & Ban ĐT</span>
            </button>
          </div>

          <div className="flex items-center gap-3 font-semibold text-[#002045]">
            <span>GPA tích lũy: <strong className="text-[13px] text-[#002045] bg-white px-2 py-0.5 rounded-md border border-[#adc7f7]">{averageGPA} / 10</strong></span>
            <span>Tổng tín chỉ: <strong className="text-[13px] text-[#002045] bg-white px-2 py-0.5 rounded-md border border-[#adc7f7]">{totalCredits} TC</strong></span>
          </div>
        </div>

        {/* Scrollable Document Preview Body (Paper A4 Simulation) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#636870]/20 flex justify-center">
          <div 
            ref={printAreaRef}
            className="bg-white text-[#181c1e] w-full max-w-[800px] shadow-2xl p-6 sm:p-10 border border-[#c4c6cf] rounded-sm print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none font-serif leading-relaxed"
            style={{ minHeight: '1100px' }}
          >
            {/* Header of Dossier (Ecclesiastical Letterhead) */}
            <div className="border-b-2 border-[#002045] pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="text-center w-1/2">
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#002045] uppercase tracking-wider">
                    TỔNG GIÁO PHẬN {seminarian.diocese.toUpperCase()}
                  </p>
                  <p className="text-[13px] sm:text-[14px] font-black text-[#002045] uppercase tracking-wide">
                    ĐẠI CHỦNG VIỆN THÁNH GIUSE
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#535f70] italic">
                    Ban Đào Tạo & Giám Đốc Huấn Luyện
                  </p>
                  <div className="w-16 h-[1.5px] bg-[#002045] mx-auto mt-1.5"></div>
                </div>

                <div className="text-center w-1/2">
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#002045]">
                    HỘI THÁNH CÔNG GIÁO
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#535f70] italic">
                    Ad Maiorem Dei Gloriam
                  </p>
                  <p className="text-[11px] text-[#002045] font-sans font-bold mt-1">
                    Mã hồ sơ: <span className="underline">{seminarian.code}</span>
                  </p>
                </div>
              </div>

              <div className="text-center mt-5">
                <h1 className="text-[18px] sm:text-[22px] font-black text-[#002045] uppercase tracking-wide">
                  LÝ LỊCH VÀ HỒ SƠ HUẤN LUYỆN CHỦNG SINH
                </h1>
                <p className="text-[12px] text-[#535f70] italic">
                  (Curriculum Vitae et Ratio Formationis Sacerdotalis)
                </p>
              </div>
            </div>

            {/* SECTION I: THÔNG TIN CÁ NHÂN & CÁC BÍ TÍCH */}
            <div className="mb-6">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#002045] uppercase tracking-wide bg-[#e8effd] p-1.5 px-3 rounded-md border-l-4 border-[#002045] mb-3 flex items-center justify-between">
                <span>I. THÔNG TIN CÁ NHÂN & CÁC BÍ TÍCH KHAI TÂM</span>
                <span className="text-[11px] font-normal text-[#535f70] normal-case">Lý lịch phụng vụ</span>
              </h2>

              <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">
                <div className="flex-1 space-y-1.5 text-[13px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <p>
                      <strong>Tên Thánh, Họ và Tên:</strong> {seminarian.saintName} {seminarian.fullName}
                    </p>
                    <p>
                      <strong>Mã số chủng sinh:</strong> {seminarian.code}
                    </p>
                    <p>
                      <strong>Ngày & Nơi sinh:</strong> {seminarian.birthDate} ({seminarian.birthPlace})
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {seminarian.phone}
                    </p>
                    <p>
                      <strong>Email cá nhân:</strong> {seminarian.gmail || seminarian.email}
                    </p>
                    <p>
                      <strong>Email Chủng viện:</strong> {seminarian.email}
                    </p>
                    <p>
                      <strong>Giáo phận:</strong> {seminarian.diocese}
                    </p>
                    <p>
                      <strong>Giáo xứ quê nhà:</strong> {seminarian.homeParish || seminarian.parish}
                    </p>
                    <p className="sm:col-span-2">
                      <strong>Giáo xứ gia nhập:</strong> {seminarian.admissionParish || seminarian.parish}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e0e3e5] mt-2 space-y-1 text-[12.5px] text-[#181c1e]">
                    <p>
                      • <strong>Bí tích Rửa tội:</strong> Ngày {seminarian.baptismDate || '15/08/1998'} tại Giáo xứ {seminarian.baptismParish || seminarian.parish} (Cha Rửa tội: {seminarian.baptismPriest || 'Cha xứ'})
                    </p>
                    <p>
                      • <strong>Bí tích Thêm sức:</strong> Ngày {seminarian.confirmationDate || '20/11/2010'} (Đức Giám mục: {seminarian.confirmationBishop || 'Đức Cha Giáo Phận'})
                    </p>
                    <p>
                      • <strong>Cha Linh hướng hiện tại:</strong> {seminarian.spiritualDirector || 'Linh mục Đồng hành Chủng Viện'}
                    </p>
                  </div>
                </div>

                {/* Portrait Photo in Dossier */}
                <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-md border-2 border-[#002045] overflow-hidden bg-[#f1f4f6] shrink-0 self-center sm:self-start shadow-xs">
                  {seminarian.avatarUrl ? (
                    <img 
                      src={seminarian.avatarUrl} 
                      alt={seminarian.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#535f70] text-center p-2">
                      <User className="w-8 h-8 text-[#c4c6cf] mb-1" />
                      <span className="text-[10px]">Ảnh thẻ 4x6</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION II: GIA ĐÌNH & THÂN NHÂN */}
            <div className="mb-6">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#002045] uppercase tracking-wide bg-[#e8effd] p-1.5 px-3 rounded-md border-l-4 border-[#002045] mb-2">
                II. GIA ĐÌNH & THÂN NHÂN
              </h2>
              <div className="text-[13px] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <p>
                  <strong>Thân phụ:</strong> {seminarian.familyInfo?.fatherName || seminarian.fatherName || 'Giuse Nguyễn Văn Thân'} ({seminarian.familyInfo?.fatherJob || 'Làm nông / Tự do'})
                </p>
                <p>
                  <strong>Thân mẫu:</strong> {seminarian.familyInfo?.motherName || seminarian.motherName || 'Maria Trần Thị Mẫu'} ({seminarian.familyInfo?.motherJob || 'Nội trợ'})
                </p>
                <p>
                  <strong>Số anh chị em:</strong> {seminarian.siblingsCount || seminarian.familyInfo?.siblingsCount || 3} người (Thứ tự: Con thứ {seminarian.familyInfo?.birthOrder || 2})
                </p>
                <p>
                  <strong>Địa chỉ gia đình:</strong> {seminarian.address || 'Giáo xứ quê nhà, Giáo phận ' + seminarian.diocese}
                </p>
              </div>
            </div>

            {/* SECTION III: HỌC VẤN TRƯỚC KHI NHẬP VIỆN */}
            <div className="mb-6">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#002045] uppercase tracking-wide bg-[#e8effd] p-1.5 px-3 rounded-md border-l-4 border-[#002045] mb-2 flex items-center justify-between">
                <span>III. HỌC VẤN TRƯỚC KHI GIA NHẬP CHỦNG VIỆN ({priorEducations.length} TRƯỜNG)</span>
                <span className="text-[11px] font-normal text-[#535f70] normal-case">Đại học / Cao đẳng / Trung cấp</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse border border-[#c4c6cf]">
                  <thead>
                    <tr className="bg-[#f1f4f6] text-[#002045]">
                      <th className="border border-[#c4c6cf] p-2 text-center w-10">STT</th>
                      <th className="border border-[#c4c6cf] p-2 text-left w-24">Bậc Đào Tạo</th>
                      <th className="border border-[#c4c6cf] p-2 text-left">Tên Trường</th>
                      <th className="border border-[#c4c6cf] p-2 text-left">Chuyên Ngành</th>
                      <th className="border border-[#c4c6cf] p-2 text-center w-28">Năm Học</th>
                      <th className="border border-[#c4c6cf] p-2 text-center w-24">Xếp Loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorEducations.map((edu, idx) => (
                      <tr key={edu.id || idx} className="hover:bg-gray-50">
                        <td className="border border-[#c4c6cf] p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-[#c4c6cf] p-2 font-semibold text-[#002045]">{edu.degreeType || 'Đại học'}</td>
                        <td className="border border-[#c4c6cf] p-2 font-bold">{edu.institution}</td>
                        <td className="border border-[#c4c6cf] p-2">{edu.major}</td>
                        <td className="border border-[#c4c6cf] p-2 text-center font-mono">{edu.startYear || '—'} - {edu.gradYear}</td>
                        <td className="border border-[#c4c6cf] p-2 text-center font-semibold text-emerald-800">{edu.ranking || 'Tốt nghiệp'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {seminarian.associations && seminarian.associations.length > 0 && (
                <p className="text-[12px] text-[#535f70] mt-2">
                  • <strong>Hội đoàn & Tông đồ đã tham gia:</strong> {seminarian.associations.join(', ')}
                </p>
              )}
            </div>

            {/* SECTION IV: TIẾN TRÌNH ĐÀO TẠO & HUẤN LUYỆN TẠI CHỦNG VIỆN */}
            <div className="mb-6">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#002045] uppercase tracking-wide bg-[#e8effd] p-1.5 px-3 rounded-md border-l-4 border-[#002045] mb-2 flex items-center justify-between">
                <span>IV. TIẾN TRÌNH & KẾT QUẢ HUẤN LUYỆN TẠI CHỦNG VIỆN</span>
                <span className="text-[11px] font-bold text-[#002045] normal-case font-sans">
                  Khóa: {seminarian.batch} ({seminarian.seminaryAdmissionYear || '2021'} - {seminarian.seminaryGraduationYear || '2029'})
                </span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse border border-[#c4c6cf]">
                  <thead>
                    <tr className="bg-[#f1f4f6] text-[#002045]">
                      <th className="border border-[#c4c6cf] p-2 text-left">Năm / Giai Đoạn Đào Tạo</th>
                      <th className="border border-[#c4c6cf] p-2 text-center w-24">Niên Khóa</th>
                      <th className="border border-[#c4c6cf] p-2 text-center w-20">GPA</th>
                      <th className="border border-[#c4c6cf] p-2 text-center w-16">Tín Chỉ</th>
                      <th className="border border-[#c4c6cf] p-2 text-left">Đánh Giá của Ban Đào Tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annualRecords.map((rec) => (
                      <tr key={rec.yearId} className="hover:bg-gray-50">
                        <td className="border border-[#c4c6cf] p-2 font-bold text-[#002045]">
                          {rec.yearName}
                        </td>
                        <td className="border border-[#c4c6cf] p-2 text-center font-mono">
                          {rec.schoolYear}
                        </td>
                        <td className="border border-[#c4c6cf] p-2 text-center font-bold text-[#002045]">
                          {rec.gpa} / 10
                        </td>
                        <td className="border border-[#c4c6cf] p-2 text-center font-mono">
                          {rec.creditsTotal || 24} TC
                        </td>
                        <td className="border border-[#c4c6cf] p-2">
                          <span className="font-bold text-[#002045]">{rec.formationBoardEvaluation?.ranking || 'Xuất sắc'}</span>
                          <span className="text-[#535f70]"> - {rec.formationBoardEvaluation?.recommendation || 'Đủ điều kiện chuyển tiếp'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION V: ĐÁNH GIÁ 4 CHIỀU KÍCH & NHẬN XÉT CỦA CÁC CHA XỨ */}
            <div className="mb-8">
              <h2 className="text-[14px] sm:text-[15px] font-bold text-[#002045] uppercase tracking-wide bg-[#e8effd] p-1.5 px-3 rounded-md border-l-4 border-[#002045] mb-3">
                V. ĐÁNH GIÁ 4 CHIỀU KÍCH & NHẬN XÉT MỤC VỤ
              </h2>

              <div className="space-y-3">
                {annualRecords.map((rec) => (
                  <div 
                    key={rec.yearId}
                    className="p-3 bg-[#f8fafc] border border-[#c4c6cf] rounded-md text-[12.5px] space-y-1.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-1 font-bold text-[#002045]">
                      <span>{rec.yearName} (Niên khóa {rec.schoolYear})</span>
                      <span className="text-[11px] bg-[#d6e3ff] text-[#002045] px-2 py-0.5 rounded">
                        Xếp loại: {rec.formationBoardEvaluation?.ranking || 'Xuất sắc'}
                      </span>
                    </div>

                    <p>
                      <strong>• Đời sống Thiêng liêng & Nhân bản:</strong> {rec.evaluation?.spiritual || 'Đời sống cầu nguyện sâu sắc, gương mẫu trong kỷ luật chung, hòa nhã với anh em.'}
                    </p>
                    <p>
                      <strong>• Học lực & Mục vụ:</strong> {rec.evaluation?.intellectual || 'Chăm chỉ nghiên cứu, nắm vững giáo lý, nhiệt thành với công tác mục vụ tông đồ.'}
                    </p>
                    <p>
                      <strong>• Cha xứ quê nhà ({rec.homeParishEvaluation?.pastorName || 'Cha xứ'} - {rec.homeParishEvaluation?.parishName || seminarian.homeParish || 'Giáo xứ quê nhà'}):</strong> <i>"{rec.homeParishEvaluation?.evaluation || 'Rất gương mẫu khi về giáo xứ, kính trọng các Đấng bậc và gắn bó với giới trẻ.'}"</i> (Xếp loại: <strong>{rec.homeParishEvaluation?.ranking || 'Gương mẫu'}</strong>)
                    </p>
                    <p>
                      <strong>• Cha xứ giúp hè ({rec.summerParishEvaluation?.pastorName || 'Cha xứ giúp'} - {rec.summerParishEvaluation?.parishName || 'Giáo xứ giúp hè'}):</strong> <i>"{rec.summerParishEvaluation?.evaluation || 'Phụ trách tốt ban lễ sinh và các lớp giáo lý, tinh thần phục vụ hăng say.'}"</i> (Xếp loại: <strong>{rec.summerParishEvaluation?.ranking || 'Xuất sắc'}</strong>)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION VI: XÁC NHẬN & CHỮ KÝ */}
            <div className="pt-6 border-t-2 border-[#002045] mt-6">
              <div className="grid grid-cols-2 text-center text-[13px]">
                <div>
                  <p className="font-bold text-[#002045] uppercase">CHỦNG SINH XÁC NHẬN</p>
                  <p className="text-[11px] text-[#535f70] italic">(Ký và ghi rõ họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-[#002045]">{seminarian.fullName}</p>
                </div>

                <div>
                  <p className="text-[12px] text-[#535f70] italic">
                    Hà Nội, ngày ..... tháng ..... năm 20....
                  </p>
                  <p className="font-bold text-[#002045] uppercase">TM. BAN ĐÀO TẠO ĐẠI CHỦNG VIỆN</p>
                  <p className="text-[11px] text-[#535f70] italic">(Ký tên và đóng dấu)</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-[#002045]">LINH MỤC GIÁM ĐỐC / ĐẶC TRÁCH</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer actions inside modal */}
        <div className="px-5 py-3.5 bg-white border-t border-[#c4c6cf] flex items-center justify-between no-print">
          <div className="text-[12.5px] text-[#535f70]">
            Đã xác nhận dữ liệu chuẩn: <strong>{seminarian.fullName} ({seminarian.code})</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#c4c6cf] text-[#43474e] hover:bg-[#f1f4f6] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Đóng xem trước
            </button>

            <button
              onClick={handleExportWord}
              className="px-4 py-2 rounded-xl bg-[#005f5a] text-white hover:bg-[#007a74] text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#002045] text-white hover:bg-[#1a365d] text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#ffddba]" />
              <span>In bản in A4 / Lưu PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
