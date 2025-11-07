export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("prof_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {

        const { data, error} = await supabaseClient
            .from('marketplace')
            .select('*')
            .eq('prof_id', responseBody.prof_id)

        if (error) {
            throw new Error(error.message);
        }
        return {
            ok: true,
            products: data
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});