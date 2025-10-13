export const useAuthState = () => {
    const session = useState('user', () => null)
    const role = useState('role', () => null)

    const setAuthState = (sessionData, userRole) => {
        session.value = sessionData
        role.value = userRole
    }

    const clearAuthState = () => {
        session.value = null
        role.value = null
        navigateTo('/login');
    }

    return {
        session,
        role,
        setAuthState,
        clearAuthState
    }

}