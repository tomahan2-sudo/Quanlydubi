# Quản lý Chủng sinh — Seminarian Management System

Ứng dụng quản lý hồ sơ chủng sinh, đào tạo, mục vụ và lịch của Đại Chủng viện.

## Kiến trúc: 2 project tách biệt hoàn toàn

```
frontend/   React 19 + Vite + Tailwind — deploy thành 1 Vercel project riêng (static site)
backend/    Express API + Vercel Postgres (Neon) — deploy thành 1 Vercel project riêng
```

Hai project có **URL riêng biệt**, deploy độc lập, giao tiếp qua HTTP (frontend gọi backend bằng
`fetch`, backend cho phép bằng CORS). Không dùng chung build, không dùng chung domain.

- **Backend không có đăng nhập/phân quyền thật** (theo quyết định hiện tại) — bất kỳ ai gọi được
  API đều có toàn quyền đọc/ghi dữ liệu. Xem `frontend/src/components/SettingsView.tsx` để biết
  định hướng phân quyền tương lai.
- Nếu frontend không gọi được backend (chưa cấu hình `VITE_API_URL`, backend chưa deploy, hoặc
  chưa gắn database), ứng dụng **tự động rơi về chế độ cục bộ**: dùng dữ liệu mẫu và lưu tạm vào
  `localStorage` — không mất chức năng, chỉ mất phần dùng chung nhiều thiết bị/người dùng.

## 1. Backend (`backend/`)

### Chạy local

```bash
cd backend
npm install
cp .env.example .env.local   # rồi điền POSTGRES_URL thật vào
npm run dev                   # http://localhost:4000
```

### Deploy lên Vercel

1. **Vercel Dashboard** → **Add New → Project** → Import repo, chọn **Root Directory = `backend`**.
2. Deploy xong sẽ có URL dạng `https://<tên-project>.vercel.app`.
3. **Gắn database**: project này → tab **Storage** → **Create Database** → **Postgres (Neon)** →
   gói **Free** → **Connect**. Vercel tự thêm biến môi trường `POSTGRES_URL`.
4. **Khởi tạo schema**: **Storage** → chọn DB → **Query**, dán nội dung
   [`backend/db/migration.sql`](backend/db/migration.sql) và chạy (chỉ 1 lần).
5. **Cấu hình CORS**: project → **Settings → Environment Variables** → thêm
   `ALLOWED_ORIGINS` = URL của frontend (ví dụ `https://quanlydubi-frontend.vercel.app`), có thể
   liệt kê nhiều origin cách nhau bởi dấu phẩy (thêm cả `http://localhost:3000` nếu muốn chạy
   frontend local gọi vào backend production). Redeploy sau khi thêm biến môi trường.

### Cấu trúc

```
backend/
  api/index.ts        # entry point Vercel Serverless Function — export Express app
  src/app.ts           # Express app: CORS, JSON body parser, mount router, error handler
  src/db.ts             # kết nối Postgres qua @neondatabase/serverless
  src/mappers.ts         # map cột DB (snake_case) <-> JSON API (camelCase)
  src/routes/*.ts         # REST đầy đủ: GET / , GET /:id , POST / , PUT /:id , DELETE /:id
  src/local-server.ts       # entry point khi chạy `npm run dev` / `npm start` (Express thường)
  db/migration.sql           # schema Postgres — chạy 1 lần
```

## 2. Frontend (`frontend/`)

### Chạy local

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000 — chạy được ngay cả khi chưa có backend (chế độ cục bộ)
```

Để frontend local gọi vào backend (local hoặc production), tạo `frontend/.env.local`:

```
VITE_API_URL="http://localhost:4000"
```

### Deploy lên Vercel

1. **Vercel Dashboard** → **Add New → Project** → Import cùng repo, chọn **Root Directory =
   `frontend`** (project **khác** với project backend ở trên).
2. **Settings → Environment Variables** → thêm `VITE_API_URL` = URL backend đã deploy (ví dụ
   `https://quanlydubi-backend.vercel.app`, **không** có dấu `/` ở cuối).
3. Deploy. Nhớ quay lại backend, thêm URL frontend này vào `ALLOWED_ORIGINS` (bước CORS ở trên).

## Ghi chú

- `db/migration.sql` chỉ chạy 1 lần lúc khởi tạo — mọi thay đổi schema sau này cần migration mới,
  không sửa trực tiếp file cũ.
- Vì 2 project deploy độc lập, mỗi lần push code lên `main`, **cả 2** sẽ tự động build & deploy lại
  (Vercel Git integration theo dõi cả repo, mỗi project chỉ build phần `Root Directory` của nó).
