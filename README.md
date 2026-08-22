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
4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Copy `.env.example` to `.env` in `frontend/`
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Docker

Run the app using Docker Compose:

```bash
docker-compose up --build
```

## Seed Data

To create starter data for the backend:

```bash
cd backend
npm run seed
```

## Environment Variables

Backend `.env` variables:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NODE_ENV`
- `PORT`

Frontend `.env` variables:

- `VITE_API_URL`

## APIs

- `POST /api/auth/register` — Student registration
- `POST /api/auth/login` — Login for student, mentor, admin
- `GET /api/students/*` — Student dashboard and profile routes
- `GET /api/mentors/*` — Mentor dashboard and meeting routes
- `GET /api/admin/*` — Admin analytics, user management, reports
- `GET /api/trainings/*` — Training discovery and enrollment
- `GET /api/meetings/*` — Meeting scheduling and status
- `GET /api/notifications/*` — Notification management
- `GET /api/progress/*` — Progress analytics and readiness
- `POST /api/ai/*` — AI-assisted resume analysis and roadmap suggestions

## Notes

The platform is designed for production readiness with secure middleware, rate limiting, and role-based access control. Extend the AI routes to integrate with a real LLM provider for advanced chatbot and recommendation features.
