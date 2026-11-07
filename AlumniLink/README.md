# AlumniLink

A student and alumni platform for sharing job opportunities, applying with a saved resume, and managing applications.

## What the project does

AlumniLink has three account types: Student, Alumni and Admin. Students maintain a profile, upload a PDF resume, browse jobs and track applications. Alumni accounts are reviewed by an admin; approved alumni can publish jobs and review applications for their own jobs. Admins review alumni registrations.

## Main features

- Register and log in with email and password.
- Role-based access for students, alumni and admins.
- Admin approval for alumni accounts.
- Student and alumni profile editing, including display-name updates.
- Student PDF resume upload and private resume viewing.
- Job creation, editing, closing and browsing.
- Job applications with a resume snapshot and optional note.
- Alumni application review and student application tracking.
- Password reset using a one-time link printed in the server terminal during local development.

## Technology used

| Part | Technology | Purpose |
|---|---|---|
| Frontend | React, TypeScript, Vite | Pages and reusable UI components |
| UI | Material UI, Emotion | Form controls, buttons, cards and theme |
| Routing | React Router | Page navigation and protected routes |
| API calls | Axios | Frontend-to-backend requests |
| Backend | Node.js, Express | REST API |
| Database | MySQL, mysql2 | Store users, profiles, jobs and applications |
| Authentication | JWT, bcryptjs | Login sessions and password hashing |
| File upload | Multer, local file storage | Accept and store PDF resumes |

## Folder structure

```text
AlumniLink/
├── client/
│   ├── src/
│   │   ├── api/                 # Axios functions for backend endpoints
│   │   ├── components/          # Shared layout and UI components
│   │   ├── context/             # Login and toast state
│   │   ├── hooks/               # Small reusable React hooks
│   │   ├── pages/               # Public, student, alumni and admin pages
│   │   ├── styles/              # Global styles
│   │   ├── theme.ts             # Material UI theme and project colours
│   │   ├── App.tsx              # Routes
│   │   └── main.tsx             # React entry point
│   └── package.json
├── server/
│   ├── database/schema.sql     # MySQL tables and relationships
│   ├── src/
│   │   ├── config/              # Environment and database connection
│   │   ├── controllers/         # API request handling
│   │   ├── middleware/          # Authentication, roles, uploads, validation
│   │   ├── routes/              # API endpoint definitions
│   │   ├── services/            # Resume storage helper
│   │   ├── utils/               # Shared constants
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Database connection and server start
│   └── package.json
├── docs/
│   └── PROJECT_EXPLANATION.md
└── README.md
```

## Database tables

- `users`: login details, role, alumni verification status and password-reset token hash.
- `student_profiles`: student bio, skills, links and current resume reference.
- `alumni_profiles`: company, designation and alumni contact/profile details.
- `jobs`: job posts created by alumni.
- `job_skills`: skills attached to a job.
- `applications`: student applications and the resume reference used at application time.

The SQL uses primary keys, foreign keys, unique constraints and indexes for common lookups. A student can apply only once to a particular job.

## Run locally

### Requirements

- Node.js 20 or newer
- MySQL 8 or compatible MySQL server
- npm

### 1. Create the database

Open MySQL Workbench or the MySQL command line and run `server/database/schema.sql`. The script creates the `alumnilink` database and its tables.

### 2. Configure the backend

From the `server` folder, copy `.env.example` to `.env` and enter the MySQL credentials for your own computer. Do not share or commit `.env`.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_mysql_password
DB_NAME=alumnilink
DB_CONNECTION_LIMIT=10
UPLOAD_FALLBACK_LOCAL=true
```

Install and start the backend:

```bash
cd server
npm install
npm run dev
```

The API starts on `http://localhost:5000`.

### 3. Configure and start the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

### 4. Password reset in local development

Email delivery is intentionally not configured in this beginner-friendly version. On the Forgot Password page, enter the account email. If the account exists, the backend prints a one-time reset URL in the **server terminal**. Copy that URL into the browser and set a new password. The token expires after 30 minutes; only its SHA-256 hash is stored in MySQL.

This terminal-link method is for local demos only. A deployed application should send the link through a real email provider and should not expose reset links in server logs.

## Validation and error handling

The frontend uses normal HTML form constraints and small checks where needed. The backend has small route-level validation functions that return field messages. No Zod dependency is used. Passwords are hashed with bcryptjs; reset tokens are random, time-limited and stored as hashes.

## Resume storage note

Resume files are stored on the server in the local uploads directory. This is convenient for local development and a classroom demo. For deployment, use persistent disk storage or a dedicated object-storage service; temporary hosting filesystems can be cleared during redeployments.

## Tests and checks

Run the existing backend tests with:

```bash
cd server
npm test
```

Run the frontend TypeScript check and production build with:

```bash
cd client
npm run typecheck
npm run build
```

These commands are included for the team to run after installing dependencies. Check the actual terminal output before treating a test or build as passed.

## Project colour palette

- Cream background: `#FFF8F1`
- Maroon primary: `#9F1239`
- Deep wine: `#6B0F2A`
- Gold accent: `#D97706`
- Cocoa text: `#2B1B17`
- Muted text: `#8B7766`
- Sand border: `#F1E3D3`

See [the project explanation](docs/PROJECT_EXPLANATION.md) for the request flow, SQL table relationships and a simple viva guide. Practice the actual table queries in [SQL_QUERIES.md](docs/SQL_QUERIES.md).
