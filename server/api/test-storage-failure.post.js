export default defineEventHandler(async (event) => {
    // TEST ENDPOINT: Simulate storage upload failure
    const body = await readBody(event)
    const { week } = body

    if (!week) {
        throw createError({
            statusCode: 400,
            message: 'week is required'
        })
    }

    try {

        // Get a real user_id
        const { data: profileData } = await supabaseClient
            .from('profile')
            .select('user_id')
            .eq('role', 'prof')
            .limit(1)
            .single()

        if (!profileData) {
            throw new Error('No prof user found')
        }

        const userId = profileData.user_id
        const recordingId = crypto.randomUUID()

        // STEP 1: Insert to database with 'uploading' status
        const { error: dbError } = await supabaseClient
            .from('recordings')
            .insert({
                id: recordingId,
                user_id: userId,
                week: week,
                title: `Test Storage Failure ${recordingId.substring(0, 8)}`,
                audio_path: `${userId}/fake_${recordingId}.webm`,
                audio_size: 12345,
                status: 'uploading',
                created_at: new Date().toISOString()
            })

        if (dbError) {
            throw new Error('DB insert failed: ' + dbError.message)
        }

        console.log('✅ DB record created with status: uploading')

        // STEP 2: Simulate storage upload failure (don't actually upload)
        // Instead, mark as failed immediately
        const fakeStorageError = 'Storage quota exceeded'

        await supabaseClient
            .from('recordings')
            .update({
                status: 'failed',
                error_message: `Storage upload failed: ${fakeStorageError}`
            })
            .eq('id', recordingId)

        console.log('❌ Simulated storage failure - record marked as failed')

        return {
            success: true,
            recordingId: recordingId,
            scenario: 'Storage Upload Failure',
            result: 'Record saved to DB with status: failed',
            userExperience: 'User sees failed recording in UI with retry button',
            instruction: 'Refresh the page to see the failed recording in ' + week
        }

    } catch (error) {
        console.error('Test storage failure error:', error)
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
