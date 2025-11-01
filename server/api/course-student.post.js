export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id") || !responseBody.hasOwnProperty("student_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }
    try {
        let result;
        if (responseBody.hasOwnProperty('status')) {
            result = await supabaseClient
                .from('course_class_participation_transactions')
                .select('*')
                .eq('course_id', responseBody.course_id)
                .eq('student_id', responseBody.student_id)
                .eq('status', responseBody.status)
                .order('week', { ascending: true })
        } else {
            result = await supabaseClient
                .from('course_class_participation_transactions')
                .select('*')
                .eq('course_id', responseBody.course_id)
                .eq('student_id', responseBody.student_id)
                .order('week', { ascending: true })

        }

        if (result.error) {
            throw new Error(result.error.message);
        }
        const result2 = await supabaseClient
            .from('student_course')
            .select('coin_balance')
            .eq('course_id', responseBody.course_id)
            .eq('student_id', responseBody.student_id)
            .single()

        if (result2.error) {
            throw new Error(result2.error.message);
        }

        return {
            ok: true,
            data: result.data,
            coin_balance: result2.data.coin_balance
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }
});