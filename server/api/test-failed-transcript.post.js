export default defineEventHandler(async (event) => {
    // TEST ENDPOINT: Create a dummy failed transcript for testing retry functionality
    const body = await readBody(event)

    const { week } = body

    if (!week) {
        throw createError({
            statusCode: 400,
            message: 'week is required'
        })
    }



    const { data: profileData, error: profileError } = await supabaseClient
        .from('profile')
        .select('user_id')
        .eq('role', 'prof')
        .limit(1)
        .single()

    if (profileError || !profileData) {
        throw createError({
            statusCode: 400,
            message: 'No prof user found in database'
        })
    }

    const userId = profileData.user_id

    try {


        const recordingId = crypto.randomUUID()

        // Insert dummy FAILED recording
        const { error } = await supabaseClient
            .from('recordings')
            .insert({
                id: recordingId,
                user_id: userId,
                week: week,
                title: `Failed Test Recording ${recordingId.substring(0, 8)}`,
                audio_path: `test/${recordingId}.webm`, // Dummy path that exists
                audio_size: 12345,
                duration_seconds: 60,
                status: 'failed',
                error_message: 'Groq API error: Rate limit exceeded. Please try again later.',
                processed_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Database insert error: ${error.message}`)
        }

        return {
            success: true,
            message: 'Dummy failed transcript created for testing retry feature',
            recordingId: recordingId,
            hint: 'Open the UI, find this failed transcript, and click "Retry Processing" in the 3-dot menu'
        }

    } catch (error) {
        console.error('Test failed transcript error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to create test failed transcript'
        })
    }
})
