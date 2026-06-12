# 🏥 MediCore — Hospital Management System

A modern, production-ready **Hospital Management System** built as a startup-grade SaaS dashboard.
Role-based access for **Admin, Doctor, Receptionist, Patient**, with analytics, appointments,
payments, and a fully separate **C++ OOP backend** for offline record processing.

> React 19 · Vite · Tailwind · React Router · Recharts · React Hook Form · Lucide · Supabase (Postgres + Auth + RLS) · C++17

---

## ✨ Features

- **Auth** — login, signup, forgot-password, role-based routing
- **Admin** — dashboard analytics, manage doctors / patients / appointments / departments, reports
- **Doctor** — view appointments & patient history, update records
- **Receptionist** — register patients, book appointments, manage schedules, search records
- **Patient** — book & view appointments and doctor info
- **Dashboard cards** — total patients, doctors, appointments, today's appointments, revenue
- **Charts** — monthly patients, appointment trends, department statistics
- **Extras** — search & filtering, pagination, CSV export, notifications,
  dark mode, loading states, error handling, toast messages
- **Premium UI** — black / navy / glassmorphism, fully responsive (mobile, tablet, desktop)

---

## 📁 Folder Structure

```
hms/
├── database/                 # Supabase SQL (run in this order)
│   ├── schema.sql            # tables, enums, PK/FK, constraints, indexes, triggers
│   └── rls_policies.sql      # Row Level Security policies
├── cpp-backend/              # standalone C++ OOP module
│   ├── person.*  doctor.*  patient.*
│   ├── appointment.*  prescription.*  hospital.*
│   ├── main.cpp              # console demo
│   └── Makefile
├── src/
│   ├── components/           # ui/ + layout/ + ProtectedRoute
│   ├── context/              # Auth, Theme
│   ├── hooks/                # useToast, usePagination
│   ├── lib/supabase.js
│   ├── services/             # doctor / patient / appointment / prescription / department / dashboard
│   ├── pages/                # Login, Register, Dashboard, Doctors, Patients, ...
│   ├── utils/                # exportCsv, generatePdf
│   ├── App.jsx  main.jsx  index.css
├── .env.example
├── index.html  package.json  vite.config.js  tailwind.config.js
└── README.md
```

---

## 🚀 Quick Start (Frontend)

```bash
# 1. install
npm install

# 2. configure environment
cp .env.example .env
#    then edit .env with your Supabase project values:
#    VITE_SUPABASE_URL=https://xxxx.supabase.co
#    VITE_SUPABASE_ANON_KEY=eyJhb...

# 3. run dev server
npm run dev          # http://localhost:5173

# build for production
npm run build
npm run preview
```

> Add credentials to unlock auth and live Supabase data.

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the scripts **in order**:
   1. `database/schema.sql`
   2. `database/rls_policies.sql`
3. Copy your **Project URL** and **anon public key** (Settings → API) into `.env`.
4. Auth → enable **Email** provider. New signups auto-create a `users` profile row via the
   `handle_new_user` trigger; the role is taken from signup metadata (defaults to `patient`).

---

## 🧱 C++ Backend

A self-contained OOP module demonstrating **inheritance, encapsulation, polymorphism,
file handling, STL, and exception handling**.

```bash
cd cpp-backend
make run        # compiles with g++ -std=c++17 and runs the demo
make clean      # remove build artifacts
```

`main.cpp` exercises full CRUD on the `Hospital` aggregate, polymorphic `describe()`,
persistence via `saveToFile` / `loadFromFile`, and a custom `NotFoundException`.

---

## ☁️ Deployment

**Vercel / Netlify (recommended):**
- Build command: `npm run build`
- Output directory: `dist`
- Add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project settings.
- SPA routing: add a rewrite of all routes → `/index.html`
  (Vercel: `vercel.json` rewrites · Netlify: `_redirects` with `/* /index.html 200`).

### Ready-to-deploy files added
- `vercel.json` — rewrite rule for SPA routing (Vercel)
- `public/_redirects` — Netlify SPA redirect rule

### Deployment checklist
- Ensure env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your hosting provider.
- Do NOT commit any real credentials to the repo — use the provider's env var settings.
- Build locally to verify before deploying:
```bash
cd hms/hms
npm install
npm run build
```

### Windows C++ helper
There are npm helpers to build/run the C++ demo on Windows (requires `g++` in PATH):
```bash
# from project root (hms/hms)
npm run cpp:build:win   # compile with g++
npm run cpp:win         # build then run demo
npm run cpp:clean:win   # remove built exe
```

The C++ backend is a local/offline demo and is not part of the frontend deployment pipeline. If you want to run the C++ demo on a server, build a separate artifact and deploy it to an appropriate server/VM/container.

---

## 🔐 Roles

| Role          | Access |
|---------------|--------|
| admin         | everything: doctors, patients, appointments, departments, reports |
| doctor        | appointments, patient history |
| receptionist  | patients, appointments, scheduling, search |
| patient       | own appointments & booking |

---

## 🧪 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 19, Vite 6, React Router 7, Tailwind 3 |
| UI        | Lucide icons, Recharts, React Hook Form, glassmorphism |
| Backend   | C++17 (OOP), Supabase Postgres |
| Auth/DB   | Supabase Auth + Row Level Security |
| Export    | CSV (records) |

---

Built as a college mini-project that looks like a real product. 🩺
