export const createProfile = async (user, userData) => {
    const { data, selectError } = await supabaseClient
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

    if(selectError){
        return {error: {statusMessage: "Error: " + selectError.name, statusCode: selectError.status}}
    }
    if(data){
        return {error: {statusMessage: "Error: Profile already exists", statusCode: 488}};
    } else {
        const { insertError } = await supabaseClient
        .from('profile')
        .insert({
            user_id: user.id,
            full_name: userData.fullName,
            role: userData.role
        });

        if(insertError){
            return {error: {statusMessage: "Error: " + insertError.name, statusCode: insertError.status}};
        }
    }

    return;
}