import { Seminarian, Course, PastoralAssignment, Activity, CalendarEvent, AcademicYearRecord } from './types';

export const createDefaultAnnualRecords = (name: string, homeParishName: string): AcademicYearRecord[] => [
  {
    yearId: 'du-bi-1',
    yearName: 'Năm Dự bị 1 (Năm I Tiền Chủng viện)',
    schoolYear: '2018 - 2019',
    gpa: 8.5,
    creditsTotal: 24,
    subjects: [
      { code: 'DB101', name: 'Giáo lý Căn bản & Bản Tuyên Xưng Đức Tin', credits: 4, score: 8.8, instructor: 'Cha Giuse Vũ Minh Tuấn', semester: 'HK I' },
      { code: 'DB102', name: 'Nhập môn Kinh Thánh (Tổng quan Cựu Ước & Tân Ước)', credits: 4, score: 8.5, instructor: 'Cha Phaolô Nguyễn Khắc Bằng', semester: 'HK I' },
      { code: 'DB103', name: 'Nhân bản Kitô giáo & Ứng xử trong đời sống dâng hiến', credits: 4, score: 8.7, instructor: 'Cha Gioan B. Lê Đình Chung', semester: 'HK I' },
      { code: 'DB104', name: 'Phương pháp đọc sách & Tư duy nghiên cứu', credits: 3, score: 8.2, instructor: 'Giáo sư Antôn Đặng Văn Hòa', semester: 'HK II' },
      { code: 'DB105', name: 'Tiếng Anh Căn bản trong Phụng vụ & Giáo hội', credits: 3, score: 8.4, instructor: 'Thầy Phêrô Vũ Hải Đăng', semester: 'HK II' },
      { code: 'DB106', name: 'Lịch sử Cứu độ & Địa lý Thánh địa', credits: 3, score: 8.6, instructor: 'Cha Phêrô Trần Văn Khải', semester: 'HK II' },
      { code: 'DB107', name: 'Thanh nhạc & Hát Phụng vụ căn bản', credits: 3, score: 8.8, instructor: 'Nhạc sĩ / Cha Giuse Nguyễn Tiến', semester: 'HK II' },
    ],
    evaluation: {
      spiritual: 'Thầy có tinh thần cầu nguyện sốt sắng, duy trì nghiêm túc các giờ kinh phụng vụ sáng - tối, siêng năng viếng Thánh Thể và xưng tội định kỳ.',
      human: 'Tính cách hiền hòa, lễ phép, tôn trọng kỷ luật cộng đoàn nhà Tiền Chủng viện, biết lắng nghe và sống chan hòa với anh em đồng môn.',
      intellectual: 'Có tinh thần tự học cao, tích cực đọc các tài liệu huấn giáo căn bản và hoàn thành đầy đủ các bài thu hoạch môn học.',
      pastoral: 'Sẵn sàng tham gia các giờ lao động chung, giúp đỡ giáo xứ sở tại trong các dịp lễ lớn với tinh thần nhiệt thành phục vụ.',
    },
    summerParishEvaluation: {
      parishName: 'Giáo xứ Đồng Trì',
      pastorName: 'Cha xứ Giuse Phạm Văn Lâm',
      period: 'Mục vụ hè 2019 (Tháng 6 - Tháng 8)',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy đã phụ trách các lớp Giáo lý thiếu nhi hè và hướng dẫn Ban Lễ sinh giáo xứ rất chu đáo. Đời sống giản dị, khiêm tốn, được cha xứ và bà con giáo dân hết lòng quý mến.'
    },
    homeParishEvaluation: {
      parishName: homeParishName || 'Giáo xứ quê nhà Kẻ Sở',
      pastorName: 'Cha xứ Phêrô Nguyễn Văn Hữu (Cha xứ nhà)',
      period: 'Năm phụng vụ 2018 - 2019',
      ranking: 'Gương mẫu',
      evaluation: 'Thầy luôn giữ mối liên hệ mật thiết với Giáo xứ quê hương, khi về nghỉ lễ luôn sốt sắng phục vụ bàn thờ Chúa và là gương sáng đạo đức cho các bạn trẻ trong giáo xứ.'
    },
    formationBoardEvaluation: {
      directorOrFormatorName: 'Cha Đặc trách Tiền Chủng viện Giuse Hoàng Cao Luân',
      period: 'Niên khóa 2018 - 2019',
      ranking: 'Tốt',
      evaluation: 'Thầy thích nghi rất nhanh với nếp sống cộng đoàn Tiền Chủng viện, chăm chỉ học tập, đời sống cầu nguyện có chiều sâu và ý thức kỷ luật tự giác cao.',
      recommendation: 'Đồng thuận cho tiếp tục chuyển sang Năm Dự bị 2 Tiền Chủng viện.',
      decisionDate: '28/05/2019'
    }
  },
  {
    yearId: 'du-bi-2',
    yearName: 'Năm Dự bị 2 (Năm II Tiền Chủng viện)',
    schoolYear: '2019 - 2020',
    gpa: 8.7,
    creditsTotal: 26,
    subjects: [
      { code: 'DB201', name: 'Kinh Thánh Cựu Ước: Bộ Ngũ Thư & Lịch sử', credits: 4, score: 8.9, instructor: 'Cha Phaolô Nguyễn Khắc Bằng', semester: 'HK I' },
      { code: 'DB202', name: 'Giáo luật Căn bản & Thể chế Giáo phận', credits: 3, score: 8.5, instructor: 'Cha Đaminh Nguyễn Văn Lộc', semester: 'HK I' },
      { code: 'DB203', name: 'Latinh Căn bản I (Ngữ pháp & Bản văn Phụng vụ)', credits: 4, score: 8.3, instructor: 'Cha Micae Trần Quốc Toản', semester: 'HK I' },
      { code: 'DB204', name: 'Linh đạo Ơn gọi Giáo sĩ Triều', credits: 4, score: 9.0, instructor: 'Cha Giám đốc Giuse Hoàng Cao Luân', semester: 'HK II' },
      { code: 'DB205', name: 'Phương pháp Huấn giáo & Sư phạm Giáo lý', credits: 4, score: 8.8, instructor: 'Nữ tu Maria Nguyễn Thị Thu', semester: 'HK II' },
      { code: 'DB206', name: 'Lịch sử Giáo hội Việt Nam & Các Thánh Tử Đạo', credits: 4, score: 9.1, instructor: 'Cha Giuse Đinh Khắc Hùng', semester: 'HK II' },
      { code: 'DB207', name: 'Văn hóa & Phong tục tập quán Dân tộc', credits: 3, score: 8.6, instructor: 'Giáo sư TS. Lê Văn Bách', semester: 'HK II' },
    ],
    evaluation: {
      spiritual: 'Đời sống nội tâm ngày càng phát triển sâu sắc. Có sự trưởng thành trong việc phân định ơn gọi qua các kỳ tĩnh tâm tháng và linh thao ngắn ngày.',
      human: 'Ý thức tự giác rất cao, trung thực, tinh thần trách nhiệm trong công việc được giao, khả năng làm việc nhóm và tổ chức tốt.',
      intellectual: 'Nắm vững các kiến thức nền tảng về Kinh Thánh và Giáo lý Hội thánh. Có kỹ năng phân tích và diễn đạt mạch lạc, tiếng Latinh có tiến bộ rõ rệt.',
      pastoral: 'Có khả năng truyền đạt giáo lý sinh động, hiểu tâm lý giới trẻ và thiếu nhi, điều hành tốt các sinh hoạt phong trào Thiếu Nhi Thánh Thể.',
    },
    summerParishEvaluation: {
      parishName: 'Giáo xứ Thạch Bích',
      pastorName: 'Cha xứ Giuse Vũ Quang Trung',
      period: 'Mục vụ hè 2020 (Tháng 6 - Tháng 8)',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy đã tổ chức thành công Hội thi Giáo lý hè cho hơn 400 em thiếu nhi và tập huấn nghiệp vụ cho Huynh trưởng. Tác phong chững chạc, gương mẫu, tận tụy.'
    },
    homeParishEvaluation: {
      parishName: homeParishName || 'Giáo xứ quê nhà Kẻ Sở',
      pastorName: 'Cha xứ Phêrô Nguyễn Văn Hữu (Cha xứ nhà)',
      period: 'Năm phụng vụ 2019 - 2020',
      ranking: 'Rất tốt',
      evaluation: 'Gia đình thầy sống gương mẫu tại xóm đạo. Thầy luôn giữ đức khiêm nhường, gần gũi với mọi người và tích cực hỗ trợ Ban Hành giáo trong các công việc chung.'
    },
    formationBoardEvaluation: {
      directorOrFormatorName: 'Ban Đào tạo Tiền Chủng viện Giáo phận',
      period: 'Niên khóa 2019 - 2020',
      ranking: 'Xuất sắc',
      evaluation: 'Có bước tiến rõ rệt về đời sống nhân bản và tri thức. Khả năng tương quan tốt, khiêm nhường và có tinh thần phục vụ vô vị lợi.',
      recommendation: 'Đủ điều kiện chuyển tiếp sang Năm Dự bị 3 (Năm hoàn thiện Tiền Chủng viện).',
      decisionDate: '30/05/2020'
    }
  },
  {
    yearId: 'du-bi-3',
    yearName: 'Năm Dự bị 3 (Năm III Hoàn thiện Tiền Chủng viện)',
    schoolYear: '2020 - 2021',
    gpa: 8.9,
    creditsTotal: 28,
    subjects: [
      { code: 'DB301', name: 'Kinh Thánh Tân Ước: Tin Mừng Nhất Lãm & Tông Đồ Công Vụ', credits: 4, score: 9.2, instructor: 'Cha Phaolô Nguyễn Khắc Bằng', semester: 'HK I' },
      { code: 'DB302', name: 'Nhập môn Triết học Tây phương & Thuật ngữ Triết học', credits: 4, score: 8.8, instructor: 'Cha Phêrô Nguyễn Văn Thắng', semester: 'HK I' },
      { code: 'DB303', name: 'Latinh Căn bản II & Đọc hiểu Bản văn Latinh', credits: 4, score: 8.6, instructor: 'Cha Micae Trần Quốc Toản', semester: 'HK I' },
      { code: 'DB304', name: 'Phụng vụ Đại cương & Cử hành Năm Phụng vụ', credits: 4, score: 9.0, instructor: 'Cha Giuse Bùi Văn Tuyền', semester: 'HK II' },
      { code: 'DB305', name: 'Đoàn sủng & Linh đạo Mục vụ Giáo phận', credits: 4, score: 9.1, instructor: 'Đức Cha Giuse Nguyễn Năng', semester: 'HK II' },
      { code: 'DB306', name: 'Kỹ năng Truyền thông Mục vụ & Thuyết trình', credits: 4, score: 8.7, instructor: 'Cha Giuse Trần Tiến Công', semester: 'HK II' },
      { code: 'DB307', name: 'Khóa Luận Tiền Chủng viện & Phân định Ơn gọi', credits: 4, score: 9.3, instructor: 'Ban Đào tạo Tiền Chủng viện', semester: 'HK II' },
    ],
    evaluation: {
      spiritual: 'Đạt độ chín chắn và vững vàng trong đời sống thiêng liêng. Đã hoàn thành tuần linh thao phân định ơn gọi trước khi chính thức nhập học Đại Chủng Viện.',
      human: 'Tâm lý trưởng thành, quân bình cảm xúc, có phong thái điềm đạm của người chuẩn bị bước vào giai đoạn đào tạo Đại Chủng Viện.',
      intellectual: 'Kết quả học tập xuất sắc, tư duy logic vững vàng, làm bài thi tuyển và khóa luận đạt điểm số cao trong nhóm dẫn đầu của khóa.',
      pastoral: 'Kỹ năng mục vụ toàn diện, có tinh thần dấn thân, không ngại khó khăn khi được sai đi làm mục vụ tại các giáo họ vùng xa.',
    },
    summerParishEvaluation: {
      parishName: 'Giáo xứ Tràng Châu',
      pastorName: 'Cha xứ Giuse Phạm Văn Đức',
      period: 'Mục vụ hè 2021 (Tháng 6 - Tháng 8)',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy đã có 3 tháng mục vụ hè rất tích cực tại giáo xứ và 2 giáo họ trực thuộc. Đời sống hy sinh, nhiệt tâm thăm viếng người già yếu, bệnh tật và bồi dưỡng ơn gọi cho thiếu nhi.'
    },
    homeParishEvaluation: {
      parishName: homeParishName || 'Giáo xứ quê nhà Kẻ Sở',
      pastorName: 'Cha xứ Phêrô Nguyễn Văn Hữu (Cha xứ nhà)',
      period: 'Năm phụng vụ 2020 - 2021',
      ranking: 'Đặc biệt xuất sắc',
      evaluation: 'Cha xứ và toàn thể Hội đồng Mục vụ Giáo xứ quê hương đồng thuận chứng nhận thầy có tư cách đạo đức rất tốt, xứng đáng được Đức Giám mục Giáo phận tuyển chọn gửi vào Đại Chủng Viện.'
    },
    formationBoardEvaluation: {
      directorOrFormatorName: 'Hội đồng Tuyển chọn & Đào tạo Tiền Chủng viện',
      period: 'Niên khóa 2020 - 2021',
      ranking: 'Xuất sắc',
      evaluation: 'Hoàn thành xuất sắc 3 năm Tiền Chủng viện với đầy đủ 4 chiều kích. Ơn gọi trưởng thành rõ nét, tâm lý quân bình, trí tuệ mẫn tiệp.',
      recommendation: 'Trân trọng kính trình Đức Giám mục Giáo phận quyết định gửi nhập học Đại Chủng Viện Thánh Giuse.',
      decisionDate: '15/06/2021'
    }
  },
  {
    yearId: 'tu-duc',
    yearName: 'Năm Tu đức (Đại Chủng Viện)',
    schoolYear: '2021 - 2022',
    gpa: 8.7,
    creditsTotal: 30,
    subjects: [
      { code: 'TD101', name: 'Thần học Tu đức & Linh đạo Linh mục Triều', credits: 5, score: 8.9, instructor: 'Cha Giám đốc Đào tạo', semester: 'HK I' },
      { code: 'TD102', name: 'Linh thao Thánh Inhaxiô 30 Ngày', credits: 5, score: 9.4, instructor: 'Cha Linh hướng Inhaxiô', semester: 'HK I' },
      { code: 'TD103', name: 'Kinh Thánh: Các Sách Lịch Sử & Ngôn Sứ', credits: 4, score: 8.6, instructor: 'Cha Giáo Kinh Thánh', semester: 'HK I' },
      { code: 'TD104', name: 'Nhân bản Linh mục & Trưởng thành Tình cảm', credits: 4, score: 8.7, instructor: 'Chuyên gia Tâm lý & Cha Giáo', semester: 'HK II' },
      { code: 'TD105', name: 'Phụng vụ Thánh Thể & Các Giờ Kinh Phụng Vụ', credits: 4, score: 8.8, instructor: 'Cha Giáo Phụng vụ', semester: 'HK II' },
      { code: 'TD106', name: 'Lịch sử Linh đạo Công giáo qua các Thế kỷ', credits: 4, score: 8.5, instructor: 'Cha Giáo Lịch sử Giáo hội', semester: 'HK II' },
      { code: 'TD107', name: 'Tiếng Latinh Phụng vụ & Giáo Phụ', credits: 4, score: 8.4, instructor: 'Cha Giáo Latinh', semester: 'HK II' },
    ],
    evaluation: {
      spiritual: 'Hoàn thành kỳ Linh thao 30 ngày với nhiều hoa trái thiêng liêng. Đời sống cầu nguyện sâu lắng, gắn bó mật thiết với Chúa Kitô Thánh Thể.',
      human: 'Sống đời cộng đoàn kỷ luật, biết hy sinh quên mình vì lợi ích chung, khiêm tốn nhận góp ý và có tinh thần tự giác cao.',
      intellectual: 'Tiếp thu tốt các bài giảng thần học tu đức, có sự liên kết chặt chẽ giữa tri thức và đời sống tâm linh.',
      pastoral: 'Ý thức sâu sắc rằng mọi hoạt động mục vụ phải bắt nguồn từ đời sống kết hiệp mật thiết với Chúa.',
    },
    summerParishEvaluation: {
      parishName: 'Giáo xứ Cổ Liêu',
      pastorName: 'Cha xứ Giuse Nguyễn Văn Thoan',
      period: 'Mục vụ Tu đức hè 2022',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy chấp hành nghiêm túc quy chế mục vụ năm Tu đức, sống đời cầu nguyện gương mẫu và giúp đỡ cha xứ tận tình trong công việc mục vụ.'
    },
    homeParishEvaluation: {
      parishName: homeParishName || 'Giáo xứ quê nhà Kẻ Sở',
      pastorName: 'Cha xứ Phêrô Nguyễn Văn Hữu (Cha xứ nhà)',
      period: 'Năm phụng vụ 2021 - 2022',
      ranking: 'Gương mẫu',
      evaluation: 'Sau năm Tu đức, thầy thể hiện rõ sự trưởng thành thiêng liêng, khiêm tốn và nhiệt thành phục vụ giáo xứ quê hương.'
    },
    formationBoardEvaluation: {
      directorOrFormatorName: 'Ban Đào tạo Năm Tu Đức - Đại Chủng Viện',
      period: 'Niên khóa 2021 - 2022',
      ranking: 'Xuất sắc',
      evaluation: 'Thấm nhuần linh đạo ơn gọi, vượt qua kỳ linh thao 30 ngày một cách sốt sắng, đời sống huynh đệ chân thành và khiêm hạ.',
      recommendation: 'Tiến cử bước vào Phân khoa Triết học (Năm Triết I).',
      decisionDate: '10/06/2022'
    }
  },
  {
    yearId: 'triet-1',
    yearName: 'Năm Triết học I (Đại Chủng Viện)',
    schoolYear: '2022 - 2023',
    gpa: 8.8,
    creditsTotal: 32,
    subjects: [
      { code: 'PH101', name: 'Triết học Nhận thức & Nhập môn Triết học', credits: 4, score: 8.8, instructor: 'Cha Phêrô Nguyễn Văn Thắng', semester: 'HK I' },
      { code: 'PH102', name: 'Logic học & Phương pháp luận Triết học', credits: 4, score: 8.7, instructor: 'Cha Đaminh Trần Văn Long', semester: 'HK I' },
      { code: 'PH103', name: 'Lịch sử Triết học Cổ đại Hy Lạp & La Mã', credits: 4, score: 9.0, instructor: 'Cha Giuse Vũ Khắc Nghiêm', semester: 'HK I' },
      { code: 'PH104', name: 'Triết học Con người (Nhân học Triết học)', credits: 4, score: 8.9, instructor: 'Cha Phaolô Đỗ Văn Trí', semester: 'HK II' },
      { code: 'PH105', name: 'Triết học Tự nhiên & Vũ trụ học', credits: 4, score: 8.5, instructor: 'Cha Gioan B. Nguyễn Hữu Dũng', semester: 'HK II' },
      { code: 'PH106', name: 'Triết học Cận đại & Khai sáng Tây phương', credits: 4, score: 8.8, instructor: 'Cha Giuse Vũ Khắc Nghiêm', semester: 'HK II' },
      { code: 'PH107', name: 'Tiếng Latinh Triết học & Dịch thuật', credits: 4, score: 8.6, instructor: 'Cha Micae Trần Quốc Toản', semester: 'HK II' },
      { code: 'PH108', name: 'Đọc tác phẩm Triết học Kinh viện (Thánh Tôma Aquinô)', credits: 4, score: 9.1, instructor: 'Cha Phêrô Nguyễn Văn Thắng', semester: 'HK II' },
    ],
    evaluation: {
      spiritual: 'Duy trì đời sống thiêng liêng sốt sắng, tích cực tham gia các giờ Chầu Thánh Thể và kinh nguyện của phân khoa Triết học.',
      human: 'Quan hệ tốt với ban đào tạo và anh em đồng môn. Có tinh thần đối thoại, cởi mở và tôn trọng ý kiến khác biệt.',
      intellectual: 'Khả năng tư duy phản biện và phân tích triết học rất tốt, đọc nhiều sách kinh điển và có bài luận đạt điểm xuất sắc.',
      pastoral: 'Tích cực tham gia nhóm tông đồ Caritas và phục vụ bệnh nhân nghèo vào các chiều Chúa Nhật.',
    },
    summerParishEvaluation: {
      parishName: 'Giáo xứ Bút Đông',
      pastorName: 'Cha xứ Giuse Mai Xuân Lâm',
      period: 'Mục vụ hè 2023',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy có năng lực giảng dạy rất tốt, đã tổ chức thành công tuần hội trại giới trẻ và phụ trách ca đoàn giáo xứ.'
    },
    homeParishEvaluation: {
      parishName: homeParishName || 'Giáo xứ quê nhà Kẻ Sở',
      pastorName: 'Cha xứ Phêrô Nguyễn Văn Hữu (Cha xứ nhà)',
      period: 'Năm phụng vụ 2022 - 2023',
      ranking: 'Xuất sắc',
      evaluation: 'Thầy luôn là niềm vinh dự và tự hào của xứ đạo quê hương, gương mẫu trong đời sống tận hiến phục vụ.'
    },
    formationBoardEvaluation: {
      directorOrFormatorName: 'Ban Đào tạo Phân khoa Triết học',
      period: 'Niên khóa 2022 - 2023',
      ranking: 'Giỏi',
      evaluation: 'Tư duy triết học sắc sảo, tinh thần học tập gương mẫu, đạo đức tu đức phát triển toàn diện.',
      recommendation: 'Chuyển tiếp lên Năm Triết học II (hoàn thiện Cử nhân Triết học).',
      decisionDate: '12/06/2023'
    }
  }
];

export const INITIAL_SEMINARIANS: Seminarian[] = [
  {
    id: 'sem-1',
    code: 'CS-2021-045',
    fullName: 'Giuse Nguyễn Văn A',
    saintName: 'Giuse',
    birthDate: '15/08/1998',
    birthPlace: 'Phủ Lý, Hà Nam',
    phone: '0987 654 321',
    email: 'giuse.nguyenvana@chungvien.edu.vn',
    gmail: 'nguyenvana.joseph98@gmail.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6FcjebVL1eQjN3T9uNwDnKBT7XJDeFtWzsQaVVhTBGurHObK_NbLm5AN_n3wZ05toLiS_SM5S8EBzaEU7QICOsNquiZZVAxTBy4LtjbpbHmlnPxhoB5faPe3YK6vFspQfX6-m7Mp1OZaXdpWopRnMWKYhXHof4xKuvPNnuNFkhrxMWQX9pYPUydBT78y_qwi_hAIpNHlJtqfHRsCuT8qikV0v-OIYiExXzDhgQdGzzmgluf11Nixx',
    academicYear: 'Khóa 21 (2021-2029)',
    batch: 'Khóa 21',
    admissionYear: '2021',
    graduationYear: '2029',
    seminaryAdmissionYear: '2021',
    seminaryGraduationYear: '2029',
    diocese: 'Hà Nội',
    parish: 'Kẻ Sở',
    homeParish: 'Giáo xứ Kẻ Sở (Hà Nam)',
    admissionParish: 'Giáo xứ Chính Tòa Hà Nội',
    stage: 'Thần I',
    status: 'Đang học',
    baptismDate: '20/08/1998',
    baptismParish: 'Gx. Kẻ Sở',
    confirmationDate: '15/08/2010',
    confirmationBishop: 'Đức Cha Giuse Ngô Quang Kiệt',
    priorEducation: {
      institution: 'Đại học Bách Khoa Hà Nội',
      major: 'Công nghệ thông tin',
      startYear: '2016',
      gradYear: '2020'
    },
    priorEducationList: [
      {
        id: 'edu-1-1',
        degreeType: 'Đại học',
        institution: 'Đại học Bách Khoa Hà Nội',
        major: 'Kỹ sư Công nghệ Thông tin',
        startYear: '2016',
        gradYear: '2020',
        ranking: 'Giỏi',
        notes: 'Tốt nghiệp hệ chính quy'
      },
      {
        id: 'edu-1-2',
        degreeType: 'Cao đẳng',
        institution: 'Cao đẳng Nghệ thuật Hà Nội',
        major: 'Thanh nhạc & Chỉ huy Ca đoàn',
        startYear: '2018',
        gradYear: '2021',
        ranking: 'Xuất sắc',
        notes: 'Chuyên ban Phụng ca'
      }
    ],
    associations: ['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên', 'Ca đoàn Trầm Hương'],
    siblingsCount: 3,
    birthOrder: 'Con thứ 2 / 3 anh em (2 nam, 1 nữ)',
    familyNotes: 'Gia đình truyền thống Công giáo sốt sắng, cha là Trưởng ban Mục vụ Giáo xứ Kẻ Sở, anh trai cả đã lập gia đình, em gái đang theo học Đại học.',
    familyInfo: {
      fatherName: 'Giuse Nguyễn Văn Minh',
      fatherBirth: '1970',
      fatherJob: 'Nông nghiệp & Giáo lý viên',
      motherName: 'Maria Trần Thị Hoa',
      motherBirth: '1973',
      motherJob: 'Nội trợ',
      siblingsCount: 3,
      siblingsDetails: 'Anh trai cả (1995 - đã lập gia đình), Thầy Giuse (1998), Em gái út (2003 - Sinh viên)',
      notes: 'Gia đình hòa thuận, kính sợ Chúa, luôn ủng hộ thầy tận hiến phục vụ.',
      familyAddress: 'Thôn 3, Kiện Khê, Thanh Liêm, Hà Nam'
    },
    timeline: [
      { year: 'Dự kiến 2029', title: 'Linh mục', description: 'Chịu chức Thánh Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm I Thần học', description: 'Bắt đầu giai đoạn Thần học Chuyên sâu', status: 'current' },
      { year: '05/09/2023', title: 'Hoàn tất Triết học', description: 'Đạt kết quả xuất sắc môn Triết học', status: 'completed' },
      { year: '15/08/2021', title: 'Nhập Chủng viện', description: 'Khóa 21, Lớp Tu đức', status: 'completed' }
    ],
    grades: {
      philosophy: 8.8,
      theology: 8.5,
      scripture: 9.0,
      latin: 8.2,
      liturgy: 8.9,
      gpa: 8.7
    },
    annualRecords: createDefaultAnnualRecords('Giuse Nguyễn Văn A', 'Giáo xứ Kẻ Sở (Hà Nam)'),
    advisorNote: 'Thầy có đời sống cầu nguyện sốt sắng, tinh thần kỷ luật cao, hòa đồng và luôn sẵn sàng phục vụ anh em trong cộng đoàn.',
    hasAdvisorReview: true
  },
  {
    id: 'sem-2',
    code: 'CS2019-042',
    fullName: 'Phêrô Trần Văn B',
    saintName: 'Phêrô',
    birthDate: '12/04/1997',
    birthPlace: 'Thủy Nguyên, Hải Phòng',
    phone: '0912 345 678',
    email: 'phero.tranvanb@chungvien.edu.vn',
    gmail: 'tranvanb.peter97@gmail.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-P_yC-gfC66dD5aS_Xeq0m3z2ZWyQOo3LCoa5EhxkQxoeoSv5SwQC-z8PnAF0bvmaG6OGzLufddhboE46OXihwtMl-9CD1c782bywH_2eH6y7lXTzM3R2yTXEM8PH7FceuaJMxN5wnXsMPrIGC-sRnr7T0d1KugTEv8obL6K3haftidBtWQ-vWIzlizfQa8tX1QOcQLRpecXQjXsNNer5JCm_teRaTrZVpYV_u8Z6gF5czTOuIeu0',
    academicYear: 'Khóa 19 (2019-2027)',
    batch: 'Khóa 19',
    admissionYear: '2019',
    graduationYear: '2027',
    seminaryAdmissionYear: '2019',
    seminaryGraduationYear: '2027',
    diocese: 'Hải Phòng',
    parish: 'Chính Tòa Hải Phòng',
    homeParish: 'Giáo xứ Thủy Nguyên',
    admissionParish: 'Giáo xứ Hòa Bình',
    stage: 'Thực tập',
    status: 'Thực tập mục vụ',
    baptismDate: '18/04/1997',
    baptismParish: 'Gx. Thủy Nguyên',
    confirmationDate: '20/06/2009',
    confirmationBishop: 'Đức Cha Giuse Vũ Văn Thiên',
    priorEducation: {
      institution: 'Đại học Sư phạm Ngoại ngữ Hà Nội',
      major: 'Sư phạm Tiếng Anh',
      startYear: '2015',
      gradYear: '2019'
    },
    priorEducationList: [
      {
        id: 'edu-2-1',
        degreeType: 'Đại học',
        institution: 'Đại học Sư phạm Ngoại ngữ Hà Nội',
        major: 'Cử nhân Sư phạm Tiếng Anh',
        startYear: '2015',
        gradYear: '2019',
        ranking: 'Xuất sắc',
        notes: 'IELTS 7.5'
      },
      {
        id: 'edu-2-2',
        degreeType: 'Trung cấp',
        institution: 'Trung cấp Y Dược Tuệ Tĩnh',
        major: 'Y học Cổ truyền & Đông Y',
        startYear: '2017',
        gradYear: '2019',
        ranking: 'Giỏi',
        notes: 'Học song song phục vụ bệnh nhân nghèo'
      }
    ],
    associations: ['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên Xứ đoàn'],
    siblingsCount: 2,
    birthOrder: 'Con trưởng trong gia đình 2 anh em',
    familyNotes: 'Gia đình có truyền thống giáo dục, cha mẹ luôn đồng hành trong hành trình tu trì.',
    familyInfo: {
      fatherName: 'Phêrô Trần Văn Hùng',
      fatherBirth: '1968',
      fatherJob: 'Kinh doanh',
      motherName: 'Anna Lê Thị Mai',
      motherBirth: '1971',
      motherJob: 'Giáo viên',
      siblingsCount: 2,
      familyAddress: 'Thủy Đường, Thủy Nguyên, Hải Phòng'
    },
    timeline: [
      { year: 'Dự kiến 2027', title: 'Linh mục', description: 'Chịu chức Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Thực tập Mục vụ', description: 'Giáo xứ Hòa Bình, phụ trách giới trẻ và ban lễ sinh', status: 'current' },
      { year: '2021 - 2023', title: 'Giai đoạn Triết học', description: 'Đạt kết quả xuất sắc', status: 'completed' },
      { year: '15/08/2019', title: 'Nhập Chủng viện', description: 'Khóa 19, Lớp Tu đức', status: 'completed' }
    ],
    grades: {
      philosophy: 8.5,
      theology: 8.6,
      scripture: 8.4,
      latin: 8.0,
      liturgy: 8.7,
      gpa: 8.4
    },
    annualRecords: createDefaultAnnualRecords('Phêrô Trần Văn B', 'Giáo xứ Thủy Nguyên'),
    advisorNote: 'Thầy thể hiện sự năng động và nhiệt thành trong mục vụ giáo xứ, có khả năng sư phạm tốt khi huấn giáo giới trẻ.',
    hasAdvisorReview: true
  },
  {
    id: 'sem-3',
    code: 'CS2021-015',
    fullName: 'Đaminh Lê Văn C',
    saintName: 'Đaminh',
    birthDate: '24/11/1999',
    birthPlace: 'TP. Bắc Ninh',
    phone: '0978 112 233',
    email: 'daminh.levanc@chungvien.edu.vn',
    gmail: 'dominic.levanc99@gmail.com',
    academicYear: 'Khóa 21 (2021-2029)',
    batch: 'Khóa 21',
    admissionYear: '2021',
    graduationYear: '2029',
    seminaryAdmissionYear: '2021',
    seminaryGraduationYear: '2029',
    diocese: 'Bắc Ninh',
    parish: 'Bắc Giang',
    homeParish: 'Giáo xứ Chính Tòa Bắc Ninh',
    admissionParish: 'Giáo xứ Bắc Giang',
    stage: 'Triết II',
    status: 'Nghỉ hè',
    baptismDate: '01/12/1999',
    baptismParish: 'Gx. Chính Tòa Bắc Ninh',
    confirmationDate: '15/08/2011',
    confirmationBishop: 'Đức Cha Cosma Hoàng Văn Đạt',
    priorEducation: {
      institution: 'Đại học Khoa học Xã hội & Nhân văn',
      major: 'Lịch sử Văn hóa',
      startYear: '2017',
      gradYear: '2021'
    },
    associations: ['Ban Giúp lễ', 'Giáo lý viên', 'Ban Lễ tân Giáo xứ'],
    siblingsCount: 4,
    birthOrder: 'Con thứ 3 trong gia đình có 4 anh chị em',
    familyNotes: 'Gia đình đông anh em, thuần nông gắn bó với họ đạo.',
    familyInfo: {
      fatherName: 'Đaminh Lê Văn Thành',
      fatherBirth: '1972',
      fatherJob: 'Thợ kim hoàn',
      motherName: 'Têrêsa Phạm Thị Oanh',
      motherBirth: '1975',
      motherJob: 'Kinh doanh',
      siblingsCount: 4,
      familyAddress: 'Phường Suối Hoa, TP. Bắc Ninh'
    },
    timeline: [
      { year: 'Dự kiến 2029', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm II Triết học', description: 'Đang trong kỳ nghỉ hè mục vụ gia đình', status: 'current' },
      { year: '15/08/2021', title: 'Nhập Chủng viện', description: 'Khóa 21, Lớp Tu đức', status: 'completed' }
    ],
    grades: {
      philosophy: 8.0,
      theology: 7.8,
      scripture: 8.2,
      latin: 7.5,
      liturgy: 8.3,
      gpa: 8.0
    },
    annualRecords: createDefaultAnnualRecords('Đaminh Lê Văn C', 'Giáo xứ Chính Tòa Bắc Ninh'),
    advisorNote: 'Thầy có thái độ học tập cần cù, chăm chỉ, sống đạo đức trầm lắng.',
    hasAdvisorReview: false
  },
  {
    id: 'sem-4',
    code: 'CS2020-001',
    fullName: 'Giuse Trần Văn Minh',
    saintName: 'Giuse',
    birthDate: '09/03/1996',
    birthPlace: 'Thanh Oai, Hà Nội',
    phone: '0983 998 877',
    email: 'giuse.tranvanminh@chungvien.edu.vn',
    gmail: 'joseph.tranvanminh96@gmail.com',
    academicYear: 'Khóa 20 (2020-2028)',
    batch: 'Khóa 20',
    admissionYear: '2020',
    graduationYear: '2028',
    seminaryAdmissionYear: '2020',
    seminaryGraduationYear: '2028',
    diocese: 'Hà Nội',
    parish: 'Gx. Đàn Giản',
    homeParish: 'Giáo xứ Đàn Giản',
    admissionParish: 'Giáo xứ Thạch Bích',
    stage: 'Thần II',
    status: 'Đang học',
    baptismDate: '15/03/1996',
    baptismParish: 'Gx. Đàn Giản',
    confirmationDate: '12/06/2008',
    confirmationBishop: 'Đức Tổng Giuse Ngô Quang Kiệt',
    priorEducation: {
      institution: 'Đại học Luật Hà Nội',
      major: 'Luật Hành chính',
      startYear: '2014',
      gradYear: '2018'
    },
    associations: ['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên', 'Ban Truyền thông Giáo phận'],
    siblingsCount: 2,
    birthOrder: 'Con thứ 2 trong gia đình 2 anh em trai',
    familyNotes: 'Gia đình có chú ruột là linh mục thuộc TGP Hà Nội.',
    timeline: [
      { year: 'Dự kiến 2028', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm II Thần học', status: 'current' },
      { year: '2020', title: 'Nhập Chủng viện', status: 'completed' }
    ],
    grades: {
      philosophy: 8.4,
      theology: 8.5,
      scripture: 9.0,
      latin: 8.6,
      liturgy: 9.1,
      gpa: 8.7
    },
    annualRecords: createDefaultAnnualRecords('Giuse Trần Văn Minh', 'Giáo xứ Đàn Giản'),
    advisorNote: 'Xuất sắc về phân tích thần học và phụng vụ, được ban giám đốc đánh giá cao.',
    hasAdvisorReview: true
  },
  {
    id: 'sem-5',
    code: 'CS2022-008',
    fullName: 'Phêrô Hoàng Tuấn',
    saintName: 'Phêrô',
    birthDate: '18/07/2000',
    birthPlace: 'Kim Sơn, Ninh Bình',
    phone: '0945 678 901',
    email: 'phero.hoangtuan@chungvien.edu.vn',
    gmail: 'peter.hoangtuan2000@gmail.com',
    academicYear: 'Khóa 22 (2022-2030)',
    batch: 'Khóa 22',
    admissionYear: '2022',
    graduationYear: '2030',
    seminaryAdmissionYear: '2022',
    seminaryGraduationYear: '2030',
    diocese: 'Phát Diệm',
    parish: 'Gx. Phát Diệm',
    homeParish: 'Giáo xứ Chính Tòa Phát Diệm',
    admissionParish: 'Giáo xứ Tùng Sơn',
    stage: 'Triết I',
    status: 'Đang học',
    baptismDate: '25/07/2000',
    baptismParish: 'Gx. Phát Diệm',
    confirmationDate: '15/08/2012',
    confirmationBishop: 'Đức Cha Giuse Nguyễn Năng',
    priorEducation: {
      institution: 'Đại học Ngoại Thương',
      major: 'Kinh tế đối ngoại',
      startYear: '2018',
      gradYear: '2022'
    },
    associations: ['Ban Giúp lễ', 'Ca đoàn Cecillia'],
    siblingsCount: 3,
    birthOrder: 'Con út trong gia đình có 3 anh chị em',
    familyNotes: 'Gia đình sinh sống tại xứ đạo Kim Sơn, nếp sống đạo nhiệt thành.',
    timeline: [
      { year: 'Dự kiến 2030', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm I Triết học', status: 'current' },
      { year: '2022', title: 'Nhập Chủng viện', status: 'completed' }
    ],
    grades: {
      philosophy: 7.8,
      theology: 0,
      scripture: 0,
      latin: 7.2,
      liturgy: 8.0,
      gpa: 7.7
    },
    annualRecords: createDefaultAnnualRecords('Phêrô Hoàng Tuấn', 'Giáo xứ Chính Tòa Phát Diệm'),
    advisorNote: 'Cần nỗ lực thêm trong các bài thi tiếng Latin và báo cáo phương pháp luận triết học.',
    hasAdvisorReview: false
  },
  {
    id: 'sem-6',
    code: 'CS2019-012',
    fullName: 'Antôn Lê Văn Vinh',
    saintName: 'Antôn',
    birthDate: '02/02/1995',
    birthPlace: 'Xuân Trường, Nam Định',
    phone: '0934 567 890',
    email: 'anton.levanvinh@chungvien.edu.vn',
    gmail: 'anton.levanvinh95@gmail.com',
    academicYear: 'Khóa 19 (2019-2027)',
    batch: 'Khóa 19',
    admissionYear: '2019',
    graduationYear: '2027',
    seminaryAdmissionYear: '2019',
    seminaryGraduationYear: '2027',
    diocese: 'Bùi Chu',
    parish: 'Gx. Bùi Chu',
    homeParish: 'Giáo xứ Bùi Chu',
    admissionParish: 'Giáo xứ Phú Nhai',
    stage: 'Thần III',
    status: 'Đang học',
    baptismDate: '10/02/1995',
    baptismParish: 'Gx. Bùi Chu',
    confirmationDate: '19/03/2007',
    confirmationBishop: 'Đức Cha Giuse Hoàng Văn Tiệm',
    priorEducation: {
      institution: 'Đại học Y Hà Nội',
      major: 'Y đa khoa',
      startYear: '2013',
      gradYear: '2019'
    },
    associations: ['Ban Giúp lễ', 'Huynh trưởng TNTT', 'Giáo lý viên', 'Ban Y tế Giáo phận'],
    siblingsCount: 3,
    birthOrder: 'Con thứ 2 trong gia đình 3 người con',
    familyNotes: 'Gia đình có truyền thống phục vụ công tác bác ái y tế trong giáo phận.',
    timeline: [
      { year: 'Dự kiến 2027', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm III Thần học', status: 'current' },
      { year: '2019', title: 'Nhập Chủng viện', status: 'completed' }
    ],
    grades: {
      philosophy: 8.9,
      theology: 8.2,
      scripture: 8.0,
      latin: 8.4,
      liturgy: 8.8,
      gpa: 8.5
    },
    annualRecords: createDefaultAnnualRecords('Antôn Lê Văn Vinh', 'Giáo xứ Bùi Chu'),
    advisorNote: 'Đời sống gương mẫu, có kinh nghiệm chăm sóc y tế cho cộng đoàn chủng viện.',
    hasAdvisorReview: true
  },
  {
    id: 'sem-7',
    code: 'CS2020-034',
    fullName: 'Gioan Baotixita Nguyễn Hoàng',
    saintName: 'Gioan Baotixita',
    birthDate: '14/10/1997',
    birthPlace: 'Sơn Tây, Hà Nội',
    phone: '0967 889 900',
    email: 'gioan.nguyenhoang@chungvien.edu.vn',
    gmail: 'john.nguyenhoang97@gmail.com',
    academicYear: 'Khóa 20 (2020-2028)',
    batch: 'Khóa 20',
    admissionYear: '2020',
    graduationYear: '2028',
    seminaryAdmissionYear: '2020',
    seminaryGraduationYear: '2028',
    diocese: 'Hưng Hóa',
    parish: 'Gx. Tuyên Quang',
    homeParish: 'Giáo xứ Sơn Tây',
    admissionParish: 'Giáo xứ Tuyên Quang',
    stage: 'Thần I',
    status: 'Đang học',
    baptismDate: '20/10/1997',
    baptismParish: 'Gx. Tuyên Quang',
    confirmationDate: '01/05/2010',
    confirmationBishop: 'Đức Cha Gioan Maria Vũ Tất',
    priorEducation: {
      institution: 'Đại học Xây Dựng',
      major: 'Kiến trúc & Công trình',
      startYear: '2015',
      gradYear: '2019'
    },
    associations: ['Ban Giúp lễ', 'Ban Kỹ thuật Âm thanh Giáo xứ', 'Giáo lý viên'],
    siblingsCount: 2,
    birthOrder: 'Con trưởng trong gia đình 2 anh em',
    familyNotes: 'Gia đình thuận hòa, cha mẹ tích cực giúp việc xây dựng nhà xứ.',
    timeline: [
      { year: 'Dự kiến 2028', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Năm I Thần học', status: 'current' },
      { year: '2020', title: 'Nhập Chủng viện', status: 'completed' }
    ],
    grades: {
      philosophy: 8.6,
      theology: 8.4,
      scripture: 8.8,
      latin: 8.1,
      liturgy: 9.0,
      gpa: 8.6
    },
    annualRecords: createDefaultAnnualRecords('Gioan Baotixita Nguyễn Hoàng', 'Giáo xứ Sơn Tây'),
    advisorNote: 'Rất tích cực trong các công tác kiến thiết và trang trí phụng vụ lễ lớn.',
    hasAdvisorReview: true
  },
  {
    id: 'sem-8',
    code: 'CS2018-005',
    fullName: 'Micae Đỗ Trọng Nghĩa',
    saintName: 'Micae',
    birthDate: '30/05/1994',
    birthPlace: 'Lý Nhân, Hà Nam',
    phone: '0919 223 344',
    email: 'micae.dotrongnghia@chungvien.edu.vn',
    gmail: 'michael.dotrongnghia94@gmail.com',
    academicYear: 'Khóa 18 (2018-2026)',
    batch: 'Khóa 18',
    admissionYear: '2018',
    graduationYear: '2026',
    seminaryAdmissionYear: '2018',
    seminaryGraduationYear: '2026',
    diocese: 'Hà Nội',
    parish: 'Gx. Vĩnh Trị',
    homeParish: 'Giáo xứ Vĩnh Trị (Hà Nam)',
    admissionParish: 'Giáo xứ Chính Tòa Hà Nội',
    stage: 'Phó tế',
    status: 'Đang học',
    baptismDate: '05/06/1994',
    baptismParish: 'Gx. Vĩnh Trị',
    confirmationDate: '15/08/2006',
    confirmationBishop: 'Đức Tổng Giuse Ngô Quang Kiệt',
    priorEducation: {
      institution: 'Đại học Quốc Gia Hà Nội',
      major: 'Ngôn ngữ & Văn học',
      startYear: '2013',
      gradYear: '2017'
    },
    associations: ['Ban Giúp lễ', 'Huynh trưởng TNTT Cấp III', 'Giáo lý viên Trưởng ban', 'Ban Phụng vụ'],
    siblingsCount: 3,
    birthOrder: 'Con thứ 2 trong gia đình 3 anh em',
    familyNotes: 'Gia đình đạo đức, nề nếp, có người chị đi tu Dòng Mến Thánh Giá.',
    timeline: [
      { year: '12/2025', title: 'Linh mục', status: 'future' },
      { year: 'Hiện tại', title: 'Thầy Phó tế', description: 'Thực thi sứ vụ Lời Chúa và Bàn thờ', status: 'current' },
      { year: '2018', title: 'Nhập Chủng viện', status: 'completed' }
    ],
    grades: {
      philosophy: 9.1,
      theology: 9.3,
      scripture: 9.2,
      latin: 9.0,
      liturgy: 9.5,
      gpa: 9.2
    },
    annualRecords: createDefaultAnnualRecords('Micae Đỗ Trọng Nghĩa', 'Giáo xứ Vĩnh Trị (Hà Nam)'),
    advisorNote: 'Đã hoàn thành xuất sắc các kỳ khảo hạch trước chức thánh.',
    hasAdvisorReview: true
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    code: 'PHIL-101',
    name: 'Triết học Nhận thức',
    instructor: 'Cha Phêrô Nguyễn Văn A',
    level: 'Triết I',
    currentWeek: 12,
    totalWeeks: 16,
    credits: 3,
    semester: 'Học kỳ I (2024-2025)'
  },
  {
    id: 'c-2',
    code: 'SCRIP-201',
    name: 'Kinh Thánh Tân Ước',
    instructor: 'Cha Gioan B. Trần Văn B',
    level: 'Thần II',
    currentWeek: 6,
    totalWeeks: 15,
    credits: 4,
    semester: 'Học kỳ I (2024-2025)'
  },
  {
    id: 'c-3',
    code: 'THEO-301',
    name: 'Thần học Tín lý',
    instructor: 'ĐGM Micae Nguyễn Văn C',
    level: 'Thần III',
    currentWeek: 14,
    totalWeeks: 15,
    credits: 4,
    semester: 'Học kỳ I (2024-2025)'
  },
  {
    id: 'c-4',
    code: 'HIST-202',
    name: 'Lịch sử Giáo hội Việt Nam',
    instructor: 'Cha Phaolô Lê Văn D',
    level: 'Triết II',
    currentWeek: 4,
    totalWeeks: 16,
    credits: 2,
    semester: 'Học kỳ I (2024-2025)'
  },
  {
    id: 'c-5',
    code: 'LITUR-102',
    name: 'Phụng vụ Đại cương & Bí tích',
    instructor: 'Cha Giuse Đỗ Quang H',
    level: 'Triết I',
    currentWeek: 10,
    totalWeeks: 16,
    credits: 3,
    semester: 'Học kỳ I (2024-2025)'
  },
  {
    id: 'c-6',
    code: 'LATIN-101',
    name: 'Tiếng Latinh Phụng vụ',
    instructor: 'Cha Micae Phạm Hồng K',
    level: 'Tu đức',
    currentWeek: 8,
    totalWeeks: 16,
    credits: 2,
    semester: 'Học kỳ I (2024-2025)'
  }
];

export const INITIAL_PASTORALS: PastoralAssignment[] = [
  {
    id: 'p-1',
    locationName: 'Giáo xứ Chính Tòa',
    pastor: 'Cha Xứ: Giuse Phạm Văn E',
    count: 3,
    category: 'Năm Tu Đức',
    type: 'church',
    address: '40 Nhà Chung, Hoàn Kiếm, Hà Nội',
    seminarians: ['Giuse Nguyễn Văn A', 'Đaminh Lê Văn C', 'Gioan B. Nguyễn Hoàng']
  },
  {
    id: 'p-2',
    locationName: 'Giáo xứ Hòa Bình',
    pastor: 'Cha Xứ: Antôn Nguyễn Văn F',
    count: 2,
    category: 'Thực tập Xứ',
    type: 'church',
    address: 'Xã Hòa Bình, Thủy Nguyên, Hải Phòng',
    seminarians: ['Phêrô Trần Văn B', 'Micae Đỗ Trọng Nghĩa']
  },
  {
    id: 'p-3',
    locationName: 'Trung tâm Mục vụ',
    pastor: 'Phụ trách: Cha Đaminh Lê G',
    count: 4,
    category: 'Giáo lý viên',
    type: 'center',
    address: 'Phố Cửa Bắc, Ba Đình, Hà Nội',
    seminarians: ['Giuse Trần Văn Minh', 'Phêrô Hoàng Tuấn', 'Antôn Lê Văn Vinh', 'Phanxicô Xaviê Lê Nam']
  },
  {
    id: 'p-4',
    locationName: 'Giáo xứ Hàm Long',
    pastor: 'Cha Xứ: Giuse Vũ Quang T',
    count: 2,
    category: 'Mục vụ Giới trẻ',
    type: 'church',
    address: '21 Hàm Long, Hoàn Kiếm, Hà Nội',
    seminarians: ['Luka Trần Trọng Đạt', 'Matthêu Vũ Minh Quân']
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'review',
    title: 'Cha Giuse Nguyễn Văn A đã cập nhật nhận xét môn Triết học cho Phêrô Trần Văn B.',
    description: 'Nhận xét giữa kỳ môn Triết học Nhận thức đã được lưu vào học bạ điện tử.',
    time: '2 giờ trước',
    author: 'Cha Giuse Nguyễn Văn A'
  },
  {
    id: 'act-2',
    type: 'announcement',
    title: 'Thông báo mới: Lịch tĩnh tâm tháng 11 đã được cập nhật.',
    description: 'Chủ đề: "Người môn đệ bước theo Thầy Chí Thánh", diễn ra vào Chúa Nhật 10/11.',
    time: 'Hôm qua',
    author: 'Ban Giám đốc'
  },
  {
    id: 'act-3',
    type: 'admission',
    title: 'Đã thêm 15 hồ sơ chủng sinh mới vào danh sách lớp Tu đức.',
    description: 'Hồ sơ khóa 23 niên khóa 2024-2032 đã hoàn tất xác thực từ Tòa Giám mục.',
    time: '3 ngày trước',
    author: 'Văn phòng Đào tạo'
  },
  {
    id: 'act-4',
    type: 'event',
    title: 'Kỳ thi sát hạch ngoại ngữ học kỳ I chuẩn bị bắt đầu.',
    description: 'Thời gian thi: 25/11 đến 28/11 tại Giảng đường Thánh Giuse.',
    time: '5 ngày trước',
    author: 'Ban Khảo thí'
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Tĩnh tâm tháng 11',
    date: '2024-11-10',
    time: '08:00 - 17:00',
    type: 'retreat',
    location: 'Nhà nguyện Chính Tòa',
    description: 'Tĩnh tâm linh thao hàng tháng cho toàn thể quý thầy',
    color: '#875200'
  },
  {
    id: 'ev-2',
    title: 'Họp Ban Giám đốc',
    date: '2024-11-15',
    time: '09:00 - 11:30',
    type: 'meeting',
    location: 'Phòng Hội đồng Đại chủng viện',
    description: 'Đánh giá tiến trình mục vụ và học vụ niên khóa 2024-2025',
    color: '#002045'
  },
  {
    id: 'ev-3',
    title: 'Lễ Các Thánh Tử Đạo Việt Nam',
    date: '2024-11-24',
    time: '05:30 - 07:30',
    type: 'liturgy',
    location: 'Đại giảng đường',
    description: 'Thánh lễ trọng thể Bổn mạng Chủng viện',
    color: '#ba1a1a'
  },
  {
    id: 'ev-4',
    title: 'Báo cáo Mục vụ Học kỳ I',
    date: '2024-11-29',
    time: '14:00 - 16:30',
    type: 'exam',
    location: 'Hội trường Thánh Tôma',
    description: 'Tổng kết hoạt động tông đồ tại các giáo xứ',
    color: '#455f88'
  }
];

export const CLASS_DISTRIBUTION = [
  { class: 'Năm 1', count: 38, percentage: 30, color: '#adc7f7' },
  { class: 'Năm 2', count: 42, percentage: 50, color: '#adc7f7' },
  { class: 'Năm 3', count: 56, percentage: 85, color: '#002045', highlight: true },
  { class: 'Năm 4', count: 48, percentage: 65, color: '#adc7f7' },
  { class: 'Năm 5', count: 36, percentage: 55, color: '#adc7f7' },
  { class: 'Mục vụ', count: 32, percentage: 40, color: '#ffb55c' },
  { class: 'Phó tế', count: 18, percentage: 45, color: '#adc7f7' },
];
