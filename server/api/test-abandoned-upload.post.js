export default defineEventHandler(async (event) => {
    
// TEST ENDPOINT: Simulate abandoned upload (stuck in 'uploading' status)
    const body = await readBody(event)
    const { week, hoursAgo } = body

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

        // Create timestamp in the past (default 2 hours ago, or custom)
        const hours = hoursAgo || 2
        const pastTime = new Date()
        pastTime.setHours(pastTime.getHours() - hours)

        // Insert record with old timestamp and 'uploading' status
        const { error: dbError } = await supabaseClient
            .from('recordings')
            .insert({
                id: recordingId,
                user_id: userId,
                week: week,
                title: `Abandoned Upload ${hours}h ago`,
                audio_path: `${userId}/abandoned_${recordingId}.webm`,
                audio_size: 12345,
                status: 'uploading', // Stuck in uploading
                created_at: pastTime.toISOString() // Backdated timestamp
            })

        if (dbError) {
            throw new Error('DB insert failed: ' + dbError.message)
        }

        console.log(`✅ Created abandoned upload from ${hours} hours ago`)

        return {
            success: true,
            recordingId: recordingId,
            scenario: 'Abandoned Upload',
            hoursAgo: hours,
            result: hours >= 1
                ? 'Will be cleaned up by trigger on next INSERT (or is already cleaned up if >1h)'
                : 'Too recent - will be cleaned up after 1 hour',
            userExperience: hours >= 1
                ? 'Record will be auto-deleted by cleanup trigger'
                : 'Record visible in DB for now, will auto-delete after 1 hour',
            instruction: hours >= 1
                ? 'Trigger a new recording to activate cleanup, then check database'
                : 'Wait 1 hour and trigger a new recording to see cleanup',
            testCleanup: 'Create a new recording to trigger the cleanup function'
        }

    } catch (error) {
        console.error('Test abandoned upload error:', error)
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
