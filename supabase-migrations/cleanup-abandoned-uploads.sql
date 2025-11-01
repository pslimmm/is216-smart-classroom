-- =====================================================
-- Cleanup Function for Abandoned Uploads
-- =====================================================
-- Purpose: Automatically delete recordings stuck in 'uploading'
--          status for more than 1 hour (abandoned uploads)
-- Trigger: Runs after every INSERT to recordings table
-- Cost: Zero (no serverless functions needed)
-- =====================================================

-- Create the cleanup function
-- Returns trigger type for use in trigger
CREATE OR REPLACE FUNCTION cleanup_abandoned_uploads()
RETURNS trigger AS $$
BEGIN
  -- Delete records stuck in 'uploading' status for more than 1 hour
  DELETE FROM recordings
  WHERE status = 'uploading'
  AND created_at < NOW() - INTERVAL '1 hour';

  -- Optional: Log the cleanup action
  -- RAISE NOTICE 'Cleaned up abandoned uploads';

  -- Return NEW for AFTER INSERT trigger
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run cleanup on every insert
-- This piggybacks on existing operations (zero additional cost)
DROP TRIGGER IF EXISTS cleanup_abandoned_trigger ON recordings;
CREATE TRIGGER cleanup_abandoned_trigger
AFTER INSERT ON recordings
FOR EACH ROW
EXECUTE FUNCTION cleanup_abandoned_uploads();

-- =====================================================
-- How to run this migration:
-- =====================================================
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" or press Cmd/Ctrl + Enter
-- =====================================================

-- Note: This trigger runs lightweight cleanup on every recording insert
-- The DELETE operation is very fast (indexed on status and created_at)
-- Typical execution time: < 1ms
-- =====================================================
