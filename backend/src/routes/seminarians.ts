import { Router } from 'express';
import { randomUUID } from 'crypto';
import { sql } from '../db';
import { rowToSeminarian } from '../mappers';
import { asyncHandler } from '../asyncHandler';

export const seminariansRouter = Router();

seminariansRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await sql`select * from seminarians order by created_at desc`;
    res.json(rows.map(rowToSeminarian));
  })
);

seminariansRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const rows = await sql`select * from seminarians where id = ${req.params.id}`;
    if (!rows[0]) return res.status(404).json({ error: 'Không tìm thấy chủng sinh' });
    res.json(rowToSeminarian(rows[0]));
  })
);

seminariansRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const s = req.body ?? {};
    if (!s.fullName || !s.code) {
      return res.status(400).json({ error: 'Thiếu code hoặc fullName' });
    }
    const id = s.id || `sem-${randomUUID()}`;

    const rows = await sql`
      insert into seminarians (
        id, code, full_name, saint_name, birth_date, birth_place, phone, email, gmail,
        avatar_url, academic_year, batch, admission_year, graduation_year,
        seminary_admission_year, seminary_graduation_year, diocese, parish, home_parish,
        admission_parish, stage, status, baptism_date, baptism_parish, confirmation_date,
        confirmation_bishop, prior_education, prior_education_list, associations,
        siblings_count, birth_order, family_notes, family_info, timeline, grades,
        annual_records, advisor_note, has_advisor_review
      ) values (
        ${id}, ${s.code}, ${s.fullName}, ${s.saintName ?? null}, ${s.birthDate ?? null},
        ${s.birthPlace ?? null}, ${s.phone ?? null}, ${s.email ?? null}, ${s.gmail ?? null},
        ${s.avatarUrl ?? null}, ${s.academicYear ?? null}, ${s.batch ?? null},
        ${s.admissionYear ?? null}, ${s.graduationYear ?? null}, ${s.seminaryAdmissionYear ?? null},
        ${s.seminaryGraduationYear ?? null}, ${s.diocese ?? null}, ${s.parish ?? null},
        ${s.homeParish ?? null}, ${s.admissionParish ?? null}, ${s.stage}, ${s.status},
        ${s.baptismDate ?? null}, ${s.baptismParish ?? null}, ${s.confirmationDate ?? null},
        ${s.confirmationBishop ?? null}, ${JSON.stringify(s.priorEducation ?? {})}::jsonb,
        ${JSON.stringify(s.priorEducationList ?? [])}::jsonb, ${JSON.stringify(s.associations ?? [])}::jsonb,
        ${s.siblingsCount ?? null}, ${s.birthOrder ?? null}, ${s.familyNotes ?? null},
        ${JSON.stringify(s.familyInfo ?? {})}::jsonb, ${JSON.stringify(s.timeline ?? [])}::jsonb,
        ${JSON.stringify(s.grades ?? {})}::jsonb, ${JSON.stringify(s.annualRecords ?? [])}::jsonb,
        ${s.advisorNote ?? null}, ${s.hasAdvisorReview ?? false}
      )
      returning *
    `;
    res.status(201).json(rowToSeminarian(rows[0]));
  })
);

seminariansRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const s = req.body ?? {};
    const rows = await sql`
      update seminarians set
        code = ${s.code}, full_name = ${s.fullName}, saint_name = ${s.saintName ?? null},
        birth_date = ${s.birthDate ?? null}, birth_place = ${s.birthPlace ?? null},
        phone = ${s.phone ?? null}, email = ${s.email ?? null}, gmail = ${s.gmail ?? null},
        avatar_url = ${s.avatarUrl ?? null}, academic_year = ${s.academicYear ?? null},
        batch = ${s.batch ?? null}, admission_year = ${s.admissionYear ?? null},
        graduation_year = ${s.graduationYear ?? null},
        seminary_admission_year = ${s.seminaryAdmissionYear ?? null},
        seminary_graduation_year = ${s.seminaryGraduationYear ?? null}, diocese = ${s.diocese ?? null},
        parish = ${s.parish ?? null}, home_parish = ${s.homeParish ?? null},
        admission_parish = ${s.admissionParish ?? null}, stage = ${s.stage}, status = ${s.status},
        baptism_date = ${s.baptismDate ?? null}, baptism_parish = ${s.baptismParish ?? null},
        confirmation_date = ${s.confirmationDate ?? null}, confirmation_bishop = ${s.confirmationBishop ?? null},
        prior_education = ${JSON.stringify(s.priorEducation ?? {})}::jsonb,
        prior_education_list = ${JSON.stringify(s.priorEducationList ?? [])}::jsonb,
        associations = ${JSON.stringify(s.associations ?? [])}::jsonb,
        siblings_count = ${s.siblingsCount ?? null}, birth_order = ${s.birthOrder ?? null},
        family_notes = ${s.familyNotes ?? null}, family_info = ${JSON.stringify(s.familyInfo ?? {})}::jsonb,
        timeline = ${JSON.stringify(s.timeline ?? [])}::jsonb, grades = ${JSON.stringify(s.grades ?? {})}::jsonb,
        annual_records = ${JSON.stringify(s.annualRecords ?? [])}::jsonb,
        advisor_note = ${s.advisorNote ?? null}, has_advisor_review = ${s.hasAdvisorReview ?? false},
        updated_at = now()
      where id = ${req.params.id}
      returning *
    `;
    if (!rows[0]) return res.status(404).json({ error: 'Không tìm thấy chủng sinh' });
    res.json(rowToSeminarian(rows[0]));
  })
);

seminariansRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await sql`delete from seminarians where id = ${req.params.id}`;
    res.status(204).end();
  })
);
