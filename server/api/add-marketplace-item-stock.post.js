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
            .update({item_count: responseBody.item_stock})
            .eq('id', responseBody.item_id)

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