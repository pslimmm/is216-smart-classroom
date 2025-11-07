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
        
        if (error) {
            throw new Error(error.message);
        }

        let imgPathParts = responseBody.image.split('/');
        const imgPath = imgPathParts[imgPathParts.length - 1];

        const { error: er2 } = await supabaseClient
            .storage
            .from('marketplace')
            .remove([imgPath]);

        if(er2){
            throw new Error(er2.message)
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