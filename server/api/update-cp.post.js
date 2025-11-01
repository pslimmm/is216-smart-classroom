export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);

    if (!responseBody.hasOwnProperty("prof_id") || !responseBody.hasOwnProperty("transaction_id") || !responseBody.hasOwnProperty("action")) {
        return {
            ok: false,
            error: { statusMessage: "Unauthorized Request", statusCode: 403 }
        };
    }

    try {
        let error;
        if (responseBody.action == 'approved') {
            const result = await supabaseClient
                .from('course_class_participation_transactions')
                .update({
                    'status': responseBody.action,
                    'prof_remarks': responseBody.remarks,
                    'coins_awarded': responseBody.coins_awarded
                })
                .eq('id', responseBody.transaction_id)
            error = result.error
        } else if (responseBody.action == 'rejected') {
            
            const result = await supabaseClient
                .from('course_class_participation_transactions')
                .update({
                    'status': responseBody.action,
                    'prof_remarks': responseBody.remarks,
                    'coins_awarded': 0
                    })
                .eq('id', responseBody.transaction_id)
            error = result.error;
        }

        if (error) {
            throw new Error(error.message);
        }


    } catch (e) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + e.message, statusCode: 420 }
        };
    }
});