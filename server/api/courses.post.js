export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);
    // const { data, error } = await supabaseClient.

    if (error) {
        return {
            ok: false,
            error: { statusMessage: "Error: " + error.name, statusCode: error.status }
        };
    } else {
        const profileError = await createProfile(data.user, responseBody);

        if (profileError) {
            return {
                ok: false,
                error: profileError
            };

        }
        return {
            ok: true,
            message: "Registration successful. Please check your email to confirm your account."
        }
    }
});