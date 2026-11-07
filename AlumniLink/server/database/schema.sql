CREATE DATABASE IF NOT EXISTS alumnilink
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alumnilink;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'alumnus', 'admin') NOT NULL,
  batch VARCHAR(80) DEFAULT '',
  verify_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reject_reason VARCHAR(500) DEFAULT '',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  reset_token_hash CHAR(64) NULL,
  reset_token_expires DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_status (role, verify_status)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  headline VARCHAR(80) DEFAULT '',
  bio VARCHAR(500) DEFAULT '',
  skills JSON NULL,
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  resume_url VARCHAR(500) DEFAULT '',
  resume_public_id VARCHAR(255) DEFAULT '',
  resume_name VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_student_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alumni_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  company VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  work_email VARCHAR(190) DEFAULT '',
  contact_phone VARCHAR(30) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  bio VARCHAR(500) DEFAULT '',
  proof_note VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_alumni_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  alumni_id BIGINT UNSIGNED NOT NULL,
  company VARCHAR(100) NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(120) NOT NULL,
  experience ENUM('fresher', 'junior', 'mid') NOT NULL,
  job_url VARCHAR(500) DEFAULT '',
  deadline DATE NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_owner (alumni_id),
  INDEX idx_jobs_status (status),
  CONSTRAINT fk_job_alumni FOREIGN KEY (alumni_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_skills (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id BIGINT UNSIGNED NOT NULL,
  skill VARCHAR(60) NOT NULL,
  UNIQUE KEY uq_job_skill (job_id, skill),
  CONSTRAINT fk_skill_job FOREIGN KEY (job_id)
    REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  job_id BIGINT UNSIGNED NOT NULL,
  resume_url VARCHAR(500) NOT NULL,
  resume_public_id VARCHAR(255) NOT NULL,
  resume_name VARCHAR(255) NOT NULL,
  note VARCHAR(500) DEFAULT '',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  decision_note VARCHAR(500) DEFAULT '',
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_student_job (student_id, job_id),
  INDEX idx_application_job_status (job_id, status),
  CONSTRAINT fk_application_student FOREIGN KEY (student_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_application_job FOREIGN KEY (job_id)
    REFERENCES jobs(id) ON DELETE CASCADE
);
