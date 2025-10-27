export default defineEventHandler(async (event) => {
    // accepts role and user id
    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id") || !responseBody.hasOwnProperty("ta_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        const { data } = await supabaseClient
            .from('course_ta')
            .select('*')


        if (data.length < 1) {
            return {
                ok: false,
                error: { statusMessage: "Unauthorized Request", statusCode: 403 }
            };
        }

        const { error } = await supabaseClient
            .from('course_class_participation_transactions')
            .insert({
                ta_id: responseBody.ta_id,
                course_id: responseBody.course_id,
                student_id: responseBody.student_id,
                week: responseBody.week,
                description: responseBody.description,
                rating: responseBody.rating,
                status: "pending"
            })
        if (error) {
            throw new Error(error.message + "possible insert error");
        }
        return {
            ok: true,
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});