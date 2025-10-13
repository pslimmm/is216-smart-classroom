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

    // sets all values and stores it to localStorage for persistence (refreshes dont log the user out)
    const setAuthState = (sessionData, userRole) => {
        session.value = sessionData
        role.value = userRole
        localStorage.setItem('authState', JSON.stringify({ session: sessionData, role: userRole }));
    };

    // for logout
    const clearAuthState = () => {
        session.value = null
        role.value = null
        localStorage.removeItem('authState');
        navigateTo('/auth');
    };

    return {
        session,
        role,
        setAuthState,
        clearAuthState
    };

}