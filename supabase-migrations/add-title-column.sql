-- Add title column to recordings table
ALTER TABLE recordings
ADD COLUMN IF NOT EXISTS title VARCHAR(100);

-- Add index for faster title searches
CREATE INDEX IF NOT EXISTS idx_recordings_title ON recordings(title);
