export default defineEventHandler(async (event) => {
    const responseBody = await readBody(event);


    try {
        // cited from supabase docs: https://supabase.com/docs/reference/javascript/auth-signup
        // If Confirm email is enabled, a user is returned but session is null.
        // If Confirm email is disabled, both a user and a session are returned.
        // confirm email is indeed enabled, but we are not returning user/session info to client

        const result1 = await supabaseClient.auth.signInWithPassword({
            email: responseBody.email,
            password: responseBody.password
        });
        
        if(result1.error){
            throw new Error("Invalid credentials, check your email or password");
        }

        // get role of the logged in user
        const result2 = await supabaseClient
            .from('profile')
            .select('*')
            .eq('user_id', result1.data.user.id)
            .single();

        if(result2.error){
            throw new Error(result2.error.message);
        }

        return {
            ok: true,
            session: result1.data.session,
            role: result2.data.role,
            user_id: result2.data.user_id
        }
    } catch (e) {
        return {
            ok: false,
            error: e.message
        };
    }

});
