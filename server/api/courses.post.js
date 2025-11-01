export default defineEventHandler(async (event) => {
    
    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("role") || !responseBody.hasOwnProperty("user_id") || !responseBody.hasOwnProperty("session")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        let data;
        let error;

        if (responseBody.role == 'student') {
            const result = await supabaseClient
                .from('student_course')
                .select(`
                    *,
                    student_profile:profile!student_course_student_id_fkey(
                    full_name
                    ),
                    course_info:course!student_course_course_id_fkey(
                    course_code,
                    course_section, 
                    course_term,
                    course_name,
                    course_time,
                    course_location,
                    prof_profile:profile!course_prof_id_fkey1(
                        full_name
                    )
                    )
                `)
                .eq('student_id', responseBody.user_id)
                .eq('status', 'ongoing');
            data = result.data;
            error = result.error;
        } else if (responseBody.role == 'ta') {
            const result = await supabaseClient
                .from('course_ta')
                .select(`
                    *,
                    course_info:course!course_ta_course_id_fkey(
                    course_code,
                    course_section, 
                    course_term,
                    course_name,
                    course_time,
                    course_location,
                    prof_profile:profile!course_prof_id_fkey1(
                        full_name
                    )
                    )
                `)
                .eq('ta_id', responseBody.user_id);
            data = result.data;
            error = result.error;
        } else if (responseBody.role == 'prof') {
            const result = await supabaseClient
                .from('course')
                .select(`
                    *,
                    prof_profile:profile!course_prof_id_fkey1(
                    full_name
                    )
                `)
                .eq('prof_id', responseBody.user_id);
            data = result.data;
            error = result.error;
        }

        if (error) {
            throw new Error(error.message);
        }
        
        const imageData = supabaseClient.storage
            .from('course-images')
            .getPublicUrl('placeholder.png');

        return {
            ok: true,
            data: data,
            imageUrl: imageData.data.publicUrl
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.name, statusCode: 420 }
        };
    }

});