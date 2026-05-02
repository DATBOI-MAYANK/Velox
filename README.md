# Velox

> Resolution at the speed of AI.

Velox is a customer-support workspace with a public AI chat, an agent console for tickets/escalations, and an admin panel for analytics, knowledge base, FAQ, reports, agents and settings.

This README is the one-stop guide for anyone joining the project — frontend, backend, or first-day onboarding.

---

## 0. TL;DR — where we are right now

- ✅ **Frontend is feature-complete**, fully responsive (desktop + tablet + mobile down to 360px), production build passes, 0 lint/type errors.
- ✅ **All UI is wired** to typed services + React Query hooks. Today it talks to MSW mocks; flip one env flag and it talks to your real backend.
- ✅ **Backend has scaffolding** (DB, Redis, JWT, error handler) but `server.js` is still empty — the backend dev's job is to bootstrap Express, build the domain modules, and emit the documented socket events.
- 🔜 **Future UI work** (post-handoff): more sections on the marketing Home page (testimonials, pricing, integrations, FAQ, footer-CTA) — Home is already broken into discrete sections so new ones drop in cleanly.

If you only read one section, read **§5 End-to-end request flow** and **§6 API & socket contract**.

---

## 1. Repository layout

```
Velox-main/
├── frontend/   # React 18 + Vite SPA — feature-complete UI, mocked API
├── backend/    # Node + Express scaffolding — DB / Redis / JWT helpers in place, routes still to build
└── README.md
```

The two apps are independent npm packages. Frontend talks to backend over `/api` (HTTP) and `/socket.io` (websocket). In dev, Vite proxies both to `http://localhost:5000`.

---

## 2. Quick start

### 2.1 Frontend (works today against mocks)
```bash
cd frontend
npm install
cp .env.example .env        # leave VITE_USE_MOCK=true for now
npm run dev                 # http://localhost:5173
```
Login screen accepts any email + password. Pick **Agent** or **Admin** to enter the matching workspace.

### 2.2 Backend (skeleton)
```bash
cd backend
npm install
cp .env.example .env        # fill MongoDB / Redis / JWT secrets
# server.js is empty — backend dev needs to bootstrap express here.
```

### 2.3 Switch frontend to the real backend
1. Implement the API contract in §6.
2. Run backend on `http://localhost:5000`.
3. In `frontend/.env` set `VITE_USE_MOCK=false`.
4. Restart `npm run dev`. No frontend code changes needed.

---

## 3. What is already done

### Frontend — feature-complete UI ✅
| Area | Pages |
|---|---|
| Public | Home (`/`), AI Chat (`/chat`), Login (`/login`), Register (`/register`) |
| Agent | Agent Dashboard (`/agent`) — tickets list + thread + AI copilot |
| Admin | Admin Panel (`/admin`), Agents (`/admin/agents`), Analytics (`/admin/analytics`), Knowledge Base (`/admin/knowledge-base`), FAQ (`/admin/faq`), Reports (`/admin/reports`), Settings (`/admin/settings`) |

Includes:
- Awwwards-grade design system (cream/lilac/mint/mustard/pink palette, glass cards, jewel-tone banner).
- Working light / dark / system theme picker, persisted to `localStorage`.
- Role-aware sidebar + protected routes (admin vs agent).
- MSW mock layer covering every endpoint the UI calls — UI is fully usable without a backend.

### Frontend — fully mobile responsive ✅
- **Sidebar** → off-canvas drawer on mobile (backdrop, ESC to close, body scroll-lock).
- **Topbar** → compact layout with hamburger; logo / status badges collapse to icons.
- **AgentDashboard** → Gmail-style **single-view pattern** on mobile: list ↔ chat ↔ details with a back arrow. Three-pane desktop layout preserved at `lg+`.
- **Chat** → mobile composer (icons collapse), condensed header, scrollable transcript.
- **Stats capsules** → horizontal scroll inside the pill instead of orphan-wrapping.
- **Login / Register / Home / Admin / Analytics / KB / FAQ / Reports / Settings** all verified at 375px width.

### Frontend — functional topbar utilities ✅
- 🔔 **NotificationsMenu** (`@components/NotificationsMenu.jsx`) — dropdown panel with unread dot, per-item dismiss, mark-all-read, click-to-navigate, mobile-friendly fixed positioning. Currently backed by a `useMockNotifications` hook; **swap the hook for a real React Query hook** when the API in §6.5 is live.
- ❓ **HelpMenu** (`@components/HelpMenu.jsx`) — Documentation, Keyboard shortcuts (also bound to the `?` key), Contact support, Send feedback, What's new. External links can be repointed to your real docs / changelog without UI changes.

### Frontend — backend-readiness wiring ✅
- Axios client with `Authorization: Bearer …` interceptor + automatic 401 → `/auth/refresh` retry queue (`frontend/src/api/client.js`).
- Per-domain service modules and centralized React Query keys (`frontend/src/api/services/`, `frontend/src/api/queryKeys.js`).
- React Query hooks ready for components to consume (`frontend/src/api/hooks/`).
- `Login.jsx` calls `auth.login()` (real service, not a stub).
- `authStore` mirrors the access token to `localStorage.velox.accessToken` so the axios interceptor and the socket client both pick it up.
- Sidebar logout calls `auth.logout()` (best-effort) before clearing local state.
- Socket.io client with token-aware auth + mock fallback (`frontend/src/realtime/socket.js`).
- Vite proxy: `/api → :5000`, `/socket.io → :5000`.

### Backend — scaffolding ✅
- Mongoose connector with retry/backoff (`backend/src/config/db.js`).
- Redis client via ioredis (`backend/src/config/redis.js`).
- `ApiError` class + global error handler middleware (`backend/src/middleware/errorHandler.middleware.js`).
- JWT sign/verify helpers, access + refresh, issuer/audience baked in (`backend/src/utils/generateToken.js`).
- Folders for `controllers`, `routes`, `services`, `models`, `validators`, `jobs`, `hooks`, `constants` (currently empty).

---

## 4. What is left for the backend developer

### 4.1 Wire up the server (priority 1)
- [ ] `backend/src/server.js` is **empty**. Bootstrap express:
  - `dotenv/config`, `helmet()`, `cors({ origin: FRONTEND_URL, credentials: true })`, `express.json()`, `cookie-parser`, `express-async-errors`.
  - Mount routers under `/api/...`.
  - Attach `errorHandler` last.
  - `app.listen(PORT)` — choose `5000` to match the Vite proxy default.
- [ ] `backend/src/config/env.js` is **empty**. Centralize env reads + validation.
- [ ] Add `PORT` to `.env.example`.

### 4.2 Fix existing bugs
- [ ] `backend/src/middleware/rateLimiter.middleware.js`:
  - `async (req, res, next) {` → `async (req, res, next) => {`
  - `redis.expire(60)` → `redis.expire(key, 60)`
  - `import { redis } from "../config/redis";` → `"../config/redis.js"`
- [ ] `backend/src/config/redis.js`: error handler refs undefined `error` — change to `(err) => console.log(err)`.

### 4.3 Build the domain
For each area below, create `models/*.model.js`, `validators/*.validator.js`, `services/*.service.js`, `controllers/*.controller.js`, `routes/*.routes.js`. Mount in `server.js` under `/api`.

- [ ] `auth` — login / logout / refresh / me. Refresh token in **httpOnly cookie**. Use `generateToken.js`.
- [ ] `tickets` — CRUD + assign + resolve.
- [ ] `chat` — messages, sessions, escalate, AI suggest.
- [ ] `agents` — CRUD + invite + status.
- [ ] `kb` — articles + categories + search.
- [ ] `faq` — CRUD.
- [ ] `analytics` — overview / trends / agent perf / CSAT / channels / AI deflection.
- [ ] `reports` — CRUD + export.
- [ ] `settings` — workspace / profile / notifications / security.

### 4.4 Realtime
- [ ] Initialize a `socket.io` server on the same HTTP server.
- [ ] Verify the JWT from `socket.handshake.auth.token`.
- [ ] Emit the events listed in §6.4 when domain events occur.

---

## 5. End-to-end request flow

```
User clicks "Login"
  → Login.jsx calls authService.login({ email, password, role })
  → axios POST /api/auth/login   (Vite dev proxy forwards to :5000)
  → Backend verifies credentials, signs JWT pair
       • access token  → JSON body
       • refresh token → Set-Cookie (httpOnly, Secure, SameSite=Lax)
  → Frontend: setAuth({ user, accessToken })
       • zustand store updated, persisted under "velox.auth"
       • access token mirrored to localStorage.velox.accessToken
  → Router redirects:  admin → /admin    agent → /agent
```

```
Subsequent requests
  → axios interceptor reads localStorage.velox.accessToken → Authorization header
  → If backend returns 401:
       • interceptor calls POST /api/auth/refresh   (refresh cookie sent automatically)
       • backend issues new access token
       • original request is retried, queued requests flushed
  → If refresh fails: token cleared, user kicked to /login
```

```
Realtime
  → realtime/socket.js opens socket.io with auth: { token }
  → Backend verifies token in handshake
  → Server emits: chat:message, ticket:updated, agent:status, notification, ...
  → Components subscribe via useSocket()
```

```
Logout
  → Sidebar calls auth.logout() (best-effort) then clearAuth()
  → Backend clears refresh-token cookie
  → Frontend wipes user + token, redirects to /login
```

---

## 6. API & socket contract (single source of truth)

Base URL: `/api`. All requests `withCredentials: true`. JSON only.
Error response (matches the existing `errorHandler` middleware):
```json
{ "success": false, "message": "Something went wrong", "errors": [] }
```
The frontend reads `err.response.data.message`. Match these exact paths and field names — the MSW handlers in `frontend/src/mocks/handlers.js` and shapes in `frontend/src/mocks/fixtures.js` are the contract.

### 6.1 Auth
| Method | Path | Body / Notes | Response |
|---|---|---|---|
| `POST` | `/auth/login` | `{ email, password, role }` | `{ user, accessToken }` + Set-Cookie refresh |
| `POST` | `/auth/logout` | — | `{ ok: true }` + clear cookie |
| `POST` | `/auth/refresh` | refresh cookie | `{ accessToken }` |
| `GET`  | `/auth/me` | bearer | user object |

User shape: `{ id, email, role: "admin"|"agent", name, initials, roleLabel }`.

### 6.2 Domain endpoints (paths the frontend already calls)
- **Tickets** — `GET /tickets` (`?q=&status=`), `GET /tickets/stats`, `GET/POST /tickets`, `PATCH /tickets/:id`, `POST /tickets/:id/assign`, `POST /tickets/:id/resolve`.
- **Chat** — `GET/POST /chat/:id/messages`, `POST /chat/sessions`, `POST /chat/sessions/:id/escalate`, `POST /chat/ai/suggest`.
- **Agents** — `GET /agents`, `GET /agents/:id`, `POST /agents/invite`, `PATCH /agents/:id`, `DELETE /agents/:id`, `POST /agents/:id/status`.
- **KB** — `GET /kb/articles` (`?q=`), `GET /kb/articles/:id`, `GET /kb/categories`, `GET /kb/search`.
- **FAQ** — `GET/POST /faq`, `PATCH /faq/:id`, `DELETE /faq/:id`.
- **Analytics** — `GET /analytics/{overview,tickets-trend,agent-performance,csat,channels,ai-deflection}`.
- **Reports** — `GET/POST /reports`, `DELETE /reports/:id`, `GET /reports/:id/export` → `{ url }`.
- **Settings** — `GET/PATCH /settings/{workspace,profile,notifications,security}`.
- **Notifications** *(new — see §6.5 for shape)* — `GET /notifications`, `POST /notifications/:id/read`, `POST /notifications/read-all`, `DELETE /notifications/:id`.

### 6.3 Auth header
```
Authorization: Bearer <access token>
```
Sent automatically by the axios interceptor for every `/api/*` call after login.

### 6.4 Socket.io events
Auth on connect: `socket.handshake.auth.token`.

| Event | Direction | Purpose |
|---|---|---|
| `chat:message` | both | New message in a chat session |
| `chat:typing` | both | Typing indicator |
| `chat:ai-reply` | server → client | Streamed AI response |
| `ticket:created` | server → client | New ticket appeared |
| `ticket:updated` | server → client | Ticket fields changed |
| `ticket:assigned` | server → client | Assignment changed |
| `ticket:resolved` | server → client | Ticket closed |
| `agent:status` | server → client | Agent online/offline/break |
| `notification` | server → client | Generic toast |
| `notification:new` | server → client | New entry for the bell dropdown (see §6.5) |

### 6.5 Notifications (used by the bell icon)
```
GET    /api/notifications?limit=20&unreadOnly=false   -> { items: Notification[], unreadCount: number }
POST   /api/notifications/:id/read                     -> 204
POST   /api/notifications/read-all                     -> 204
DELETE /api/notifications/:id                          -> 204
WS     "notification:new" -> Notification              (push to all sessions of that user)
```
`Notification` shape (matches `frontend/src/components/NotificationsMenu.jsx`):
```ts
{
  id: string,
  type: "ticket" | "mention" | "escalation" | "ai" | "agent" | "system",
  title: string,
  body?: string,
  href?: string,         // route to navigate on click, e.g. "/agent?ticket=T-1042"
  read: boolean,
  createdAt: string      // ISO timestamp
}
```

---

## 7. Environment variables

### 7.1 `frontend/.env`
```env
VITE_APP_NAME=Velox
VITE_API_URL=/api                       # leave as /api in dev (Vite proxies)
VITE_API_TARGET=http://localhost:5000   # used by the dev proxy only
VITE_SOCKET_URL=/                       # "/" → use proxied /socket.io
VITE_USE_MOCK=true                      # flip to false once backend is up
```

### 7.2 `backend/.env`
```env
PORT=5000
MONGODB_URI=...
ACCESS_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRY=7d
REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...
# Recommended (not in example yet):
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## 8. Folder map (most-touched files)

### Frontend
```
frontend/src/
├── api/
│   ├── client.js              # axios + 401 refresh interceptor
│   ├── endpoints.js           # barrel export of all services
│   ├── queryKeys.js           # React Query cache keys
│   ├── services/              # one file per domain (auth, tickets, agents, kb, …)
│   └── hooks/                 # one React Query hook file per domain
├── mocks/
│   ├── browser.js             # MSW worker setup
│   ├── handlers.js            # mock implementations of every endpoint
│   └── fixtures.js            # canonical response shapes (= the contract)
├── realtime/
│   ├── socket.js              # real socket.io client (token auth)
│   ├── mockSocket.js          # in-memory fallback when VITE_USE_MOCK=true
│   └── useSocket.js           # React hook
├── store/authStore.js         # zustand auth store, mirrors token to localStorage
├── routes/
│   ├── AppRoutes.jsx          # all routes, role-gated
│   └── ProtectedRoute.jsx     # auth + role redirect
├── pages/                     # one file per screen
├── layouts/AppShell.jsx       # main authenticated layout (sidebar + banner)
├── lib/constants.js           # storage keys, app name
└── styles/                    # tailwind + dark-theme overrides
```

### Backend
```
backend/src/
├── server.js                  # ⚠️ EMPTY — bootstrap express here
├── config/
│   ├── env.js                 # ⚠️ EMPTY — load + validate env
│   ├── db.js                  # mongoose connect (works)
│   └── redis.js               # ioredis client (small bug)
├── middleware/
│   ├── errorHandler.middleware.js  # ApiError-aware (works)
│   └── rateLimiter.middleware.js   # ⚠️ has bugs
├── utils/
│   ├── ApiError.js            # works
│   └── generateToken.js       # JWT helpers (works)
├── controllers/  hooks/  jobs/  models/  routes/  services/  validators/  constants/
                               # all empty (.gitkeep) — to be built
└── tests/
```

---

## 9. Definition of done (when can we delete MSW?)

- [ ] All endpoints in §6 return shapes that match `fixtures.js`.
- [ ] Login → set httpOnly refresh cookie → `/auth/refresh` returns a new access token.
- [ ] Socket.io accepts the JWT from `auth.token` on handshake.
- [ ] Set `VITE_USE_MOCK=false` in `frontend/.env`. Every page (Dashboard, Tickets, Chat, KB, FAQ, Agents, Analytics, Reports, Settings) loads with no network errors.
- [ ] CORS allows `http://localhost:5173` with credentials.

When the checklist passes, MSW can stay in the repo as a dev convenience but is no longer required.

---

## 9b. Project flow at a glance

```
┌──────────────────────────┐                ┌──────────────────────────┐
│        BROWSER           │                │         BACKEND          │
│  React + Vite (port 5173)│                │  Node + Express (5000)   │
│                          │                │                          │
│  pages/  →  api/hooks/   │  HTTP /api/*   │  routes → controllers →  │
│            └─ services/  │ ─────────────► │  services → models       │
│               └─ axios   │ ◄───────────── │  (MongoDB via Mongoose)  │
│                  client  │   JSON         │                          │
│                          │                │  (Redis via ioredis      │
│  realtime/socket.js      │  WS            │   for cache + rate-limit)│
│  (Socket.IO + JWT)       │ ◄────────────► │  Socket.IO server        │
│                          │                │                          │
│  store/authStore         │                │  utils/generateToken     │
│  └─ access token in mem  │                │  └─ access (15m) +       │
│  refresh token = cookie  │                │     refresh (7d, cookie) │
│                          │                │                          │
│  mocks/ (MSW)            │                │  middleware/errorHandler │
│  intercepts /api when    │                │  → uniform error JSON    │
│  VITE_USE_MOCK=true      │                │                          │
└──────────────────────────┘                └──────────────────────────┘
```

**Day-in-the-life of a request** — e.g. agent opens a ticket:
1. `AgentDashboard.jsx` mounts → `useTickets()` → React Query → `axios.get('/api/tickets')`.
2. Axios interceptor injects `Authorization: Bearer <token>` from `localStorage.velox.accessToken`.
3. Vite dev proxy forwards `/api/*` → `http://localhost:5000/api/*`.
4. Express → router → controller → service → Mongoose → Mongo.
5. JSON returns; React Query caches under `qk.tickets.list({...})`; UI renders.
6. Backend emits `ticket:updated` over Socket.IO when another agent edits the same ticket → `useSocket()` invalidates the query → list refreshes automatically.

**Switching from mocks to real backend**: set `VITE_USE_MOCK=false` and `VITE_API_TARGET=http://localhost:5000`. No component code changes.

---

## 9c. What the frontend team will work on next (post-handoff)

- Marketing **Home page** gets additional sections: testimonials, pricing tiers, integrations grid, public FAQ accordion, footer-CTA. `Home.jsx` is already structured as discrete sections — keep the brutal-card / pastel palette and they slot in cleanly.
- Once the real **notifications** endpoints (§6.5) ship, replace `useMockNotifications` inside `NotificationsMenu.jsx` with a React Query hook + Socket.IO subscription.
- Once real docs / changelog URLs exist, update the `LINKS` array inside `HelpMenu.jsx`.

---

## 9d. Handoff notes for the backend dev (read this before plugging in)

These are the small, easy-to-miss things that bit us during integration — keep them in mind so day 1 isn't spent debugging config:

1. **MSW mocks are ON by default in dev.** `frontend/.env` ships with `VITE_USE_MOCK=true`. Flip it to `false` (or delete `.env` so `.env.example` defaults take over) the moment you want the SPA to hit your real Express server. No component code changes are required — every page reads from React Query hooks that are already wired to the real `apiClient`.

2. **Backend must listen on `http://localhost:5000`.** That's the origin the frontend's `VITE_API_URL` and Vite dev proxy expect (see `frontend/vite.config.js`, the `/api` and `/socket.io` proxy rules). If you run the backend on a different port, also bump `VITE_API_URL`, `VITE_API_TARGET`, and `VITE_SOCKET_URL` in `frontend/.env`.

3. **Public widget needs an API key after first tenant register.** `VITE_WIDGET_API_KEY` in `.env` is intentionally blank. Once you implement `POST /api/auth/register-tenant` (see §6.1) and the tenant + key exist in Mongo, surface the key from `/admin` and paste it into `.env` so the embeddable widget can authenticate.

4. **No frontend unit tests yet.** `frontend/tests/` does not exist and `package.json` has no `test` script. Don't expect a green CI test step from the frontend side — only `npm run build` and (once configured) `npm run lint`.

5. **ESLint v9 needs a flat config.** `npm run lint` currently errors out asking for `eslint.config.js` (v9 dropped `.eslintrc`). It's a known config debt, not a code-quality issue. If your CI runs lint, either add a flat config or skip the frontend lint step until that's done.

6. **`StubPage.jsx` is imported but unrouted.** `frontend/src/routes/AppRoutes.jsx` lazy-imports `StubPage` but doesn't actually mount it on any route. Harmless dead import — feel free to delete or wire up to `/coming-soon` if you want it.

7. **Repo is a folder, not a git repo.** No `.git` directory at the workspace root. If your team workflow assumes git history (PRs, blame, branch protection), `git init` and an initial commit will be needed before pushing to your origin.

8. **Socket auth.** The frontend opens the socket with `auth: { token }` (the same JWT it received from `POST /api/auth/login`). Validate it server-side in your Socket.IO middleware (`backend/src/socket/auth.js` already has the scaffold) and bind `socket.data.userId` / `socket.data.tenantId` from the JWT payload — every socket handler downstream assumes those fields exist.


- Optional: remove MSW from the production bundle once the backend is stable.

---

## 10. Stack

**Frontend** — React 18, Vite 5, React Router 6, TanStack Query 5, Zustand, Axios, Socket.IO client, MSW, TailwindCSS 3, lucide-react.
**Backend** — Node 18+, Express 4, Mongoose 9, ioredis, jsonwebtoken, helmet, cors, express-async-errors, dotenv. (Add when needed: cookie-parser, socket.io, zod/joi for validation.)
