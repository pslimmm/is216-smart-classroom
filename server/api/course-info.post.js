export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {

        const result = await supabaseClient
            .from('course')
            .select('*')
            .eq('id', responseBody.course_id)
            .maybeSingle();

        if (result.error) {
            throw new Error(result.error.message);
        }
        return {
            ok: true,
            courseData: result.data
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});