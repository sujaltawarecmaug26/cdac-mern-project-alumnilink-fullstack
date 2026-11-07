# AlumniLink – SQL Queries for Practice

These examples use the actual table names from `server/database/schema.sql`. They are kept intentionally straightforward so each query can be explained in a viva.

## 1. Show all users

```sql
SELECT id, name, email, role
FROM users;
```

## 2. Find a user by email

```sql
SELECT id, name, email, role
FROM users
WHERE email = 'student@example.com';
```

## 3. Show all open jobs

```sql
SELECT id, title, company, location, experience
FROM jobs
WHERE status = 'open'
ORDER BY created_at DESC;
```

## 4. Show a job with the alumnus who posted it

```sql
SELECT jobs.title, jobs.company, users.name AS alumni_name
FROM jobs
INNER JOIN users ON jobs.alumni_id = users.id
WHERE jobs.id = 1;
```

`INNER JOIN` is used because the job should have a matching alumni user.

## 5. Show applications with student names for one job

```sql
SELECT applications.id, users.name, users.email, applications.status
FROM applications
INNER JOIN users ON applications.student_id = users.id
WHERE applications.job_id = 1;
```

## 6. Count applications for every job

```sql
SELECT jobs.id, jobs.title, COUNT(applications.id) AS total_applications
FROM jobs
LEFT JOIN applications ON jobs.id = applications.job_id
GROUP BY jobs.id, jobs.title;
```

`LEFT JOIN` keeps jobs even when nobody has applied. `COUNT` counts the matching application rows.

## 7. Count students, alumni and admins

```sql
SELECT role, COUNT(*) AS total_users
FROM users
GROUP BY role;
```

## 8. Show pending alumni accounts

```sql
SELECT id, name, email, batch
FROM users
WHERE role = 'alumnus'
  AND verify_status = 'pending';
```

## 9. Update a user's display name

```sql
UPDATE users
SET name = 'Aarav Patil'
WHERE id = 5;
```

## 10. Why the API uses question marks

The backend uses parameterized queries instead of joining user input into SQL strings:

```js
const rows = await query(
  'SELECT id, name FROM users WHERE email = ?',
  [email]
);
```

The SQL statement and value are passed separately. This is safer than building SQL with string concatenation and also makes the query easier to read.
