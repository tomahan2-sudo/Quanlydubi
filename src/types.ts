export type Stage = 
  | 'Dự bị 1'
  | 'Dự bị 2'
  | 'Dự bị 3'
  | 'Tu đức'
  | 'Triết I'
  | 'Triết II'
  | 'Triết III'
  | 'Thần I'
  | 'Thần II'
  | 'Thần III'
  | 'Thần IV'
  | 'Thực tập'
  | 'Phó tế';

export type Status = 
  | 'Đang học'
  | 'Thực tập mục vụ'
  | 'Nghỉ hè'
  | 'Tạm hoãn';

export interface SubjectGrade {
  id?: string;
  code: string;
  name: string;
  credits: number;
  score: number; // Điểm số (thang 10)
  instructor: string; // Giáo sư / Giảng viên
  semester?: string; // HK1 / HK2
  note?: string;
}

export interface PriorEducationItem {
  id?: string;
  degreeType?: string; // 'Đại học' | 'Cao đẳng' | 'Trung cấp' | 'Sau đại học' | 'Khác'
  institution: string; // Tên trường (e.g. Đại học Bách Khoa Hà Nội)
  major: string; // Ngành học / Chuyên ngành
  startYear?: string; // Năm nhập học (e.g. 2016)
  gradYear: string; // Năm tốt nghiệp (e.g. 2020)
  ranking?: string; // Xếp loại: Xuất sắc, Giỏi, Khá...
  notes?: string;
}

export interface DimensionEvaluation {
  spiritual: string;    // Thiêng Liêng (Cầu nguyện, Thánh lễ, linh thao, sống kết hiệp)
  human: string;        // Nhân Bản (Trưởng thành tâm lý, nhân cách, kỷ luật, hòa đồng)
  intellectual: string; // Tri Thức (Năng lực học tập, đọc sách, nghiên cứu)
  pastoral: string;     // Mục Vụ (Kỹ năng mục vụ, tương quan giáo xứ, nhiệt thành tông đồ)
}

export interface ParishPriestEvaluation {
  parishName: string;   // Giáo xứ gì (Tên giáo xứ)
  pastorName: string;   // Tên Cha xứ nhận xét
  evaluation: string;   // Nội dung nhận xét
  period?: string;      // Thời gian (ví dụ: Hè 2023, Năm phụng vụ 2023)
  ranking?: string;     // Xếp loại (Tốt, Xuất sắc, Đạt yêu cầu, Gương mẫu)
}

export interface FormationBoardEvaluation {
  directorOrFormatorName: string; // Tên Cha Đặc Trách / Trưởng Ban Đào Tạo / Cha Giám Đốc
  evaluation: string;             // Nhận xét tổng quát của Ban Đào Tạo về năm học
  recommendation?: string;        // Định hướng / Quyết nghị (Tiến cử lên năm kế tiếp, Tiếp tục rèn luyện...)
  ranking?: string;               // Xếp loại năm học (Xuất sắc, Tốt, Khá...)
  period?: string;                // Niên khóa đào tạo
  decisionDate?: string;          // Ngày hội đồng đào tạo họp / đánh giá
}

export interface AcademicYearRecord {
  yearId: string;       // 'du-bi-1' | 'du-bi-2' | 'du-bi-3' | 'tu-duc' | 'triet-1' | 'triet-2' | 'than-1' ...
  yearName: string;     // 'Dự bị 1 (Năm I)' | 'Dự bị 2 (Năm II)' | 'Dự bị 3 (Năm III)' | 'Tu đức' | 'Triết học I'...
  schoolYear: string;   // e.g. '2021-2022'
  gpa: number;          // Điểm trung bình năm học
  creditsTotal?: number;
  subjects: SubjectGrade[];
  evaluation: DimensionEvaluation; // Nhận xét 4 chiều kích: Thiêng Liêng, Nhân Bản, Tri Thức, Mục Vụ
  homeParishEvaluation?: ParishPriestEvaluation;   // Nhận xét Cha xứ nhà (quê hương) & Tên giáo xứ
  summerParishEvaluation?: ParishPriestEvaluation; // Nhận xét Cha xứ giúp (mục vụ hè) & Tên giáo xứ
  formationBoardEvaluation?: FormationBoardEvaluation; // Nhận xét Ban Đào Tạo của năm học
}

export interface Seminarian {
  id: string;
  code: string; // e.g. CS2020-001, CS-2021-045
  fullName: string; // e.g. Giuse Nguyễn Văn A
  saintName: string; // e.g. Giuse
  birthDate: string; // e.g. 15/08/1998
  birthPlace: string; // e.g. Phủ Lý, Hà Nam
  phone: string; // e.g. 0987 654 321
  email: string;
  gmail?: string; // e.g. giusenguyenvana@gmail.com
  avatarUrl?: string;
  academicYear: string; // e.g. Khóa 21 (2021-2029)
  batch: string; // e.g. Khóa 20, Khóa 21, Khóa 19
  admissionYear?: string; // Năm nhập học Chủng Viện (e.g. 2021)
  graduationYear?: string; // Năm ra trường Chủng Viện (e.g. 2029)
  seminaryAdmissionYear?: string; // Năm nhập học Chủng Viện
  seminaryGraduationYear?: string; // Năm ra trường Chủng Viện
  diocese: string; // e.g. Hà Nội, Hải Phòng, Bắc Ninh, Phát Diệm, Bùi Chu, Hưng Hóa
  parish: string; // Giáo xứ hiện tại / liên hệ chính
  homeParish?: string; // Giáo xứ quê nhà / Quê quán
  admissionParish?: string; // Giáo xứ nhập / Giáo xứ gia nhập
  stage: Stage; // e.g. Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết I...
  status: Status; // e.g. Đang học, Thực tập mục vụ, Nghỉ hè
  baptismDate: string; // 20/08/1998
  baptismParish: string; // Gx. Kẻ Sở
  confirmationDate: string; // 15/08/2010
  confirmationBishop: string; // Đức Cha Giuse Ngô Quang Kiệt
  priorEducation: {
    institution: string; // Đại học Bách Khoa Hà Nội
    major: string; // Công nghệ thông tin
    startYear?: string; // 2016 (Năm nhập học)
    gradYear: string; // 2020 (Năm ra trường)
  };
  priorEducationList?: PriorEducationItem[]; // Danh sách các trường Đại học, Cao đẳng, Trung cấp đã theo học trước khi vào CV
  associations?: string[]; // Các hội đoàn đã tham gia: Giúp lễ, Huynh trưởng, Giáo lý viên, Ca đoàn, Legio Mariae...
  siblingsCount?: number; // Số lượng anh em ruột trong nhà
  birthOrder?: string; // Thứ bậc trong gia đình (e.g. Con thứ 2 trong gia đình 3 anh em)
  familyNotes?: string; // Ghi chú hoàn cảnh gia đình
  familyInfo?: {
    fatherName: string;
    fatherBirth: string;
    fatherJob: string;
    motherName: string;
    motherBirth: string;
    motherJob: string;
    siblingsCount: number;
    siblingsDetails?: string;
    notes?: string;
    familyAddress: string;
  };
  timeline: {
    year: string;
    title: string;
    description?: string;
    status: 'future' | 'current' | 'completed';
  }[];
  grades?: {
    philosophy?: number;
    theology?: number;
    scripture?: number;
    latin?: number;
    liturgy?: number;
    gpa?: number;
  };
  annualRecords?: AcademicYearRecord[]; // Hồ sơ điểm & đánh giá từng năm học: Dự bị 1, Dự bị 2, Dự bị 3, Tu đức, Triết...
  advisorNote?: string;
  hasAdvisorReview?: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  level: string; // Triết I, Thần II, Thần III, Triết II
  currentWeek: number;
  totalWeeks: number;
  credits: number;
  semester: string;
}

export interface PastoralAssignment {
  id: string;
  locationName: string; // Giáo xứ Chính Tòa
  pastor: string; // Cha Xứ: Giuse Phạm Văn E
  count: number;
  category: string; // Năm Tu Đức, Thực tập Xứ, Giáo lý viên
  type: 'church' | 'center';
  address: string;
  seminarians: string[];
}

export interface Activity {
  id: string;
  type: 'review' | 'announcement' | 'admission' | 'event';
  title: string;
  description: string;
  time: string;
  author?: string;
  icon?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // 08:00 - 17:00
  type: 'retreat' | 'meeting' | 'exam' | 'liturgy' | 'holiday';
  location: string;
  description?: string;
  color?: string;
}

export type ViewType = 'dashboard' | 'seminarians' | 'detail' | 'training' | 'calendar' | 'settings';
