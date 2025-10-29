import { createClient } from '@supabase/supabase-js'

// TEST ENDPOINT: Simulate database insert failure
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    try {
        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        // Simulate DB error by trying to insert with invalid user_id
        const recordingId = crypto.randomUUID()

        const { error } = await supabase
            .from('recordings')
            .insert({
                id: recordingId,
                user_id: '00000000-0000-0000-0000-000000000000', // Invalid user_id (doesn't exist)
                week: 'Week 10',
                title: 'Test DB Failure',
                audio_path: 'test/fake.webm',
                audio_size: 12345,
                status: 'uploading'
            })

        if (error) {
            console.error('Database insert error (EXPECTED):', error)
            return {
                success: false,
                error: 'Database error: ' + error.message,
                scenario: 'Database Insert Failure',
                result: 'Nothing saved to DB or Storage',
                userExperience: 'User sees error message, can retry recording'
            }
        }

        return {
            success: false,
            message: 'Test failed - DB insert should have failed'
        }

    } catch (error) {
        console.error('Test error:', error)
        return {
            success: false,
            error: error.message,
            scenario: 'Database Insert Failure',
            result: 'Nothing saved to DB or Storage'
        }
    }
})
