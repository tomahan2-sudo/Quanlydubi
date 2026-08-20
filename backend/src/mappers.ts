// Maps between DB rows (snake_case columns, JSONB blobs) and the API's
// camelCase JSON shapes (mirrors the frontend's src/types.ts). Nested JSONB
// blobs are stored pre-shaped as camelCase already, so they pass through
// untouched.

export function rowToSeminarian(row: any) {
  return {
    id: row.id,
    code: row.code,
    fullName: row.full_name,
    saintName: row.saint_name,
    birthDate: row.birth_date,
    birthPlace: row.birth_place,
    phone: row.phone,
    email: row.email,
    gmail: row.gmail,
    avatarUrl: row.avatar_url,
    academicYear: row.academic_year,
    batch: row.batch,
    admissionYear: row.admission_year,
    graduationYear: row.graduation_year,
    seminaryAdmissionYear: row.seminary_admission_year,
    seminaryGraduationYear: row.seminary_graduation_year,
    diocese: row.diocese,
    parish: row.parish,
    homeParish: row.home_parish,
    admissionParish: row.admission_parish,
    stage: row.stage,
    status: row.status,
    baptismDate: row.baptism_date,
    baptismParish: row.baptism_parish,
    confirmationDate: row.confirmation_date,
    confirmationBishop: row.confirmation_bishop,
    priorEducation: row.prior_education ?? {},
    priorEducationList: row.prior_education_list ?? [],
    associations: row.associations ?? [],
    siblingsCount: row.siblings_count ?? undefined,
    birthOrder: row.birth_order,
    familyNotes: row.family_notes,
    familyInfo: row.family_info ?? undefined,
    timeline: row.timeline ?? [],
    grades: row.grades ?? {},
    annualRecords: row.annual_records ?? [],
    advisorNote: row.advisor_note,
    hasAdvisorReview: row.has_advisor_review ?? false,
  };
}

export function rowToCourse(row: any) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    instructor: row.instructor,
    level: row.level,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
    credits: row.credits,
    semester: row.semester,
  };
}

export function rowToPastoral(row: any) {
  return {
    id: row.id,
    locationName: row.location_name,
    pastor: row.pastor,
    count: row.count,
    category: row.category,
    type: row.type,
    address: row.address,
    seminarians: row.seminarians ?? [],
  };
}

export function rowToEvent(row: any) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    type: row.type,
    location: row.location,
    description: row.description,
    color: row.color,
  };
}

export function rowToActivity(row: any) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    time: row.time,
    author: row.author,
    icon: row.icon,
  };
}

export function rowToSettings(row: any) {
  return {
    seminaryName: row.seminary_name,
    rectorName: row.rector_name,
    diocese: row.diocese,
    address: row.address,
    currentYear: row.current_year,
  };
}
