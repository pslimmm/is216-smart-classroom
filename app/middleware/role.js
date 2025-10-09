export default defineNuxtRouteMiddleware((to, from) => {
    const { role } = useRole();

    const noRoleRoutes = ['/login', '/register'];
    const commonRoutes = ['/forbidden', '/']
    const loggedInRoutes = ['/profile', '/profile', '/dashboard', '/courses'];
    const studentRoutes = ['/student', '/marketplace'];
    const taRoutes = ['/ta', '/class-report'];
    const profRoutes = ['/prof', '/marketplace', '/class-report'];

    if(role.value == null && ![...noRoleRoutes, ...commonRoutes].includes(to.path)){
        return navigateTo('/forbidden');
    } else if(role.value == "ta" && !([...loggedInRoutes, ...taRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return navigateTo('/forbidden');
    } else if(role.value == "prof" && !([...loggedInRoutes, ...profRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return navigateTo('/forbidden');
    } else if(role.value == "student" && !([...loggedInRoutes, ...studentRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return navigateTo('/forbidden');
    }

});
