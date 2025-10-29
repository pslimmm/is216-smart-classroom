export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            message: 'No file uploaded'
        })
    }

    // Extract form fields
    const audioFile = formData.find(item => item.name === 'file')
    const userId = formData.find(item => item.name === 'userId')?.data.toString()
    const userRole = formData.find(item => item.name === 'userRole')?.data.toString()
    const week = formData.find(item => item.name === 'week')?.data.toString()
    const durationSeconds = formData.find(item => item.name === 'duration')?.data.toString()
    const title = formData.find(item => item.name === 'title')?.data.toString()
    const courseId = formData.find(item => item.name === 'courseId')?.data.toString()

    // Validate required fields
    if (!audioFile || !userId || !userRole || !week || !title || !courseId) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: file, userId, userRole, week, title, or courseId'
        })
    }

    // Verify user role (only prof and ta can upload)
    if (!['prof', 'ta'].includes(userRole)) {
        throw createError({
            statusCode: 403,
            message: 'Only professors and TAs can upload recordings'
        })
    }

    try {
        // Generate unique recording ID
        const recordingId = crypto.randomUUID()

        // Sanitize title for filename (remove special characters, limit length)
        const sanitizedTitle = title
            .trim()
            .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase()
            .substring(0, 50) // Limit to 50 characters

        // Storage path: {user_id}/{sanitizedTitle}_{recordingId}.webm
        const storagePath = `${userId}/${sanitizedTitle}_${recordingId}.webm`

        // STEP 1: Create database record FIRST with status 'uploading'
        // This ensures we track all upload attempts, even if storage fails
        const { data: dbData, error: dbError } = await supabaseClient
            .from('recordings')
            .insert({
                id: recordingId,
                user_id: userId,
                course_id: courseId ? parseInt(courseId) : null,
                week: week,
                title: title.trim(),
                audio_path: storagePath,
                audio_size: audioFile.data.length,
                duration_seconds: durationSeconds ? parseInt(durationSeconds) : null,
                status: 'uploading', // Track upload in progress
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (dbError) {
            console.error('Database insert error:', dbError)
            // Fail fast - nothing to clean up yet
            throw new Error(`Database error: ${dbError.message}. Please try recording again.`)
        }

        console.log('Database record created (uploading):', recordingId)

        // STEP 2: Upload audio to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('audio-recordings')
            .upload(storagePath, audioFile.data, {
                contentType: audioFile.type || 'audio/webm',
                upsert: false
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)

            // Mark record as failed in database (don't delete - user can retry)
            await supabaseClient
                .from('recordings')
                .update({
                    status: 'failed',
                    error_message: `Storage upload failed: ${uploadError.message}`
                })
                .eq('id', recordingId)

            throw new Error(`Failed to upload audio: ${uploadError.message}`)
        }

        console.log('Audio uploaded to storage:', uploadData.path)

        // STEP 3: Update status to 'pending' (ready for processing)
        const { error: updateError } = await supabaseClient
            .from('recordings')
            .update({ status: 'pending' })
            .eq('id', recordingId)

        if (updateError) {
            console.error('Failed to update status to pending:', updateError)
            // Don't throw - recording exists and can be processed
        }

        return {
            success: true,
            recordingId: recordingId,
            message: 'Audio uploaded successfully. Processing will begin shortly.',
            data: dbData
        }

    } catch (error) {
        console.error('Upload error:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to upload recording'
        })
    }
})
