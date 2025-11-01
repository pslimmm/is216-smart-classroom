export const useAuthState = () => {

    // check if authState exists in localStorage, sets session and role to null if not
    const session = useState(
        'session', 
        () => JSON.parse(localStorage.getItem('authState') || '{}').session || null
    );
    const role = useState(
        'role', 
        () => JSON.parse(localStorage.getItem('authState') || '{}').role || null
    );
    const userID = useState(
        'user_id', 
        () => JSON.parse(localStorage.getItem('authState') || '{}').user_id || null
    );
    // sets all values and stores it to localStorage for persistence (refreshes dont log the user out)
    const setAuthState = (sessionData, userRole, user_id) => {
        session.value = sessionData;
        role.value = userRole;
        userID.value = user_id;
        localStorage.setItem('authState', JSON.stringify({ session: sessionData, role: userRole , user_id : user_id}));
    };

    // for logout
    const clearAuthState = () => {
        session.value = null;    
        role.value = null;
        userID.value = null;
        localStorage.removeItem('authState');
        navigateTo('/');
    };

    return {
        session,
        role,
        userID,
        setAuthState,
        clearAuthState
    };

}