# VisionCare Eye Hospital Management System

## 🏥 Project Goal
Rebuild the existing single-page VisionCare prototype into a production-grade, multi-page, full-stack hospital management web application for an ophthalmology center. Every navbar item must route to a real, distinct page (not an anchor scroll). All data must come from a real backend/database, not hardcoded arrays.

### 1. Tech Stack
- **Frontend:** React (Vite) + React Router v6 (real routes, not hash anchors)
- **Styling:** Tailwind CSS — dark theme, `#0B1120` background, `#18E0FF` cyan accent, glassmorphism cards
- **Animation:** Framer Motion for page transitions, modal entrances, hover states
- **Icons:** Lucide React
- **State/Data fetching:** React Query (TanStack Query) for server state, caching, loading/error states
- **Backend:** Node.js + Express (or NestJS) REST API
- **Database:** PostgreSQL (via Prisma ORM) — relational data (departments → doctors → availability is naturally relational)
- **Auth:** JWT-based auth with bcrypt password hashing, httpOnly cookies for session, role-based access (admin vs public)
- **Deployment-ready:** `.env` config for DB URL, JWT secret; separate `/client` and `/server` folders or monorepo structure

### 2. Required Pages (Real Routes)
| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, stats, featured departments, CTA |
| `/about` | About Hospital | History, mission, accreditation, facility photos |
| `/departments` | Eye Departments | Full grid of all 9 departments, filterable/searchable |
| `/departments/:slug` | Department Detail | Department info + doctors in that department + available slots |
| `/doctors` | Doctors | Full searchable/filterable roster of all doctors (by specialty, availability) |
| `/doctors/:id` | Doctor Profile | Bio, contact, schedule, book-appointment CTA |
| `/services` | Services | LASIK, cataract surgery, diagnostics, etc. with descriptions |
| `/contact` | Contact | Contact form (saves to DB / sends email), map, hours |
| `/appointments/book` | Book Appointment | Public-facing booking form → writes to DB, pending admin approval |
| `/admin/login` | Admin Login | Secure login form |
| `/admin/dashboard` | Admin Dashboard | Protected route — manage departments, doctors, appointments |

Use a shared `<Layout>` component (Navbar + Footer) wrapping all routes via `<Outlet />`, so the navbar/footer don't re-render on every navigation, only the page content swaps with a Framer Motion fade/slide transition.

### 3. Database Schema (Prisma models, minimum viable)
- `Department` — id, name, slug, icon, description, doctorCount (derived)
- `Doctor` — id, name, email, phone, specialty, departmentId (FK), bio, photoUrl, isAvailable
- `Appointment` — id, patientName, patientEmail, patientPhone, doctorId (FK), departmentId (FK), preferredDate, status (pending/confirmed/rejected), createdAt
- `Admin` — id, username, passwordHash, role
- `ContactMessage` — id, name, email, message, createdAt

### 4. Core Functional Requirements
- **Real navigation:** clicking any navbar item must call `navigate()` / `<Link>` to a different route, with the URL changing and browser back/forward working correctly.
- **Department pages:** dynamic data fetched from `GET /api/departments` and `GET /api/departments/:slug` — no hardcoded doctor counts.
- **Doctor roster:** dynamically aggregated from the database via `GET /api/doctors`, with query params for filtering by department/availability.
- **Appointment booking:** public form posts to `POST /api/appointments`; admin dashboard lists pending appointments with accept/reject actions (`PATCH /api/appointments/:id`).
- **Admin auth:** `POST /api/auth/login` validates against hashed password in DB (never hardcode credentials in frontend code), returns JWT, protects `/admin/*` routes via an `<ProtectedRoute>` wrapper that checks auth state.
- **Loading & error states:** every data-fetching page must show skeleton loaders and graceful error messages — no blank screens.
- **Form validation:** booking and contact forms validated client-side (e.g. with `zod` + `react-hook-form`) and server-side.
- **Responsive design:** fully usable on mobile, tablet, desktop — current design is desktop-only and needs breakpoints.

### 5. UI/UX Standards (carry over from existing design)
- Keep the dark glassmorphism aesthetic, `#18E0FF` glow accents, pulsating hero orbs, and card hover states already established.
- Page transitions: subtle fade/slide via Framer Motion `AnimatePresence` on route change.
- Modals (e.g. department detail, doctor quick-view) should use glassmorphism overlays with backdrop blur, not full page navigation, where it makes sense for quick previews — but full pages for primary content.

### 6. Non-Negotiables / Quality Bar
- No mock/static arrays left in production components — all data DB-backed.
- No hardcoded admin credentials in client-side code or repo (must be seeded server-side, hashed).
- Proper error boundaries and 404 page for unmatched routes.
- Environment variables for all secrets/connection strings.
- Code split by route (lazy-loaded pages) for performance.
