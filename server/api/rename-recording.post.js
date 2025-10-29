import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { recordingId, newTitle } = body

    if (!recordingId || !newTitle) {
        throw createError({
            statusCode: 400,
            message: 'recordingId and newTitle are required'
        })
    }

    try {
        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        // Update the recording title in the database
        const { data, error } = await supabase
            .from('recordings')
            .update({ title: newTitle.trim() })
            .eq('id', recordingId)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to rename recording: ${error.message}`)
        }

        return {
            success: true,
            recording: data
        }

    } catch (error) {
        console.error('Rename recording error:', error)
        throw createError({
            statusCode: 500,
            message: error.message
        })
    }
})
