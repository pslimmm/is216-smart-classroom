export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("data")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        const { error } = await supabaseClient
            .from('marketplace_transactions')
            .insert(responseBody.data)

        if (error) {
            throw new Error(error.message);
        }

        const { error: error2 } = await supabaseClient
            .from('student_course')
            .update({coin_balance: responseBody.updated_coin})
            .eq('student_id', responseBody.student_id)

        if (error2) {
            throw new Error(error2.message);
        }
        
        const { error: error3 } = await supabaseClient
            .from('cart')
            .delete()
            .eq('student_id', responseBody.student_id)
            .eq('course_id', responseBody.course_id)

        if (error3) {
            throw new Error(error3.message);
        }
        
        return {
            ok: false,
            error: null
        };
    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});