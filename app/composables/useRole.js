export const useRole = () => {
    const role = useState('role', () => localStorage.getItem('role') || null);
    
    const setRole = (newRole) => {
        localStorage.setItem('role', newRole);
        role.value = newRole;
    };

    const clearRole = () => {
        localStorage.removeItem('role');
        role.value = "";
        navigateTo('/');
    }

    onNuxtReady(() => {
        role.value = localStorage.getItem('role');
    });

    return { role, setRole, clearRole };
}