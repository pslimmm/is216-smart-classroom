export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("course_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {

        const result1 = await supabaseClient
            .from('student_course')
            .select(`
                *,
                student:student_id(*)
                `)
            .eq("course_id", responseBody.course_id);

        if (result1.error) {
            throw new Error(result1.error.message);
        }

        const result2 = await supabaseClient
            .from('course_class_participation_transactions')
            .select(`
            *,
            student:student_id(
                id,
                user_id,
                full_name,
                role
            ),
            ta:ta_id(
                id,
                user_id,
                full_name,
                role
            )
            `)
            .eq('course_id', responseBody.course_id)

        if (result2.error) {
            throw new Error(result2.error.message);
        }
        
        return {
            ok: true,
            allStudents: result1.data,
            classParticipationData: result2.data,
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});