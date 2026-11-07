# AlumniLink — MySQL + React TypeScript migration

This edition changes the backend database driver from MongoDB/Mongoose to MySQL (`mysql2`) and renames React JSX source files to TSX. The existing Tailwind theme, CSS, component layouts and page styling are retained.

## Requirements
- Node.js 20.19+ (Vite 8 requirement)
- MySQL 8.0+

## Database setup
1. Start MySQL (XAMPP/MySQL service or MySQL Server).
2. Import `database/schema.sql` in MySQL Workbench/phpMyAdmin, or run `mysql -u root -p < database/schema.sql`.
3. Copy `server/.env.example` to `server/.env` and set `DB_USER`, `DB_PASSWORD`, `DB_NAME` and a long `JWT_SECRET`.

## Run backend
```bash
cd server
npm install
npm run seed
npm run dev
```
API health: `http://localhost:5000/api/health`.

## Run frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`.

## Demo accounts (after seed)
- Admin: `admin@alumnilink.test` / `Admin@123`
- Verified alumni: `ajay@example.com` / `Pass@123`
- Pending alumni: `neel@example.com` / `Pass@123`
- Student: `aarav@institute.edu` / `Pass@123`

## TypeScript note
All React component/page/context source files are now `.tsx`; Vite uses the React plugin and `tsconfig.json` is included. `allowJs` remains enabled for small API/helper modules that are plain JavaScript. Run `npm run typecheck` to check the TS project after installing dependencies.

## Important configuration
Resume storage continues to use the existing upload service. Configure Cloudinary credentials if using Cloudinary, or keep local fallback enabled for development. Password-reset email requires SMTP settings.

## Migration caveats
This is a source migration from the supplied MongoDB project. The SQL schema and SQL query controllers replace Mongoose models. Run the setup and verify your local MySQL credentials and resume storage provider. Automated environment checks cannot prove a complete end-to-end flow without a configured MySQL server and storage credentials.
