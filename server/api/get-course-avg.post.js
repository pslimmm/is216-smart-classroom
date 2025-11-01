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
            .select('*', { count: 'exact' })
            .eq('course_id', responseBody.course_id)

        const studentCount = result1.count;

        let result2;
        let courseAvg;
        if (responseBody.hasOwnProperty('week')) {
            result2 = await supabaseClient
                .from('course_class_participation_transactions')
                .select('rating')
                .eq('course_id', responseBody.course_id)
                .eq('week', responseBody.week)
                .eq('status', 'approved');
            
            const totalRating = result2.data.reduce((s, c) => s + parseInt(c.rating), 0)
            courseAvg = totalRating / (studentCount * 3)

        } else if (responseBody.hasOwnProperty('totalWeeks')) {

            result2 = await supabaseClient
                .from('course_class_participation_transactions')
                .select('rating')
                .eq('course_id', responseBody.course_id)
                .eq('status', 'approved');

            const totalRating = result2.data.reduce((s, c) => s + parseInt(c.rating), 0)
            courseAvg = totalRating / (studentCount * 3 * responseBody.totalWeeks)
        }
        if (result2.error) {
            throw new Error(result2.error.message);
        }

        return {
            ok: true,
            courseAvg: courseAvg
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }
});