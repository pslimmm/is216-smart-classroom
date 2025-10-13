export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);

    // cited from supabase docs: https://supabase.com/docs/reference/javascript/auth-signup
    // If Confirm email is enabled, a user is returned but session is null.
    // If Confirm email is disabled, both a user and a session are returned.
    // confirm email is indeed enabled, but we are not returning user/session info to client
    const { data, error } = await supabaseClient.auth.signUp({
        email: responseBody.email,
        password: responseBody.password
    });

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