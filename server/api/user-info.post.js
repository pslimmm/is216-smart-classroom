export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);

    if ( !responseBody.hasOwnProperty("user_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        const result = await supabaseClient
            .from('profile')
            .select('*')
            .eq('user_id', responseBody.user_id)
            .single();

        if (result.error) {
            throw new Error(result.error.message);
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