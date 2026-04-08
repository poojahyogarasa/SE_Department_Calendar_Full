-- M6: Add course_code, course_year, course_group columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS course_code VARCHAR(20) NULL AFTER location,
  ADD COLUMN IF NOT EXISTS course_year VARCHAR(10) NULL AFTER course_code,
  ADD COLUMN IF NOT EXISTS course_group VARCHAR(20) NULL AFTER course_year;
