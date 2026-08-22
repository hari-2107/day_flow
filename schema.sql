-- ============================================================
-- Dayflow HRMS - PostgreSQL Schema
-- Covers: 3.1 Auth, 3.3 Profile, 3.4 Attendance, 3.5 Leave, 3.6 Payroll
-- ============================================================

-- Clean re-run support (optional, comment out in production)
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS employee_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 3.1 Authentication & Authorization
-- Roles: 'admin' (HR Officer) | 'employee'
-- ============================================================
CREATE TABLE users (
    id                  SERIAL PRIMARY KEY,
    employee_id         VARCHAR(50) UNIQUE NOT NULL,
    email               VARCHAR(150) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(20) NOT NULL DEFAULT 'employee'
                            CHECK (role IN ('admin', 'employee')),
    is_email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token  VARCHAR(255),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3.3 Employee Profile Management
-- Personal + job details. Employees can edit limited fields
-- (address, phone, profile picture); admin can edit all.
-- ============================================================
CREATE TABLE employee_profiles (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Personal details
    full_name           VARCHAR(150) NOT NULL,
    date_of_birth       DATE,
    gender              VARCHAR(20),
    phone               VARCHAR(20),
    address             TEXT,
    profile_picture_url TEXT,

    -- Job details
    department          VARCHAR(100),
    designation         VARCHAR(100),
    date_of_joining      DATE,
    employment_type     VARCHAR(30) DEFAULT 'full-time',
    reporting_manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Employee documents (uploaded files: ID proof, certificates, etc.)
CREATE TABLE documents (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type     VARCHAR(100) NOT NULL,
    file_url     TEXT NOT NULL,
    uploaded_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3.4 Attendance Management
-- Daily/weekly view, check-in/check-out, status types
-- ============================================================
CREATE TABLE attendance (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date          DATE NOT NULL,
    check_in      TIMESTAMP,
    check_out     TIMESTAMP,
    status        VARCHAR(20) NOT NULL DEFAULT 'present'
                      CHECK (status IN ('present', 'absent', 'half-day', 'leave')),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, date)   -- one attendance record per employee per day
);

-- ============================================================
-- 3.5 Leave & Time-Off Management
-- ============================================================
CREATE TABLE leave_requests (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type        VARCHAR(20) NOT NULL
                          CHECK (leave_type IN ('paid', 'sick', 'unpaid')),
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    remarks           TEXT,
    status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comments    TEXT,
    reviewed_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP NOT NULL DEFAULT NOW(),

    CHECK (end_date >= start_date)
);

-- ============================================================
-- 3.6 Payroll / Salary Management
-- Read-only for employees; admin can view/update all
-- ============================================================
CREATE TABLE payroll (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    basic_salary      NUMERIC(12,2) NOT NULL DEFAULT 0,
    allowances        NUMERIC(12,2) NOT NULL DEFAULT 0,
    deductions        NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_salary        NUMERIC(12,2) GENERATED ALWAYS AS
                          (basic_salary + allowances - deductions) STORED,
    effective_month   DATE NOT NULL,   -- e.g. 2026-08-01 for Aug 2026 payroll
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, effective_month)
);

-- ============================================================
-- Helpful indexes
-- ============================================================
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_payroll_user ON payroll(user_id);
