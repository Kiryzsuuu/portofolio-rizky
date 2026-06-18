# Portfolio — Rizky Fadhillah

Next.js (App Router) portfolio with a MongoDB-backed CMS. Bilingual (EN/ID),
multi-page routing, and an admin panel for full content editing.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS** + Framer Motion
- **MongoDB Atlas** for content storage
- Auth: username + password (bcrypt) with a signed JWT session cookie (`jose`)

## Pages

- Public: `/`, `/about`, `/projects`, `/experience`, `/education`, `/contact`
- Admin: `/admin` (login at `/admin/login`) — CRUD for site settings, projects,
  experience, education, and skills. Images and the CV are uploaded and stored
  as base64 in the database.

## Local development

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000 (admin at http://localhost:3000/admin).

> If your network/ISP resolver cannot resolve MongoDB Atlas SRV records, set
> `DNS_SERVERS=8.8.8.8,1.1.1.1` in `.env.local`. Not needed on Vercel.

## Environment variables

| Key              | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `MONGODB_URI`    | MongoDB Atlas connection string                              |
| `MONGODB_DB`     | Database name (default `portfolio`)                          |
| `AUTH_SECRET`    | Long random string used to sign session cookies              |
| `ADMIN_USERNAME` | Bootstrap admin username (created on first login if no user) |
| `ADMIN_PASSWORD` | Bootstrap admin password                                     |

The database seeds itself from `lib/defaults.ts` the first time it is read.

## Deploy on Vercel

1. Push to GitHub and import the repo on Vercel (framework auto-detected as Next.js).
2. Add the environment variables above in **Project → Settings → Environment Variables**.
3. In MongoDB Atlas → **Network Access**, allow `0.0.0.0/0` (or Vercel's IPs).
4. Deploy. Log in at `/admin` with your admin credentials.
