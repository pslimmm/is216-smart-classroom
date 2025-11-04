export default defineEventHandler(async (event) => {

    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("prof_id")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }
    try {
        let url = null;
        if (responseBody.base64Image) {
            const fileName = `${Date.now()}-${responseBody.item_name}.jpg`;
            const base64Data = responseBody.base64Image.replace(/^data:image\/\w+;base64,/, '')
            const buffer = Buffer.from(base64Data, 'base64')
            const blob = new Blob([buffer], { type: 'image/jpeg' })

            await supabaseClient
                .storage
                .from('marketplace')
                .upload(fileName, blob);

            const { data, error } = supabaseClient
                .storage
                .from('marketplace')
                .getPublicUrl(fileName);

            url = data.publicUrl;
        }

        const { error } = await supabaseClient
            .from('marketplace')
            .insert({
                item_name: responseBody.item_name,
                item_price: responseBody.item_price,
                item_count: responseBody.item_count,
                img_url: url,
                prof_id: responseBody.prof_id
            })

        if (error) {
            throw new Error(error.message);
        }
        return {
            ok: true
        }

    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }

});