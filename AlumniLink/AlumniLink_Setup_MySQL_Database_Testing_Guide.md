# AlumniLink – Setup and MySQL Guide

Use the current [README](README.md) for installation and environment setup. This version uses MySQL, React + TypeScript, Express and Material UI.

## Database setup

1. Start MySQL Server.
2. Open MySQL Workbench or the MySQL CLI.
3. Run `server/database/schema.sql`.
4. Create `server/.env` from `server/.env.example` and enter your own local MySQL password.
5. Start the backend from the `server` folder with `npm run dev`.
6. Start the frontend from the `client` folder with `npm run dev`.

There is no seed command in this simplified project. Register student/alumni accounts through the UI. To create an admin account for a local demo, use a controlled SQL update on a test account after registering it, for example `UPDATE users SET role = 'admin', verify_status = 'approved' WHERE email = 'your-test-email@example.com';`. Do not run that update on a real user's account.

See `docs/PROJECT_EXPLANATION.md` for table relationships, authentication, file upload and viva questions.
