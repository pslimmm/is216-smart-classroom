-- Migration: Add course_id column to recordings table
-- Purpose: Link recordings to specific courses for course-scoped notes functionality
-- Date: 2025-10-29

-- Add course_id column with foreign key constraint
ALTER TABLE recordings
ADD COLUMN course_id bigint REFERENCES course(id);

-- Create index for faster queries when filtering recordings by course
CREATE INDEX idx_recordings_course_id ON recordings(course_id);

-- Optional: Add comment for documentation
COMMENT ON COLUMN recordings.course_id IS 'Foreign key linking recording to a specific course';
