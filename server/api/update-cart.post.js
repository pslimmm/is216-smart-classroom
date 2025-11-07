export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("student_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        if (responseBody.action == 'add') {
            let currStock = 0;
            const result1 = await supabaseClient
                .from('cart')
                .select('*')
                .eq('item_id', responseBody.item_id)
                .eq('student_id', responseBody.student_id)
                .eq('course_id', responseBody.course_id)
                .maybeSingle();
            if (result1.data != null) {
                currStock = result1.data.qty;
                const { error } = await supabaseClient
                    .from('cart')
                    .update({
                        qty: currStock + 1
                    })
                    .eq('item_id', responseBody.item_id)
                    .eq('student_id', responseBody.student_id)
                    .eq('course_id', responseBody.course_id);

                if (error) {
                    throw new Error(error.message);
                }
            } else {

                const { error } = await supabaseClient
                    .from('cart')
                    .insert({
                        student_id: responseBody.student_id,
                        course_id: responseBody.course_id,
                        item_id: responseBody.item_id,
                        qty: 1,
                    });

                if (error) {
                    throw new Error(error.message);
                }
            }
        } else if (responseBody.action == 'delete') {
            const { error } = await supabaseClient
                .from('cart')
                .delete()
                .eq('item_id', responseBody.item_id)
                .eq('student_id', responseBody.student_id)
                .eq('course_id', responseBody.course_id);

            if (error) {
                throw new Error(error.message);
            }
        }


        return {
            ok: true
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});