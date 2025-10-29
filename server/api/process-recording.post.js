import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    const { recordingId } = body

    if (!recordingId) {
        throw createError({
            statusCode: 400,
            message: 'Recording ID is required'
        })
    }

    try {
        
        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        
        const { data: recording, error: fetchError } = await supabase
            .from('recordings')
            .select('*')
            .eq('id', recordingId)
            .single()

        if (fetchError || !recording) {
            throw new Error('Recording not found')
        }

        // Check if already processed
        if (recording.status === 'completed') {
            return {
                success: true,
                message: 'Recording already processed',
                transcript: recording.transcript
            }
        }

        // Handle corrupt or stuck uploads
        if (recording.status === 'uploading') {
            throw new Error('Recording upload is incomplete or corrupted. Please try recording again.')
        }

        // Update status to processing (from 'pending' or 'failed')
        await supabase
            .from('recordings')
            .update({
                status: 'processing',
                error_message: null
            })
            .eq('id', recordingId)

        console.log(`Processing recording ${recordingId}...`)

        
        const { data: audioData, error: downloadError } = await supabase.storage
            .from('audio-recordings')
            .download(recording.audio_path)

        if (downloadError || !audioData) {
            throw new Error(`Failed to download audio: ${downloadError?.message}`)
        }

        console.log('Audio downloaded from storage, size:', audioData.size)

        
        const arrayBuffer = await audioData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        
        const groqFormData = new FormData()
        const blob = new Blob([buffer], { type: 'audio/webm' })
        groqFormData.append('file', blob, 'recording.webm')
        groqFormData.append('model', 'whisper-large-v3-turbo')
        groqFormData.append('language', 'en')
        groqFormData.append('response_format', 'json')

        
        const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.groqApiKey}`
            },
            body: groqFormData
        })

        if (!groqResponse.ok) {
            const error = await groqResponse.text()
            throw new Error(`Groq API error: ${error}`)
        }

        const groqResult = await groqResponse.json()
        const transcript = groqResult.text

        console.log('Transcription successful, length:', transcript.length)

        
        const words = transcript.split(/\s+/)
        const previewWords = words.slice(0, 500).join(' ')
        const preview = previewWords + (words.length > 500 ? '...' : '')

        
        console.log('Generating AI summary...')
        let summary = ''

        try {
            const summaryPrompt = `You are an expert academic note-taker. Summarize this lecture transcript into clear, structured notes for revision.

Use Markdown formatting with:
- ## Headings for each major topic
- Bullet points for sub-concepts
- **Bold** for key definitions
- Highlight important examples and lecturer explanations

Keep it concise but complete — like class notes you'd review before an exam.
If the lecture included frameworks, formulas, or case examples, summarize them clearly with short explanations.

Transcript:
${transcript}

Provide the summary in Markdown format:`

            const summaryResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'user',
                            content: summaryPrompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000
                })
            })

            if (summaryResponse.ok) {
                const summaryResult = await summaryResponse.json()
                summary = summaryResult.choices[0].message.content
                console.log('AI summary generated successfully, length:', summary.length)
            } else {
                console.error('Failed to generate summary:', await summaryResponse.text())
                summary = 'Summary generation failed. Please review the transcript manually.'
            }
        } catch (summaryError) {
            console.error('Summary generation error:', summaryError)
            summary = 'Summary generation failed. Please review the transcript manually.'
        }

        
        const { data: updatedRecording, error: updateError } = await supabase
            .from('recordings')
            .update({
                status: 'completed',
                transcript: transcript,
                summary: summary,
                preview: preview,
                word_count: words.length,
                processed_at: new Date().toISOString()
            })
            .eq('id', recordingId)
            .select()
            .single()

        if (updateError) {
            throw new Error(`Failed to update recording: ${updateError.message}`)
        }

        console.log('Recording processed successfully:', recordingId)

        return {
            success: true,
            message: 'Transcription completed',
            data: updatedRecording
        }

    } catch (error) {
        console.error('Processing error:', error)

        
        const supabase = createClient(
            config.public.supabaseUrl,
            config.supabaseServiceRoleKey
        )

        await supabase
            .from('recordings')
            .update({
                status: 'failed',
                error_message: error.message,
                processed_at: new Date().toISOString()
            })
            .eq('id', recordingId)

        throw createError({
            statusCode: 500,
            message: error.message || 'Failed to process recording'
        })
    }
})
