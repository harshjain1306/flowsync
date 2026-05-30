# FlowSync - Full-Stack Next App

This is the standalone Next.js version of FlowSync. It contains both the frontend screens and backend API routes in one app.

## Features

- Landing, login, signup, dashboard, Kanban board, calendar, team, settings, and create flows.
- Internal Next API routes under `/api` for auth, projects, tasks, task status updates, deletes, and demo seeding.
- MongoDB persistence with Mongoose.
- JWT auth using `Authorization: Bearer <token>`.
- Demo users are seeded automatically on first login, or manually through `POST /api/seed`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next will choose the next available port.

## Demo Login

- Admin: `admin@flow.com` / `password123`
- Member: `member@flow.com` / `password123`

The login API ensures demo data exists before authenticating, so no separate Express server or seed command is required.
