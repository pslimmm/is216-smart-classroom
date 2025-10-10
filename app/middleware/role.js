export default defineNuxtRouteMiddleware((to, from) => {
    const { role } = useRole();

    const noRoleRoutes = ['/login', '/register'];
    const commonRoutes = ['/forbidden', '/']
    const loggedInRoutes = ['/profile', '/profile', '/dashboard', '/courses'];
    const studentRoutes = ['/student', '/marketplace'];
    const taRoutes = ['/ta', '/classreport'];
    const profRoutes = ['/prof', '/marketplace', '/classreport'];

    if(role.value == null && ![...noRoleRoutes, ...commonRoutes].includes(to.path)){
        return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
    } else if(role.value == "ta" && !([...loggedInRoutes, ...taRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
    } else if(role.value == "prof" && !([...loggedInRoutes, ...profRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
    } else if(role.value == "student" && !([...loggedInRoutes, ...studentRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
        return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
    }

});
