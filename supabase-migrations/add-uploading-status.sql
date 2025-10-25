-- Add 'uploading' status to the recordings table check constraint
-- This is required for Option 1 implementation

-- First, drop the old constraint
ALTER TABLE recordings DROP CONSTRAINT IF EXISTS recordings_status_check;

-- Add new constraint with 'uploading' status
ALTER TABLE recordings
ADD CONSTRAINT recordings_status_check
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'uploading'));
