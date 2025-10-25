export default defineNuxtRouteMiddleware((to, from) => {

    const { role, session } = useAuthState();

    const commonRoutes = ['/forbidden', '/'];
    const noRoleRoutes = ['/auth', ...commonRoutes];
    const loggedInRoutes = ['/profile', '/dashboard', '/courses', ...commonRoutes];
    const studentRoutes = ['/student', '/marketplace', '/notes', ...loggedInRoutes];
    const taRoutes = ['/ta', '/classreport', '/notes', loggedInRoutes];
    const profRoutes = ['/prof', '/marketplace', '/classreport', '/notes', ...loggedInRoutes];

    const allowedRoutes = {
        student: studentRoutes,
        ta: taRoutes,
        prof: profRoutes,
    };

    // dont allow logged in users to access /auth
    if (role.value && to.path == '/auth') {
        return navigateTo(`/${role.value}`);
    }

    // allow access to noRoleRoutes and commonRoutes
    if ([...noRoleRoutes, ...commonRoutes].includes(to.path)) {
        return;
    }

    // if user is not logged in, redirect to /auth
    if (!role.value || !session.value) {
        return abortNavigation(showError({ statusMessage: "You don't have access to this page", statusCode: 401 }));
    }

    // check if the route is allowed for the user's role
    const allowed = allowedRoutes[role.value] || [];
    
    // all nested routes are allowed for the user's role
    if (role.value != null) {
        if (to.path.startsWith(`/${role.value}/`)) {
            return;
        }
    }

    if (!allowed.includes(to.path)) {
        return abortNavigation(showError({ statusMessage: "You don't have access to this page", statusCode: 401 }));
    }
});