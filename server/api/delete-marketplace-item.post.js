export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("item_id")) {

        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }


    try {

        const { error } = await supabaseClient
            .from('marketplace')
            .delete()
            .eq('id', responseBody.item_id)
            .eq('prof_id', responseBody.prof_id)
        if (error) {
            throw new Error(error.message);
        }
        return {
            ok: true,
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});