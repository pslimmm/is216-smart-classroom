export default defineEventHandler(async (event) => {
    // accepts role and user id
    const responseBody = await readBody(event);

    let error;
    if (!responseBody.hasOwnProperty("role") || !responseBody.hasOwnProperty("user_id") || !responseBody.hasOwnProperty("session")) {
        error = {
            name: "Unauthorized Request",
            status: 403
        }
    }

    if (responseBody.role == 'student') {
            const courses = await supabaseClient
        .from('profile')
        .select('role')
        .eq('user_id', data.user.id)
    } else if (responseBody.role == 'ta') {

    } else if (responseBody.role == 'prof') {

    } else {
        error = {
            name: "Unrecognized role",
            status: 403
        }
    }


    if (!error) {
        return {
            ok: true,
            
        }
    } else {
        return {
            ok: false,
            error: { statusMessage: "Error: " + error.name, statusCode: error.status }
        };

    }
});