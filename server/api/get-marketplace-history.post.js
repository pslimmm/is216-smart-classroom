export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        let result;
        if (responseBody.hasOwnProperty('student_id')) {

            result = await supabaseClient
                .from('marketplace_transactions')
                .select(`*,
                item:item_id(*)`)
                .eq('course_id', responseBody.course_id)
                .eq('student_id', responseBody.student_id)

            if (result.error) {
                throw new Error(result.error.message);
            }

        } else if (responseBody.hasOwnProperty('prof_id')){
            result = await supabaseClient
                .from('marketplace_transactions')
                .select(`*,
                student:student_id(full_name),
                item:item_id(*),
                course:course_id(course_name)`)
                .eq('course_id', responseBody.course_id)
                .eq('item.prof_id', responseBody.prof_id)
            
            console.log(result);
            if (result.error) {
                throw new Error(result.error.message);
            }
        }
        return {
            ok: true,
            data: result.data
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});