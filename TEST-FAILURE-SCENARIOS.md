# Testing Failure Scenarios for Option 1

This guide shows how to test all failure scenarios to verify Option 1 implementation.

---

## Prerequisites

1. Run the SQL migration first (see IMPLEMENTATION-OPTION1.md)


---

## Scenario 1: Database Insert Failure ❌

**What happens**: Database insert fails before storage upload

**Expected behavior**:
- ❌ Nothing saved to database
- ❌ Nothing saved to storage
- ✅ User sees error message
- ✅ User can retry recording

**Test Command** (paste in browser console):
```javascript
fetch('/api/test-db-failure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => console.log(data))
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Database error: ...",
  "scenario": "Database Insert Failure",
  "result": "Nothing saved to DB or Storage",
  "userExperience": "User sees error message, can retry recording"
}
```

---

## Scenario 2: Storage Upload Failure 📁❌

**What happens**: Database insert succeeds, but storage upload fails

**Expected behavior**:
- ✅ Record saved to database with `status: 'failed'`
- ❌ Nothing saved to storage
- ✅ User sees failed recording in UI
- ✅ User can click "Retry Processing" to try again

**Test Command**:
```javascript
fetch('/api/test-storage-failure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ week: 'Week 11' })
})
.then(r => r.json())
.then(data => console.log(data))
```

**Expected Response**:
```json
{
  "success": true,
  "recordingId": "xxx-xxx-xxx",
  "scenario": "Storage Upload Failure",
  "result": "Record saved to DB with status: failed",
  "userExperience": "User sees failed recording in UI with retry button",
  "instruction": "Refresh the page to see the failed recording in Week 11"
}
```

**Verify**:
1. Refresh the page
2. Expand Week 11
3. You should see a failed recording with:
   - Red "Failed" badge
   - Error message: "Storage upload failed: Storage quota exceeded"
   - "Retry Processing" button in 3-dot menu

---

## Scenario 3: Abandoned Upload 🕐

**What happens**: User closes browser mid-upload (stuck in 'uploading' status)

**Expected behavior**:
- ✅ Record saved to database with `status: 'uploading'`
- ✅ Auto-deleted after 1 hour by cleanup trigger
- ✅ No orphaned records in database

**Test Command** (2 hours old - will be cleaned up):
```javascript
fetch('/api/test-abandoned-upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    week: 'Week 12',
    hoursAgo: 2  // Create record from 2 hours ago
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

**Expected Response**:
```json
{
  "success": true,
  "recordingId": "xxx-xxx-xxx",
  "scenario": "Abandoned Upload",
  "hoursAgo": 2,
  "result": "Will be cleaned up by trigger on next INSERT",
  "testCleanup": "Create a new recording to trigger the cleanup function"
}
```

**Verify Cleanup**:
1. Run the test command above
2. Record a new audio (or run test-storage-failure again)
3. The cleanup trigger will run automatically
4. Check Supabase database - the abandoned upload should be gone

**Alternative Test** (30 minutes old - won't be cleaned up yet):
```javascript
fetch('/api/test-abandoned-upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    week: 'Week 12',
    hoursAgo: 0.5  // 30 minutes ago
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

This will remain in the database until 1 hour has passed.

---

## Scenario 4: Processing Failure (Already Implemented) 🤖❌

**What happens**: Upload succeeds, but Groq API fails during transcription

**Expected behavior**:
- ✅ Record saved with `status: 'failed'`
- ✅ Audio saved in storage
- ✅ User sees failed recording with retry button

**Test Command** (already exists):
```javascript
fetch('/api/test-failed-transcript', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ week: 'Week 9' })
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## Verification Checklist

After running all tests, verify:

### Database Insert Failure:
- [ ] Error message shown in console
- [ ] No record in Supabase `recordings` table
- [ ] No file in Supabase `audio-recordings` storage

### Storage Upload Failure:
- [ ] Failed recording appears in Week 11 after refresh
- [ ] Status shows "Failed" badge (red)
- [ ] Error message displayed in alert
- [ ] "Retry Processing" option in 3-dot menu

### Abandoned Upload:
- [ ] Record created with `status: 'uploading'` and old timestamp
- [ ] After triggering another recording, abandoned record is deleted
- [ ] Check Supabase database to confirm deletion

### Processing Failure:
- [ ] Failed recording appears in UI
- [ ] Retry button works
- [ ] Audio file exists in storage

---

## How to Check Database Directly

Go to **Supabase Dashboard** → **Table Editor** → **recordings**

Filter by status:
```sql
SELECT * FROM recordings WHERE status = 'uploading';
SELECT * FROM recordings WHERE status = 'failed';
```

---

## Summary of Status Flow

```
User starts recording
    ↓
'uploading' → Database record created, uploading to storage
    ↓
'pending' → Upload complete, ready for processing
    ↓
'processing' → Currently transcribing with Groq API
    ↓
'completed' → ✅ Success
    OR
'failed' → ❌ Error (can retry)

Cleanup: 'uploading' status >1 hour → Auto-deleted
```

---

## Troubleshooting

**Trigger not firing?**
- Make sure you ran the SQL migration
- Check Supabase logs for trigger execution
- Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'cleanup_abandoned_trigger';`

**Abandoned uploads not being cleaned?**
- Trigger only fires on INSERT
- Create a new recording to trigger cleanup
- Or manually run: `SELECT cleanup_abandoned_uploads();`

**Failed recordings not showing in UI?**
- Refresh the page
- Check browser console for errors
- Verify `loadRecordings()` is fetching all statuses
