# AlumniLink – Project Explanation

This document explains the current codebase in straightforward terms. Use it alongside the source code when preparing the project demo or viva.

## 1. Project idea

AlumniLink provides one place for students to find job posts shared by verified alumni. Students apply using the resume saved in their profile. Alumni review applications for their own posts. An admin checks alumni accounts before those accounts can publish jobs.

## 2. How one request travels through the application

1. A user clicks a button or submits a form in the React page.
2. The page calls a function from `client/src/api/`.
3. Axios sends an HTTP request to the Express API. If the user is logged in, Axios attaches the JWT.
4. Express matches the URL in `server/src/routes/`.
5. Authentication and role middleware check who is making the request.
6. The controller in `server/src/controllers/` runs the required SQL through the shared database connection.
7. Express sends a JSON response. The React page displays the result or an error message.

## 3. Why the folders are separated

- `routes`: keeps endpoint URLs and middleware together.
- `controllers`: contains the code that handles a request and returns a response.
- `middleware`: contains checks shared by multiple routes, such as login, role and input validation.
- `config`: reads environment settings and creates the MySQL connection pool.
- `services`: contains file-storage work that does not belong directly in a route.
- `pages`: contains complete screens for each user role.
- `components`: contains UI pieces reused across screens.
- `api`: keeps HTTP request code out of the page components.

## 4. MySQL tables in simple words

| Table | Stores | Relationship |
|---|---|---|
| `users` | Name, email, password hash, role and account status | Parent record for student/alumni profiles |
| `student_profiles` | Student bio, skills, links and resume | One row per student user |
| `alumni_profiles` | Company, designation and contact information | One row per alumni user |
| `jobs` | Job title, company, description, location and owner | Each job belongs to an alumni user |
| `job_skills` | One required skill per row for a job | Many skills can belong to one job |
| `applications` | Student, job, resume snapshot and decision status | Connects a student user to a job |

### Important SQL concepts used

- `PRIMARY KEY`: identifies one row uniquely, for example `users.id`.
- `FOREIGN KEY`: prevents child records from pointing to a missing parent, for example `jobs.alumni_id` references `users.id`.
- `UNIQUE`: prevents duplicate values, such as duplicate user emails and duplicate applications for the same student/job pair.
- `JOIN`: combines related rows, for example a job with its alumni owner or applications with student details.
- `GROUP BY`: groups rows when a count is needed, such as applications per job.
- `?` placeholders: pass values separately from SQL text through mysql2, helping avoid SQL injection.

## 5. Login and password security

Passwords are not saved as plain text. During registration, `bcryptjs` creates a password hash. During login, bcrypt compares the entered password with the saved hash. The backend then creates a JWT. The frontend stores that token and sends it in the `Authorization: Bearer ...` header for protected API requests.

For password reset, the backend creates a random token, hashes it with SHA-256 and stores the hash with a 30-minute expiry. During local development, the reset URL is printed in the backend terminal instead of being emailed. When the user submits the URL token and a new password, the backend hashes the supplied token, checks its expiry, updates the password hash and clears the reset fields.

## 6. Role checks

- Student: can maintain their profile, upload a resume, browse jobs and apply.
- Alumni: can maintain their profile; only approved alumni can publish jobs and review applications for their own jobs.
- Admin: can review alumni registrations and manage the basic admin view.

The backend checks roles and ownership. Hiding a button in React is not a security check by itself.

## 7. Resume upload

The browser sends the selected PDF as `multipart/form-data`. Multer receives the file and the upload service stores it locally. The database stores a reference and original filename rather than the PDF bytes. The resume route checks the logged-in user before returning the file.

## 8. Useful viva questions

**Why use a connection pool?** It reuses database connections instead of opening a new connection for every query.

**Why hash passwords?** A database leak should not expose users' original passwords.

**Why use a foreign key?** It maintains relationships and prevents orphan records.

**Why use a unique key on `(student_id, job_id)`?** It prevents a student from applying to the same job twice, even if two requests arrive close together.

**Why save a resume reference in an application?** It records which resume was submitted at the time of applying, even if the student later uploads a new resume.

**Why use Material UI?** It provides consistent, accessible controls and lets the team keep common button, card and form styles in one place.

**What is the difference between route and controller?** The route maps a URL and HTTP method to middleware/controller functions. The controller contains the request-handling logic.

## 9. Development limitation

The password-reset URL printed to the terminal is a local-development shortcut, not an email replacement for a public deployment. Local resume files also need persistent storage if the server is deployed to a platform with an ephemeral filesystem.
