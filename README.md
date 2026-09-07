# Katalyst — Student–Mentor Learning Platform

Katalyst is a multi-role learning platform built with React, Tailwind CSS, Node.js, Express, and MongoDB Atlas.

## Key Features

- Role-based application for Students, Mentors, and Admins
- JWT authentication with secure role-based access control
- Training module with videos, quizzes, assignments, progress tracking, certificates
- Meeting module with scheduling, Google Meet links, mentor responses, feedback, and notes
- Progress analytics with placement readiness and career roadmap support
- Notifications, resume upload, certificate downloads, email notifications
- Docker support for backend, frontend, and MongoDB

## Folder Structure

- `backend/` — Express API, models, controllers, middleware, uploads, Docker config
- `frontend/` — React application, Tailwind CSS, pages, components

## Setup

### Backend

1. Copy `.env.example` to `.env` in `backend/`
2. Fill values for `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASS`
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
# Katalyst

Katalyst is a full-stack student learning and mentorship platform. It provides separate workflows for students, mentors, and administrators, with training, progress, meetings, notifications, scholarships, and AI-assisted features.

## Technology

- Frontend: React, Vite, React Router, Tailwind CSS, Recharts
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Authentication: JWT and bcryptjs
- Deployment: Docker Compose

## Repository Structure

```text
.
├── backend/
│   ├── config/          Database configuration
│   ├── controllers/     Request handlers and business logic
│   ├── middleware/      Authentication and role checks
│   ├── models/          Mongoose models
│   ├── routes/          API route definitions
│   ├── scripts/         Standalone maintenance scripts
│   ├── utils/            Shared backend utilities
│   ├── seed.js          Demo data loader
│   ├── server.js        Express application entry point
│   └── Dockerfile
├── frontend/
│   ├── public/           Static public assets
│   ├── src/
│   │   ├── components/   Shared UI components
│   │   ├── context/      React context providers
│   │   ├── pages/        Role-based application pages
│   │   ├── services/     Frontend service modules
│   │   └── utils/        Frontend helpers
│   ├── android/          Capacitor Android project
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml
├── package.json          Root development and build scripts
└── README.md
```

Generated documentation PDFs are kept at the repository root as optional project deliverables. Build output, dependencies, uploads, logs, and local environment files are ignored by Git.

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB 7 or a compatible MongoDB instance
- Docker Desktop, only for the container workflow

## Quick Start: Local Development

Install all dependencies from the repository root:

```bash
npm run install:all
```

Create environment files from the provided templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

On Windows PowerShell, use:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Update `backend/.env` with a reachable MongoDB connection string. The default local development value is:

```env
MONGO_URI=mongodb://127.0.0.1:27017/katalyst
```

Start both applications:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Demo Data

The seed command clears the application collections and creates the demo dataset. Use it only when resetting local development data:

```bash
npm run seed
```

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Student | `diksha@katalyst.io` | `Student@123` |
| Mentor | `sarah@katalyst.io` | `Mentor@123` |
| Admin | `admin@katalyst.io` | `Admin@123` |

To create only the standalone demo mentor without resetting the database:

```bash
npm run create-mentor --prefix backend
```

## Docker

The Compose workflow starts the backend, frontend, and MongoDB together:

```bash
docker compose up --build
```

Open `http://localhost:4173` after the containers are ready. The frontend API URL is supplied as a build argument, and the backend connects to the Compose MongoDB service at `mongodb://mongo:27017/katalyst`.

Stop the services with:

```bash
docker compose down
```

To remove the local MongoDB volume as well, use `docker compose down -v`. This deletes the container database.

## Environment Variables

Backend variables are defined in `backend/.env.example`:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_EXPIRES_IN` | Token lifetime, such as `7d` |
| `CLIENT_URL` | Frontend origin allowed by the API |
| `EMAIL_USER` | SMTP account used for email notifications |
| `EMAIL_PASS` | SMTP password or app password |
| `NODE_ENV` | Runtime environment |
| `PORT` | Backend port |

Frontend uses `VITE_API_URL`, normally `http://localhost:5000/api` for local development.

Never commit `.env` files or real credentials. The example files contain placeholders and development defaults only.

## Useful Commands

Run these from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend and backend in development mode |
| `npm run dev:frontend` | Start only the Vite frontend |
| `npm run dev:backend` | Start only the API with Nodemon |
| `npm run build` | Build the frontend |
| `npm start` | Build the frontend, start the API, and serve the production preview |
| `npm run seed` | Reset and load demo data |
| `npm run install:all` | Install root, backend, and frontend dependencies |
| `npm run create-mentor --prefix backend` | Create the demo mentor without a full reset |

## API Overview

All API routes are prefixed with `/api`.

- `/api/auth` - registration, login, current user, and password reset
- `/api/students` - student dashboard, profile, resume, and progress data
- `/api/mentors` - mentor dashboard, profile, students, and meetings
- `/api/admin` - administration, reports, students, and mentors
- `/api/trainings` - training catalog, enrollment, quizzes, and assignments
- `/api/meetings` - meeting scheduling and status changes
- `/api/notifications` - notification retrieval and read status
- `/api/progress` - student progress and readiness metrics
- `/api/scholarships` - scholarship catalog and applications
- `/api/ai` - AI-assisted resume and career features

## Development Conventions

- Keep route definitions in `routes/` and request logic in `controllers/`.
- Keep database schemas in `models/`; shared logic belongs in `utils/`.
- Keep role-specific pages under `frontend/src/pages/student`, `mentor`, or `admin`.
- Put standalone database or maintenance scripts in `backend/scripts/`.
- Do not commit `node_modules`, `dist`, `uploads`, `.env`, logs, or generated temporary files.
