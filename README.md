<div align="center">

<img src="./client/public/favicon.svg" alt="PulseBoard logo" width="80" height="80" />

# PulseBoard

### Live polls

Real-time, self-hostable poll engine. Stream every vote over WebSocket.

<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="React 19" src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Drizzle" src="https://img.shields.io/badge/Drizzle-C5F74F?style=flat-square&logo=drizzle&logoColor=black" />
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white" />
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  
</p>

<p>
  <a href="#-features">Features</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">Tech Stack</a> &nbsp;·&nbsp;
  <a href="#-quick-start">Quick Start</a> &nbsp;·&nbsp;
  <a href="#-environment-variables">Env</a> &nbsp;·&nbsp;
  <a href="#-project-structure">Structure</a>
</p>

</div>

---

## Demo

<div align="center">

<img src="./docs/header-section.png" alt="PulseBoard landing — hero section" width="100%" />

<br /><br />

<table>
<tr>
<td width="50%" align="center"><b>Hero-Section</b></td>
<td width="50%" align="center"><b>Footer</b></td>
</tr>
<tr>
<td width="50%"><img src="./docs/hero-section.png" alt="Floating navbar" width="100%" /></td>
<td width="50%"><img src="./docs/footer.png" alt="Footer" width="100%" /></td>
</tr>
</table>

<br />

<table>
<tr>
<td width="60%" align="center"><b>Live Analytics &amp; Public Results</b></td>
<td width="40%" align="center"><b>Create Poll</b></td>
</tr>
<tr>
<td width="60%">
  <img src="./docs/live-analytics.png" alt="Live analytics with respondents and streaming charts" width="100%" />
  <br /><br />
  <img src="./docs/live-result.png" alt="Public results page after publishing" width="100%" />
</td>
<td width="40%">
  <img src="./docs/poll.png" alt="Create poll form" width="100%" />
</td>
</tr>
</table>

</div>

---

## Features

- **Real-time updates** — every vote arrives in every viewer's browser in roughly `200ms` over a per-poll WebSocket. No `setInterval`, no manual refresh.
- **Anonymous or authenticated** — flip a setting per poll. Anonymous polls need zero respondent signups. Authenticated polls show the creator exactly who voted.
- **Multi-select questions** — mix single-choice, multi-select, and mandatory questions in one poll.
- **Countdown timer** — set an expiry; respondents see a live countdown, the server stops accepting votes at zero.
- **Public results pages** — publish a read-only results URL the audience can keep open.
- **Google sign-in via Clerk** — one-click OAuth alongside email/password.
- **Slug or short code joining** — paste a full link or type a short code on the `/join` page.
- **Built for a hackathon** — open source, self-hostable, free forever. No paid plans.

---

## Tech Stack

### Frontend

- **React 19** + **TanStack Router**
- **Tailwind CSS v4**
- **Socket.io client**
- **Clerk**
- **Vite** + **Bun**

### Backend

- **Bun** + **Express 5**
- **PostgreSQL 17** + **Drizzle ORM**
- **Socket.io**
- **JWT**
- **Clerk**
- **Zod**

---

## Setup Locally

### 1. Clone the repo

```bash
git clone https://github.com/SaurabhRavte/Pulse-board.git
cd Pulse-board
```

### 2. Start Postgres in Docker

The repo ships with a `docker-compose.yml` for a local Postgres instance.

```bash
cd server
bun run docker:up
```

This spins up Postgres on `localhost:5432` with the credentials baked into `docker-compose.yml` (user `postgress`, password `postgress`, database `pulseboard`). Data persists in a Docker volume.

### 3. Set up the server

```bash
# still in server/
cp .env.example .env
bun install
bun run db:push       # push schema to the Postgres in Docker
bun run dev           # start API on http://localhost:3000
```

The `db:push` command uses **Drizzle Kit** to sync the schema in `src/common/db/schema.ts` to your Postgres. Re-run it any time you change the schema.

### 4. Set up the client

In a **second terminal**:

```bash
cd client
cp .env.example .env
bun install
bun run dev           # start Vite on http://localhost:5173
```

Open `http://localhost:5173` in a browser and you're live.

---

## Environment Variables

### `server/.env`

| Variable             | Description                               | Example                                                    |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| `NODE_ENV`           | `development` or `production`             | `development`                                              |
| `PORT`               | API server port                           | `3000`                                                     |
| `CLIENT_ORIGIN`      | Vite origin for CORS                      | `http://localhost:5173`                                    |
| `DATABASE_URL`       | Postgres connection string                | `postgres://postgress:postgress@localhost:5432/pulseboard` |
| `DB_POOL_MAX`        | Max DB connections in pool                | `10`                                                       |
| `JWT_ACCESS_SECRET`  | Random 32+ char secret for access tokens  | `openssl rand -base64 32`                                  |
| `JWT_REFRESH_SECRET` | Random 32+ char secret for refresh tokens | `openssl rand -base64 32`                                  |
| `JWT_ACCESS_TTL`     | Access token lifetime                     | `15m`                                                      |
| `JWT_REFRESH_TTL`    | Refresh token lifetime                    | `7d`                                                       |

Generate secrets quickly:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# or
openssl rand -base64 32
```

### `client/.env`

| Variable                     | Description                      | Example                 |
| ---------------------------- | -------------------------------- | ----------------------- |
| `VITE_API_URL`               | URL of the server                | `http://localhost:3000` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (optional) | `pk_test_...`           |

---

## Project Structure

```
Pulse-board/
├── client/                          # React 19 + TanStack Router + Tailwind v4
│   ├── public/
│   │   └── favicon.svg              # PulseBoard logo as favicon
│   └── src/
│       ├── components/              # Logo, Button, Card, Countdown, ...
│       ├── lib/                     # api client, auth store, sockets, extract-slug
│       ├── routes/                  # file-based routes
│       │   ├── index.tsx            # landing page (bento + FAQ)
│       │   ├── login.tsx
│       │   ├── register.tsx
│       │   ├── join.tsx             # enter code or paste link
│       │   ├── dashboard.tsx        # creator's poll list + paste-link panel
│       │   ├── polls.new.tsx        # create poll
│       │   ├── polls.$pollId.analytics.tsx   # live analytics + respondents
│       │   ├── p.$slug.tsx          # public poll page (vote)
│       │   └── p.$slug_.results.tsx # public results page
│       ├── index.css                # theme tokens + utility classes
│       └── main.tsx
│
├── server/                          # Bun + Express + Drizzle + Socket.io
│   ├── src/
│   │   ├── common/
│   │   │   ├── db/                  # Drizzle schema, queries, migrations
│   │   │   ├── sockets/             # Socket.io setup
│   │   │   ├── middleware/          # auth, error, request-id
│   │   │   └── utils/               # ApiError, ApiResponse
│   │   └── modules/
│   │       ├── auth/                # email + Clerk-sync auth
│   │       ├── polls/               # create, vote, close, publish
│   │       └── analytics/           # creator + public results
│   ├── docker-compose.yml           # Postgres 17 dev DB
│   ├── drizzle.config.ts
│   └── index.ts                     # server entry point
│
└── README.md
```

---

## Scripts

### `server/`

| Command               | What it does                              |
| --------------------- | ----------------------------------------- |
| `bun run dev`         | Start API in watch mode                   |
| `bun run start`       | Start API in production mode              |
| `bun run studio`      | Open Drizzle Studio (DB GUI)              |
| `bun run db:generate` | Generate SQL migration from schema diff   |
| `bun run db:push`     | Push schema to DB without migration files |
| `bun run db:migrate`  | Apply pending migrations                  |
| `bun run docker:up`   | Start Postgres container                  |
| `bun run docker:down` | Stop Postgres container                   |

### `client/`

| Command           | What it does                 |
| ----------------- | ---------------------------- |
| `bun run dev`     | Start Vite dev server        |
| `bun run build`   | Production build to `dist/`  |
| `bun run lint`    | Lint with ESLint             |
| `bun run preview` | Preview the production build |

---

## Try it out

Once the server and client are running:

1. Open `http://localhost:5173` and click **Get started** to register.
2. Click **New poll** in the navbar.
3. Add a question, two or three options, optionally tick **Multi-select** or set an expiry, and hit **Create poll**.
4. You land on the analytics page. Copy the public link with the **Copy** button.
5. Open the public link in an incognito window. Vote on it.
6. Watch the analytics page — your vote shows up in roughly a second without a refresh.
7. Hit **Publish results** when you're ready to share the read-only summary URL.

---

<div align="center">

Built for hackathon by **[Saurabh Ravte](https://github.com/SaurabhRavte)** · © 2026 at chaicode

</div>
