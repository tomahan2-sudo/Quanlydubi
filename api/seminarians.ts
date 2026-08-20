import { sql } from '@vercel/postgres';
import { rowToSeminarian } from './_lib/mappers';

function parseBody(req: any) {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`select * from seminarians order by created_at desc`;
      return res.status(200).json(rows.map(rowToSeminarian));
    }

    if (req.method === 'POST') {
      const s = parseBody(req);
      if (!s.id || !s.fullName || !s.code) {
        return res.status(400).json({ error: 'Thiếu id, code hoặc fullName' });
      }

      const { rows } = await sql`
        insert into seminarians (
          id, code, full_name, saint_name, birth_date, birth_place, phone, email, gmail,
          avatar_url, academic_year, batch, admission_year, graduation_year,
          seminary_admission_year, seminary_graduation_year, diocese, parish, home_parish,
          admission_parish, stage, status, baptism_date, baptism_parish, confirmation_date,
          confirmation_bishop, prior_education, prior_education_list, associations,
          siblings_count, birth_order, family_notes, family_info, timeline, grades,
          annual_records, advisor_note, has_advisor_review, updated_at
        ) values (
          ${s.id}, ${s.code}, ${s.fullName}, ${s.saintName ?? null}, ${s.birthDate ?? null},
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
          ${s.advisorNote ?? null}, ${s.hasAdvisorReview ?? false}, now()
        )
        on conflict (id) do update set
          code = excluded.code, full_name = excluded.full_name, saint_name = excluded.saint_name,
          birth_date = excluded.birth_date, birth_place = excluded.birth_place, phone = excluded.phone,
          email = excluded.email, gmail = excluded.gmail, avatar_url = excluded.avatar_url,
          academic_year = excluded.academic_year, batch = excluded.batch,
          admission_year = excluded.admission_year, graduation_year = excluded.graduation_year,
          seminary_admission_year = excluded.seminary_admission_year,
          seminary_graduation_year = excluded.seminary_graduation_year, diocese = excluded.diocese,
          parish = excluded.parish, home_parish = excluded.home_parish,
          admission_parish = excluded.admission_parish, stage = excluded.stage, status = excluded.status,
          baptism_date = excluded.baptism_date, baptism_parish = excluded.baptism_parish,
          confirmation_date = excluded.confirmation_date, confirmation_bishop = excluded.confirmation_bishop,
          prior_education = excluded.prior_education, prior_education_list = excluded.prior_education_list,
          associations = excluded.associations, siblings_count = excluded.siblings_count,
          birth_order = excluded.birth_order, family_notes = excluded.family_notes,
          family_info = excluded.family_info, timeline = excluded.timeline, grades = excluded.grades,
          annual_records = excluded.annual_records, advisor_note = excluded.advisor_note,
          has_advisor_review = excluded.has_advisor_review, updated_at = now()
        returning *
      `;
      return res.status(200).json(rowToSeminarian(rows[0]));
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) return res.status(400).json({ error: 'Thiếu id' });
      await sql`delete from seminarians where id = ${id}`;
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[api/seminarians]', err);
    return res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
