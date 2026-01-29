**Repository Overview**

This is a small full-stack app: a Vite + React frontend and a Node (Express) backend with PostgreSQL. Backend code lives in `backend/` and frontend in `frontend/`.

**Quick Architecture**
- **Backend:** Express server in [backend/server.js](backend/server.js) (ESM). Uses PostgreSQL via [backend/config/db.js](backend/config/db.js).
- **Frontend:** Vite + React app (dev server on port 5173). Entry points: [frontend/src/main.jsx](frontend/src/main.jsx) and [frontend/src/App.jsx](frontend/src/App.jsx).
- **Auth flow:** Backend provides `/api/admin/register` and `/api/admin/login` endpoints in [backend/server.js](backend/server.js). Login issues a JWT (currently a hardcoded secret) which is set as an `httpOnly` cookie. Frontend holds auth helpers in [frontend/src/context/authContext.jsx](frontend/src/context/authContext.jsx) and [frontend/src/context/useAuth.js](frontend/src/context/useAuth.js).

**How the pieces communicate**
- Frontend expects backend at `http://localhost:5000` (CORS is configured for `http://localhost:5173` in the backend).
- Backend uses `pg` Pool configured from environment variables (`DB_USER`, `DB_HOST`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`) in [backend/config/db.js](backend/config/db.js).

**Developer Workflows / Useful Commands**
- Install frontend deps: `cd frontend && npm install`.
- Run frontend dev server: `npm run dev` (from `frontend/`).
- Install backend deps: `cd backend && npm install`.
- Start backend: `node server.js` or `npx nodemon server.js` (there are no start scripts in backend/package.json).
- Environment: create a `.env` in `backend/` with DB_* vars and optionally `NODE_ENV=development` and a JWT secret.

**Project-Specific Patterns & Conventions**
- Backend uses ESM modules (see `type: "module"` in [backend/package.json](backend/package.json)). Use `import`/`export` when editing backend files.
- Routes are implemented directly in `server.js` (not a large router structure). When adding endpoints, follow the existing pattern: async handler -> `pool.query(...)` -> `res.json(...)`.
- DB connection is a shared exported `pool` from [backend/config/db.js](backend/config/db.js). Use `pool.query(text, values)` with parameterized queries (`$1`, `$2`, ...).
- Auth is cookie-based JWT with `httpOnly` cookie set in the login route. Be aware the JWT secret is currently inline in `server.js` — consider consolidating into the `.env` as `JWT_SECRET`.
- Frontend organizes features under `frontend/src/` with `admin/`, `Components/`, `controllers/`, and `routes/`. Follow the existing structure for new views/components (e.g., add admin pages under `admin/`).

**Files to Inspect When Working on Auth or Data**
- [backend/server.js](backend/server.js) — register/login handlers, CORS, cookie setup.
- [backend/config/db.js](backend/config/db.js) — DB Pool and env var names.
- [frontend/src/context/authContext.jsx](frontend/src/context/authContext.jsx) — how frontend manages auth state.
- [frontend/src/controllers/LoginController.jsx](frontend/src/controllers/LoginController.jsx) and [frontend/src/controllers/RegistarController.jsx](frontend/src/controllers/RegistarController.jsx) — examples of frontend API calls.

**Security & Maintenance Notes (detectable from code)**
- JWT secret is hardcoded in `server.js`; move to `.env` as `JWT_SECRET` to avoid leakage.
- Backend `package.json` lacks useful `scripts` (start, dev). When adding CI or dockerization, add `start` and `dev` scripts.

**If you are an AI contributor:**
- Make minimal, local changes unless asked otherwise. Prefer editing files under `frontend/src/` or `backend/` that match the feature area.
- Preserve ESM syntax and the small-file layout (no large refactor without maintainer approval).
- When adding network calls, reuse the `axios`-style patterns in `frontend/src/controllers/` and preserve cookie usage where required.

If anything in these notes is unclear or you want the file to include CI/CD, linting, or Docker examples, tell me which area to expand.
