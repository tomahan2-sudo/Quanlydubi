# Quản lý Chủng sinh — Seminarian Management System

Ứng dụng React (Vite) quản lý hồ sơ chủng sinh, đào tạo, mục vụ và lịch của Đại Chủng viện.

## Kiến trúc

- **Frontend**: React 19 + Vite + Tailwind, toàn bộ trong `src/`.
- **Backend**: Vercel Serverless Functions trong `api/*.ts`, kết nối **Vercel Postgres (Neon)** qua gói `@vercel/postgres`. Trình duyệt **không bao giờ** kết nối thẳng tới Postgres — connection string chỉ tồn tại phía server (env var `POSTGRES_URL` do Vercel tự inject), nên an toàn để deploy công khai.
- **Không có đăng nhập/phân quyền thật** (theo quyết định hiện tại) — ai mở app cũng có toàn quyền sửa dữ liệu. Xem `src/components/SettingsView.tsx` để biết định hướng phân quyền tương lai.
- Nếu `/api/*` không phản hồi được (chưa deploy lên Vercel, hoặc chưa gắn database), ứng dụng tự động rơi về **chế độ cục bộ**: dùng dữ liệu mẫu trong `src/mockData.ts` và lưu tạm vào `localStorage` của trình duyệt — không mất chức năng, chỉ mất phần dùng chung nhiều thiết bị.

## Chạy local (chỉ frontend, không cần database)

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. App chạy ở chế độ cục bộ (banner cam sẽ hiện ra).

## Chạy local đầy đủ (có `/api` + database thật)

Cần Vercel CLI:

```bash
npm install -g vercel
vercel link          # liên kết thư mục này với project Vercel
vercel env pull .env.local   # tải POSTGRES_URL và các biến môi trường về máy
vercel dev            # chạy cả frontend lẫn /api trên cùng 1 cổng
```

## Deploy lên Vercel + gắn Database

1. **Tạo database**: Vercel Dashboard → chọn project → tab **Storage** → **Create Database** → chọn **Postgres (Neon)** → gói **Free** → **Connect** vào project này. Vercel sẽ tự động thêm biến môi trường `POSTGRES_URL` (và vài biến liên quan) cho cả 3 môi trường Production/Preview/Development.

2. **Khởi tạo schema**: mở tab **Storage** → chọn database vừa tạo → **Query** (SQL editor), dán toàn bộ nội dung file [`db/migration.sql`](db/migration.sql) và chạy. Chỉ cần chạy **một lần**.

3. **Deploy**: push code lên nhánh chính, Vercel sẽ tự build (`npm run build`) và deploy — cả frontend (Vite) lẫn các hàm trong `api/*.ts` (Vercel tự nhận diện thư mục `api/` làm Serverless Functions, không cần cấu hình thêm).

4. Sau khi deploy xong và database đã có schema, mở lại app — banner cảnh báo sẽ biến mất, nghĩa là đã kết nối Postgres thành công và dữ liệu giờ dùng chung được cho mọi thiết bị/người dùng.

## Cấu trúc thư mục quan trọng

```
api/                     # Serverless Functions (backend) — mỗi file = 1 endpoint
  _lib/mappers.ts         # map giữa cột DB (snake_case) và kiểu TS (camelCase)
  seminarians.ts          # GET (list) / POST (upsert) / DELETE (?id=)
  courses.ts, pastorals.ts, events.ts, activities.ts, settings.ts
db/migration.sql          # Schema Postgres — chạy 1 lần trong Vercel Storage Query
src/
  lib/api.ts              # fetch wrapper phía client gọi tới /api/*
  components/              # UI
```
