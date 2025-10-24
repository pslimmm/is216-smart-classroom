export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);

    // cited from supabase docs: https://supabase.com/docs/reference/javascript/auth-signup
    // If Confirm email is enabled, a user is returned but session is null.
    // If Confirm email is disabled, both a user and a session are returned.
    // confirm email is indeed enabled, but we are not returning user/session info to client
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: responseBody.email,
        password: responseBody.password
    });

    if (error) {
        return {
            ok: false,
            error: "Invalid credentials, check your email or password"
        };
    } else {
        // get role of the logged in user
        const role = await supabaseClient
            .from('profile')
            .select('role')
            .eq('user_id', data.user.id)
            .single();

        return {
            ok: true,
            session: data.session,
            role: role.data.role,
            user_id: data.user.id
        }
    }
});
