export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id") || !responseBody.hasOwnProperty("student_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {

        const result = await supabaseClient
            .from('cart')
            .select(`*,
                item:item_id(*)
            `)
            .eq('course_id', responseBody.course_id)
            .eq('student_id', responseBody.student_id)
        
            if (result.error) {
            throw new Error(result.error.message);
        }
        return {
            ok: true,
            cart: result.data
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});