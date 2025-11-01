export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const formData = await readMultipartFormData(event);
    
    if (!formData) {
        throw createError({
            statusCode: 400,
            message: 'No file uploaded'
        });
    }

    const audioFile = formData.find(item => item.name === 'file');
    
    if (!audioFile) {
        throw createError({
            statusCode: 400,
            message: 'Audio file is required'
        });
    }

    try {
        // Create FormData for Groq API
        const groqFormData = new FormData();
        const blob = new Blob([audioFile.data], { type: audioFile.type });
        groqFormData.append('file', blob, audioFile.filename || 'audio.webm');
        groqFormData.append('model', 'whisper-large-v3-turbo');
        groqFormData.append('language', 'en');
        groqFormData.append('response_format', 'json');

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.groqApiKey}`
            },
            body: groqFormData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const result = await response.json();
        
        console.log('Transcription successful:', result.text.substring(0, 100) + '...');
        
        return { 
            success: true, 
            transcript: result.text 
        };

    } catch (error) {
        console.error('Transcription error:', error);
        throw createError({
            statusCode: 500,
            message: error.message || 'Transcription failed'
        });
    }
});